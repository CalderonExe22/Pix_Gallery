import { useState } from "react"
import axiosApi from "../../services/axiosApi"
import { Modal } from "flowbite-react"
import PropTypes from "prop-types"
import { Bounce, toast } from "react-toastify"

export default function PrivacyButton({id, isPublic, type}) {
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [privacy, setPrivacy] = useState(isPublic)
    
    const handlePrivacy = async () => {
        setLoading(true)
        try {
            let response 
            if(type === 'photo'){
                response = await axiosApi.patch(`photos/photography/${id}/toggle_privacy/`,{
                    is_public: !privacy,
                })
            }
            if(type === 'collection'){
                response = await axiosApi.patch(`photos/collections/${id}/toggle_privacy/`,{
                    is_public: !privacy,
                })
            }
            console.log(response)
            setPrivacy(!privacy)
            toast.success(`${type === "photo" ? "Fotografía" : "Colección"} eliminada correctamente.`, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            })
        } catch (error) {
            if(error?.response.status === 403){
                toast.error('Usuario no autorizado', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                })
            }else{
                toast.error('Ocurrió un error al intentar realizar la acción.', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                })
            }
        }finally{
            setLoading(false)
            setShowModal(false)
        }
    }


    return (
        <div>
            <button onClick={() => setShowModal(true)}>
                {privacy ? 'publica' : 'privada'}
            </button>
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <Modal.Header>Confirmar cambio de privacidad</Modal.Header>
                <Modal.Body>
                    <p className="text-sm text-gray-500">
                        ¿Estás seguro de que deseas cambiar esta {type === "photo" ? "Fotografía" : "Colección"} a {privacy ? "privada" : "pública"}?
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        color={privacy ? "gray" : "success"}
                        onClick={handlePrivacy}
                        disabled={loading}
                        className={`${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {loading ? "Cambiando..." : "Confirmar"}
                    </button>
                    <button color="gray" onClick={() => setShowModal(false)}>
                        Cancelar
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

PrivacyButton.propTypes = {
    id: PropTypes.number.isRequired,
    isPublic: PropTypes.bool.isRequired,
    type: PropTypes.string
}