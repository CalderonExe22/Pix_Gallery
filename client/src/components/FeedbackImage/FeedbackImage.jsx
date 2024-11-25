import { useState } from "react";
import axiosApi from "../../services/axiosApi";
import PropTypes from "prop-types";
"use client";

import { Modal } from "flowbite-react";

export default function FeedbackImage({ image }) {
    const [feedbackImage, setFeedbackImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [openModal, setOpenModal] = useState(false)

    const feedbackImageFunction = async () => {
        setOpenModal(true)
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
        <>
            <button className="p-2 bg-[#b5179e] text-white font-bold" onClick={feedbackImageFunction}>
                Analizar Imagen
            </button>
            <Modal show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header>Recomendaciones de mejora</Modal.Header>
                <Modal.Body>
                <div className={`flex flex-col`}>
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
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={() => setOpenModal(false)}>I accept</button>
                    <button color="gray" onClick={() => setOpenModal(false)}>
                        Decline
                    </button>
                </Modal.Footer>
            </Modal>
            
        </>
    );
}

FeedbackImage.propTypes = {
    image: PropTypes.instanceOf(File).isRequired,
};
