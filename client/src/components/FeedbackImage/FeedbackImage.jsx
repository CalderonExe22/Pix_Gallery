import { useState } from "react";
import axiosApi from "../../services/axiosApi";
import PropTypes from "prop-types";
"use client";

import { Modal } from "flowbite-react";

export default function FeedbackImage({ image }) {
    const [feedbackImage, setFeedbackImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [openModal, setOpenModal] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    console.log(openModal)
    const feedbackImageFunction = async () => {
        setIsLoading(true)
        setProgress(0)
        setErrorMessage(null)
        

        if(feedbackImage === null){

            let step = 0
            const simulationTime = 3000
            const intervalTime = 50
            const totalSteps = simulationTime / intervalTime

            const progressInterval = setInterval(() => {
                step++
                setProgress((step / totalSteps) * 100)
                if(step >= totalSteps){
                    clearInterval(progressInterval)
                }
            },intervalTime) 

            try {
                const data = new FormData();
                data.append("image", image);
                const response = await axiosApi.post("image/image-quality-check/", data);
                setTimeout(() => {
                    setFeedbackImage(response.data)
                    setIsLoading(false)
                    setOpenModal(true)
                }, simulationTime)
            } catch (error) {
                console.error(error);
                setErrorMessage("Ocurrió un error al analizar la imagen. Inténtalo de nuevo.");
                clearInterval(progressInterval)
                setIsLoading(false)
            }
        }else{
            setOpenModal(true)
            setIsLoading(false)
        }
    };
    console.log(feedbackImage)
    return (
        <>
            <button className={`relative p-4 ${isLoading ? 'bg-[#ddd]' : 'bg-[#b5179e]'} text-white font-bold flex items-center justify-center gap-2 overflow-hidden rounded-md`} onClick={feedbackImageFunction}>
                <span className="z-50">{isLoading ? 'Analizando...' : 'Analizar imagen'}  {feedbackImage !== null ? <i className="fa-solid fa-circle-check text-white"></i> : ''}</span>
                {isLoading && (
                    <div style={{ width: `${progress}%`, transitionDuration: "50ms" }} className={`absolute top-0 left-0 h-full  bg-[#b5179e] transition-all ease-out z-10`}>

                    </div>
                )}
            </button>
            <Modal size="7xl" show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header>Recomendaciones de mejora de imagen</Modal.Header>
                <Modal.Body>
                <div className={`grid grid-cols-7 gap-5`}>
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                    {feedbackImage ? (
                        <>
                            <div className="flex flex-col justify-start items-center gap-3 text-center border-e-2 border-black p-1">
                                <h1 className="font-medium text-xl">Formato</h1>
                                <p>{feedbackImage.format.feedback}</p>
                            </div>
                            <div className="flex flex-col justify-start items-center gap-3 text-center border-e-2 border-black p-1">
                            <h1 className="font-medium text-xl">Resolucion</h1>
                                <p>{feedbackImage.resolution.feedback}</p>
                            </div>
                            <div className="flex flex-col justify-start items-center gap-3 text-center border-e-2 border-black p-1">
                            <h1 className="font-medium text-xl">Contraste</h1>
                                <p>{feedbackImage.contrast.feedback}</p>
                            </div>
                            <div className="flex flex-col justify-start items-center gap-3 text-center border-e-2 border-black p-1 ">
                            <h1 className="font-medium text-xl">Exposicion</h1>
                                <p>{feedbackImage.exposure.feedback}</p>
                            </div>
                            <div className="flex flex-col justify-start items-center gap-3 text-center border-e-2 border-black p-1">
                            <h1 className="font-medium text-xl">Iluminacion</h1>
                                <p>{feedbackImage.illumination.feedback}</p>
                            </div>
                            <div className="flex flex-col justify-start items-center gap-3 text-center border-e-2 border-black p-1">
                            <h1 className="font-medium text-xl">Saturacion</h1>
                                <p>{feedbackImage.saturation.feedback}</p>
                            </div>
                            <div className="flex flex-col justify-start items-center gap-3 text-center">
                            <h1 className="font-medium text-xl">Balance de colores</h1>
                                <p>{feedbackImage.color_balance.feedback}</p>
                                <p>Rojo: {feedbackImage.color_balance.mean_colors.red}</p>
                                <p>Azul: {feedbackImage.color_balance.mean_colors.blue}</p>
                                <p>Verde: {feedbackImage.color_balance.mean_colors.green}</p>
                            </div>
                        </>
                    ) : (
                        !errorMessage && <p>...cargando</p>
                    )}
                </div>
                </Modal.Body>
            </Modal>
            
        </>
    );
}

FeedbackImage.propTypes = {
    image: PropTypes.instanceOf(File).isRequired,
};
