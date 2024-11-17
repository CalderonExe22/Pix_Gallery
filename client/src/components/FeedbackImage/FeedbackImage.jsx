import { useState } from "react";
import axiosApi from "../../services/axiosApi";
import PropTypes from "prop-types";

export default function FeedbackImage({ image }) {
    const [feedbackImage, setFeedbackImage] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const feedbackImageFunction = async () => {
        setShowFeedback(!showFeedback)
        setErrorMessage(null)
        if(feedbackImage === null){
            try {
                const data = new FormData();
                data.append("image", image);
                const response = await axiosApi.post("image/image-quality-check/", data);
                setFeedbackImage(response.data);
            } catch (error) {
                console.error(error);
                setErrorMessage("Ocurrió un error al analizar la imagen. Inténtalo de nuevo.");
            }
        }
    };
    console.log(feedbackImage)
    return (
        <div>
            {!showFeedback ? (
                <button disabled={showFeedback} onClick={feedbackImageFunction} className="p-2 bg-[#b5179e] text-white rounded">
                    Analizar Imagen
                </button>
            ) : (
                <button onClick={() => setShowFeedback(!showFeedback)} className="p-2 bg-[#b5179e] text-white rounded">
                    Cerrar resultado
                </button>
            )}
            
            <div className={`flex flex-col ${showFeedback ? 'h-[400px]' : 'h-0 overflow-hidden'} transform transition-all duration-300`}>
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                {feedbackImage ? (
                    <>
                        <p>{feedbackImage.format.feedback}</p>
                        <p>{feedbackImage.resolution.feedback}</p>
                        <p>{feedbackImage.contrast.feedback}</p>
                        <p>{feedbackImage.exposure.feedback}</p>
                        <p>{feedbackImage.illumination.feedback}</p>
                        <p>{feedbackImage.saturation.feedback}</p>
                        <p>{feedbackImage.color_balance.feedback}</p>
                        <p>red: {feedbackImage.color_balance.mean_colors.red}</p>
                        <p>blue: {feedbackImage.color_balance.mean_colors.blue}</p>
                        <p>green: {feedbackImage.color_balance.mean_colors.green}</p>
                    </>
                ) : (
                    !errorMessage && <p>...cargando</p>
                )}
            </div>
        </div>
    );
}

FeedbackImage.propTypes = {
    image: PropTypes.instanceOf(File).isRequired,
};
