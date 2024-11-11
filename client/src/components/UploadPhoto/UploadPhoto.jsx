import { useState } from "react";
import FormPhotography from "../FormPhotography/FormPhotography";
import PropTypes from 'prop-types'

export default function UploadPhoto({showForm}) {
    const [preview, setPreview] = useState(null)
    const [selectPhoto, setSelectPhoto] = useState(null)
    const handlePhotoChange = (e) => {
        const file = e.target.files[0]
        if(file){
            const previewUrl = URL.createObjectURL(file)
            setPreview(previewUrl)
            setSelectPhoto(file)
        }
    }
    const removePhoto = () => {
        setPreview(null)
        setSelectPhoto(null)
    }  
    return (
        <>
            <div className="flex justify-center items-center w-full h-full rounded-md">
                {preview ? (
                    <div className="relative flex w-full h-full m-20">
                        <button className="absolute top-2 right-2 z-20 p-3 font-medium text-3xl text-white bg-gray-500 " onClick={removePhoto}>
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                        <img className="object-cover h-full w-full rounded-md" src={preview} alt="vista-previa" />
                    </div>
                ) : (
                    <div className="w-full h-full flex flex-col items-center border-dashed border-2 border-black rounded-2xl transform transition-transform duration-300">
                        <input id="inputFile" className="hidden" type="file" accept="image/*" onChange={handlePhotoChange} />
                        <label className="cursor-pointer flex justify-center items-center w-full h-full z-10" htmlFor="inputFile">
                            <div className="flex flex-col items-center gap-4">
                                <i className="fa-solid fa-file-image text-7xl"></i>
                                <p className="text-2xl font-bold">Sube tu fotografia</p>
                                <p>Se recomiendan archivos .jpg de alta calidad.</p>
                                <button onClick={showForm} className=""><i className="fa-solid fa-circle-chevron-down text-6xl"></i></button>      
                            </div>
                        </label>
                    </div>
                )}
            </div>
            <div className={`flex ${selectPhoto ? 'w-full' : 'w-0 overflow-hidden'} justify-center items-center h-full transform transition-all duration-500`}>
                <FormPhotography image={selectPhoto}/>
            </div>
        </>
    )
}

UploadPhoto.propTypes = {
    showForm : PropTypes.func
}