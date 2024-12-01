import { useState } from "react"
import axiosApi from "../../services/axiosApi"
import { Modal, Button } from "flowbite-react"
import PropTypes from "prop-types"
import { toast, Bounce } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function DeleteButton({id, type}) {
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(false) 
    const handleDelete = async () => {
        setLoading(true)
        try {
            let response
            if (type === "photo") {
                response = await axiosApi.delete(`photos/photography/${id}/`) 
            } else if (type === "collection") {
                response = await axiosApi.delete(`photos/collections/${id}/`) 
            }
            console.log(response)
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
        }finally {
            setLoading(false)
            setShowModal(false)
        }
    }
    return (
        <div>       
            <button onClick={() => setShowModal(true)}>
                <i className="fa-solid fa-trash"></i>
            </button>
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <Modal.Header>Confirmar eliminación</Modal.Header>
                <Modal.Body>
                    <p className="text-sm text-gray-500">
                        ¿Estás seguro de que deseas eliminar esta {type === "photo" ? "Fotografía" : "Colección"}? Esta acción no se puede deshacer.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                        <Button
                        color="failure"
                        onClick={handleDelete}
                        disabled={loading}
                        className={`${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {loading ? "Eliminando..." : "Eliminar"}
                    </Button>
                    <Button color="gray" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

DeleteButton.propTypes = {
    id: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired
}