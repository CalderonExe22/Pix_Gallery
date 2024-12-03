import PropTypes from "prop-types";
import { Tooltip } from "flowbite-react";

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
        <Tooltip content='Descargar' style="dark" placement="bottom">
            <button
                onClick={handleDownload}
                className="text-3xl relative p-2 transform transition-transform hover:scale-110">
                <i className="fa-solid fa-download"></i>
            </button> 
        </Tooltip>
    )
}

ButtonDownload.propTypes = {
    image_url: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
}