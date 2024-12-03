import { Modal } from "flowbite-react"
import PropTypes from 'prop-types';
import FormEditCollection from "../FormEditCollection/FormEditCollection";
import { useState } from "react";

export default function EditCollection({collectionData}) {
    const [showModal, setShowModal] = useState(false)
    const [selectImageIndex, setSelectedImageIndex] = useState(0)
    const handleImageClick = (index) => {
        setSelectedImageIndex(index);
    }
    return (
        <>
            <button className='text-lg p-2 transform transition-transform hover:scale-110' onClick={() => setShowModal(true)}>
                <i className="fa-solid fa-pen"></i>
            </button>
            <Modal size='7xl' show={showModal} onClose={() => setShowModal(false)}>
                <Modal.Header>Editar fotografia</Modal.Header>
                <Modal.Body>
                    <div className='flex justify-center items-center h-full w-full'>
                        <div className="grid grid-cols-4 gap-5 h-full w-full">
                            {collectionData?.photos?.map((photo, index) => (
                                <div key={index} onClick={()=>handleImageClick(index)} className="relative cursor-pointer flex flex-col w-[150px] h-[200px]">
                                    <img className="object-cover h-full w-full rounded-md" src={photo.image_url} alt="vista-previa" />
                                </div>
                            ))}
                        </div>        
                        <div className={`flex w-full overflow-y-auto justify-center items-start h-[900px] transform transition-all duration-500`}>
                            {collectionData && (
                                <FormEditCollection collection={collectionData} indexPhoto={selectImageIndex}/>
                            )}
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

EditCollection.propTypes = {
    collectionData: PropTypes.object.isRequired,
}