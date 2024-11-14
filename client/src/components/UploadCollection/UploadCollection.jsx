import { useState } from "react";
import FormCollection from "../FormCollection/FormCollection";
import PropTypes from 'prop-types'

export default function UploadCollection({showForm, getData}) {
    const [selectImageIndex, setSelectedImageIndex] = useState(0)
    const [previewCollection, setPreviewCollection] = useState([])
    const [selectPhotos, setSelectPhotos] = useState([])

    const handleCollectionChange = (e) => {
        const files = Array.from(e.target.files);
        const collectionPreview = files.map(file => URL.createObjectURL(file));
        if (files.length > 0) {
            // Agregar las nuevas imágenes a los arrays existentes
            setPreviewCollection(prev => [...prev, ...collectionPreview]);
            setSelectPhotos(prev => [...prev, ...files]);
        }
    }

    const handleImageClick = (index) => {
        setSelectedImageIndex(index);
    };    
    
    const removeCollectionPhoto = (index) => {
        setPreviewCollection(prev => prev.filter((_, i) => i !== index));
        setSelectPhotos(prev => prev.filter((_, i) => i !== index));
    }
    return (
        <>
            <div className="flex justify-center items-center w-full h-full rounded-md">
                {previewCollection.length ? (
                <div className="grid grid-cols-4 gap-5 h-full w-full">
                        {previewCollection.map((previewCollec, index) => (
                            <div key={index} onClick={()=>handleImageClick(index)} className="relative cursor-pointer flex w-[150px] h-[200px]">
                                <button className="absolute top-2 right-2 z-20 p-3 font-medium text-3xl text-white" onClick={()=>removeCollectionPhoto(index)}>
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                                <img className="object-cover h-full w-full rounded-md" src={previewCollec} alt="vista-previa" />
                            </div>
                        ))}
                        <label className="cursor-pointer flex justify-center items-center h-[200px] w-[150px] z-10 bg-gray-200 shadow-lg border-2 border-solid border-black" htmlFor="inputCollectionFile">
                            <input id="inputCollectionFile" className="hidden" type="file" accept="image/*" onChange={handleCollectionChange} multiple />
                            <button><i className="fa-solid fa-plus"></i></button>
                        </label>
                    </div>
                ) : (
                    <div className="w-full h-full flex flex-col items-center border-dashed border-2 border-black rounded-2xl transform transition-transform duration-300">
                        <input id="inputCollectionFile" className="hidden" type="file" accept="image/*" multiple onChange={handleCollectionChange} />
                        <label className="cursor-pointer flex justify-center items-center w-full h-full z-10" htmlFor="inputCollectionFile">
                            <div className="flex flex-col items-center gap-4">
                                <i className="fa-solid fa-file-image text-7xl"></i>
                                <h1 className="text-4xl font-bold">Sube tu coleccion fotografica</h1>
                                <p>Se recomiendan archivos .jpg de alta calidad.</p>
                            </div>
                        </label>
                        <button onClick={showForm} className="pt-5 pb-5 flex flex-col items-center transition-colors duration-300 hover:bg-[#b5179e] hover:text-white w-full gap-5 rounded-2xl">
                            <p className="text-xl font-medium">Sube tu fotografia </p>
                            <i className="fa-solid fa-circle-chevron-up text-6xl"></i>
                        </button>
                    </div>
                )}
            </div>
            <div className={`flex ${selectPhotos.length > 0 ? 'w-full' : 'w-0 overflow-hidden'} justify-center items-center h-full transform transition-all duration-500`}>
                <FormCollection getData={getData} indexPhoto={selectImageIndex} images={selectPhotos}/>
            </div>
        </>
    )
}

UploadCollection.propTypes = {
    showForm : PropTypes.func,
    getData: PropTypes.func
}