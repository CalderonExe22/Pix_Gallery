import { useState } from "react"
import axiosApi from "../../services/axiosApi"
import { Modal } from "flowbite-react"
import PropTypes from "prop-types"

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
            alert(`La imagen ahora es ${!privacy ? "pública" : "privada"}.`)
        } catch (error) {
            console.error(error)
            alert("Hubo un error al cambiar la privacidad.")
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
                        ¿Estás seguro de que deseas cambiar esta imagen a {privacy ? "privada" : "pública"}?
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