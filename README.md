## Guia de Instalación:
### Requisitos Previos:
Asegúrate de tener instalado Git, Node.js, Python. Puedes ejecutar los siguientes comandos en tu terminal:

* Para verificar la versión de Node.js (Usaremos la versión 10 o superior):
``` bash
node -v
```
* Para verificar la versión de Git:
``` bash
git --version
```
* Para verificar la versión de Python:
``` bash
py --version
```
Si no tienes instalado alguno de estos requisitos, puedes descargarlos e instalarlos desde los siguientes enlaces:
* [Descargar Node.js](https://nodejs.org/en/download)
* [Descargar Git](https://git-scm.com/downloads)
* [Descargar Python](https://www.python.org/downloads/)

### Instalación del Proyecto

1. Clona este repositorio. Abre tu terminal en la carpeta deseada y ejecuta el siguiente comando:
``` bash
git clone --branch master --single-branch https://github.com/CalderonExe22/Pix_Gallery.git
```
2. Navegar al backend (Django):
``` bash
cd Pix_Gallery/server
```
3. Crea y activa un entorno virtual (recomendado) para instalar las dependencias del backend:
``` bash
python -m venv venv
venv\Scripts\activate
```
4. Instala las dependencias de Django que están en el archivo requirements.txt:
``` bash
pip install -r requirements.txt
```
5. Crear una base de datos con el nombre Pix_Gallery:
6. configuración (settings.py) de tu base de datos:
![Captura de pantalla 2024-10-08 230043](https://github.com/user-attachments/assets/21084369-d4ba-427e-a060-5cf13f556ab9)
7. Aplica las migraciones de la base de datos:
``` bash
python manage.py migrate
```
8. Si necesitas un superusuario para el panel de administración de Django, créalo ejecutando:
``` bash
python manage.py createsuperuser
```
9. Navega al directorio del frontend (client):
``` bash
cd Pix_Gallery/client
```
10. Instala las dependencias de React usando npm:
``` bash
npm install
```
11.  Levantar ambos servidores:
``` bash
cd Pix_Gallery/server
python manage.py runserver

cd Pix_Gallery/client
npm run dev
```
12. Verificar si el proyecto esta corriendo correctamente desde la url proporcionada del frontend.
![Captura de pantalla 2024-10-08 231408](https://github.com/user-attachments/assets/78b9e330-9ef9-460a-a177-dee8842045c0)


