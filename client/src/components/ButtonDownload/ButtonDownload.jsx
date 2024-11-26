import PropTypes from "prop-types";

export default function ButtonDownload({ image_url, title }) {
    const handleDownload = async () => {
        try {
            const response = await fetch(image_url);
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = title;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        catch (error) {
            console.error('Error al descargar la imagen:', error);
        }
    };

    return (
        <button
            onClick={handleDownload}
            className="bg-green-600 text-white py-2 px-4">
            Descargar
        </button> 
    )
}

ButtonDownload.propTypes = {
    image_url: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
}