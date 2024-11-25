from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
import cv2 # OpenCv
import numpy as np # NumPy
from skimage.restoration import estimate_sigma # Scikit-Image para ruido
from PIL import Image

# Create your views here.


class ImageQualityCheck(APIView):
    parser_classes = [MultiPartParser, FormParser]
    
    def post(self, request, *args, **kwargs):
        
        image_file = request.FILES['image']
        image = self.read_image(image_file) # Pillow y OpenCV
        gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY) # OpenCV para escala de grises
        
        feedback = {}
        
        # Formato de imagen (Pillow)
        image_format = Image.open(image_file)
        check_image_format = image_format.format.upper()
        if check_image_format not in ['JPEG','JPG']:
            format_feedback = f"El formato de la imagen es {check_image_format}. Se recomienda usar JPEG o JPG para optimizar la calidad."
        else:
            format_feedback = "El formato de la imagen es adecuado (JPEG o JPG)."
        
        feedback['format'] = {"feedback": format_feedback}
        
        # Resolucion (Pillow)
        image_resolution = Image.open(image_file)
        width, height = image_resolution.size
        min_width, min_height = 1920, 1080
        if width < min_width or height < min_height:
            feedback_resolution = f"La resolución actual es {width}x{height}. Se recomienda una resolución mínima de {min_width}x{min_height}."
        else:
            feedback_resolution = "La resolución de la imagen es adecuada."

        feedback['resolution'] = {"feedback": feedback_resolution}
        
        # Exposición (NumPy + histograma)
        mean_brightness = np.mean(gray_image)  # Promedio de brillo
        hist, _ = np.histogram(gray_image, bins=256, range=(0, 256))
        dark_pixels = hist[:50].sum()  # Píxeles muy oscuros
        bright_pixels = hist[205:].sum()  # Píxeles muy brillantes
        total_pixels = gray_image.size

        # Proporciones de píxeles oscuros y brillantes
        dark_ratio = dark_pixels / total_pixels
        bright_ratio = bright_pixels / total_pixels

        if dark_ratio > 0.5:  # Más del 50% son oscuros
            exposure_feedback = "La imagen está subexpuesta."
            exposure_percentage = min(100, (mean_brightness / 50) * 100)
        elif bright_ratio > 0.5:  # Más del 50% son brillantes
            exposure_feedback = "La imagen está sobreexpuesta."
            # Ajustar para evitar porcentajes fuera de rango
            exposure_percentage = max(0, min(100, ((255 - mean_brightness) / (255 - 205)) * 100))
        else:
            exposure_feedback = "La exposición de la imagen es buena."
            exposure_percentage = 100

        feedback["exposure"] = {"feedback": exposure_feedback, "percentage": round(exposure_percentage, 2)}
        
        # Contraste
        # Calcular varianza de la Laplaciana
        blurred_image = cv2.GaussianBlur(gray_image, (5, 5), 0)
        # Calcular la varianza de la Laplaciana (para detectar el contraste)
        laplacian_var = cv2.Laplacian(blurred_image, cv2.CV_64F).var()
        # Definir los umbrales para el contraste bajo, normal o alto
        if laplacian_var < 15:
            contrast_feedback = "Contraste bajo."
        elif laplacian_var > 60:
            contrast_feedback = "Contraste muy alto."
        else:
            contrast_feedback = "Buen contraste."

        feedback["contrast"] = {"feedback": contrast_feedback}
        
        # Iluminación (Análisis por áreas)
        mean_brightness = np.mean(gray_image)  # Promedio global de brillo
        total_pixels = gray_image.size
        shadows = np.sum(gray_image < 30) / total_pixels  # Proporción de píxeles oscuros
        highlights = np.sum(gray_image > 225) / total_pixels  # Proporción de píxeles muy claros

        if shadows > 0.3 or mean_brightness < 50:
            illumination_feedback = "La imagen tiene poca iluminación."
            illumination_percentage = min(100, (mean_brightness / 50) * 50)  # Normaliza entre 0 y 50
        elif highlights > 0.3 or mean_brightness > 200:
            illumination_feedback = "La imagen tiene demasiada iluminación."
            illumination_percentage = min(100, 50 + ((mean_brightness - 200) / 55) * 50)  # Normaliza entre 50 y 100
        else:
            illumination_feedback = "La iluminación de la imagen es adecuada."
            illumination_percentage = 50 + ((mean_brightness - 50) / 150) * 50  # Normaliza entre 50 y 100
        
        feedback["illumination"] = {"feedback": illumination_feedback, "percentage": round(illumination_percentage, 2)}

        # Saturación (Análisis detallado en HSV)
        hsv_image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)  # Conversión a HSV
        saturation = hsv_image[:, :, 1]
        low_saturation_pixels = np.sum(saturation < 50) / saturation.size
        high_saturation_pixels = np.sum(saturation > 200) / saturation.size

        if low_saturation_pixels > 0.5:
            saturation_feedback = "La imagen está desaturada."
            saturation_percentage = min(100, max(0, (saturation.mean() / 50) * 50))
        elif high_saturation_pixels > 0.3:
            saturation_feedback = "La imagen está sobresaturada."
            saturation_percentage = min(100, max(50, ((saturation.mean() - 200) / 55) * 100))
        else:
            saturation_feedback = "La saturación de la imagen es buena."
            saturation_percentage = 50 + (saturation.mean() / 255) * 50

        feedback["saturation"] = {"feedback": saturation_feedback, "percentage": round(saturation_percentage, 2)}

        # Balance de colores
        (b, g, r) = cv2.split(image)  # Separar los canales BGR
        mean_blue = np.mean(b)
        mean_green = np.mean(g)
        mean_red = np.mean(r)

        # Calcular diferencias de los promedios
        diff_rg = abs(mean_red - mean_green)
        diff_rb = abs(mean_red - mean_blue)
        diff_gb = abs(mean_green - mean_blue)

        # Generar feedback basado en las diferencias
        if diff_rg < 10 and diff_rb < 10 and diff_gb < 10:
            color_feedback = "El balance de color es adecuado."
        elif mean_red > mean_green and mean_red > mean_blue:
            color_feedback = "La imagen tiene un tinte rojizo. Considere ajustar el balance de color."
        elif mean_green > mean_red and mean_green > mean_blue:
            color_feedback = "La imagen tiene un tinte verdoso. Considere ajustar el balance de color."
        elif mean_blue > mean_red and mean_blue > mean_green:
            color_feedback = "La imagen tiene un tinte azulado. Considere ajustar el balance de color."
        else:
            color_feedback = "La imagen tiene un desequilibrio en el balance de color."

        # Agregar al feedback general
        feedback["color_balance"] = {
            "feedback": color_feedback,
            "mean_colors": {
                "red": round(mean_red, 2),
                "green": round(mean_green, 2),
                "blue": round(mean_blue, 2),
            }
        }
        
        return Response(feedback)
    
    def read_image(self, image_file):
        file_bytes = np.frombuffer(image_file.read(), np.uint8) # NumPy para manejar bytes
        image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)  # OpenCV para decodificar la imagen
        return image