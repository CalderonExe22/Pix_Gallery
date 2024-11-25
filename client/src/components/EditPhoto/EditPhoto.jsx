import PropTypes from 'prop-types';
import FormEditPhoto from "../FormEditPhoto/FormEditPhoto";
import { Modal } from "flowbite-react"
import { useState } from 'react';
export default function EditPhoto({photoData}) {
    const [showModal, setShowModal] = useState(false)
    console.log(photoData)
    return (
        <div>
            <button onClick={() => setShowModal(true)}>
                <i className="fa-solid fa-pen"></i>
            </button>
            <Modal size='7xl' show={showModal} onClose={() => setShowModal(false)}>
                <Modal.Header>Editar fotografia</Modal.Header>
                <Modal.Body>
                    <div className='flex justify-center items-center h-full w-full'>
                        <div className="flex justify-center items-center w-full h-full rounded-md m-20">
                            <img className="object-cover h-full w-full rounded-md" src={photoData.image_url} alt="vista-previa" />
                        </div>
                        <div className={`flex w-full overflow-y-auto justify-center items-start h-[900px] transform transition-all duration-500`}>
                            <FormEditPhoto photoData={photoData}/>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

EditPhoto.propTypes = {
    photoData: PropTypes.object.isRequired,
}