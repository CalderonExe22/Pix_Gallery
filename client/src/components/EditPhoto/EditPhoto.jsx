import PropTypes from 'prop-types';
import FormEditPhoto from "../FormEditPhoto/FormEditPhoto";
import { Modal } from "flowbite-react"
import { useState } from 'react';
import { Tooltip } from "flowbite-react";

export default function EditPhoto({photoData}) {
    const [showModal, setShowModal] = useState(false)
    console.log(photoData)
    return (
        <>
            <Tooltip content='Editar fotografia' style='dark' placement='bottom' >
                <button className='text-lg transform transition-transform hover:scale-110 p-2' onClick={() => setShowModal(true)}>
                    <i className="fa-solid fa-pen"></i>
                </button>
            </Tooltip>
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
        </>
    )
}

EditPhoto.propTypes = {
    photoData: PropTypes.object.isRequired,
}