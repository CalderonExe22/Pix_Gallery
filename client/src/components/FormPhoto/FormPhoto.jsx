import { useEffect, useState } from "react"
import PropTypes from 'prop-types';
import axiosApi from "../../services/axiosApi";

export default function FormPhoto({updatePhotoData, selectedPhoto}) {
    const [categories, setCategories] = useState([])
    const [tags, setTags] = useState([])
    const [processedImages, setProcessedImages] = useState(new Set())

    const handleAddTag = (tag) => {
        if (tag && !selectedPhoto.tags.includes(tag)) {
            const updatedTags = [...(selectedPhoto.tags || []), tag];
            updatePhotoData('tags', updatedTags); // Actualiza los datos de la foto
        }
    };
    
    const handleRemoveTag = (tagToRemove) => {
        const updatedTags = selectedPhoto.tags.filter(tag => tag !== tagToRemove);
        updatePhotoData('tags', updatedTags); // Actualiza los datos de la foto
    };

    const handleChange = (field) => (e) => {
        const value = field === 'is_free' ? e.target.checked : e.target.value
        updatePhotoData(field, value);
    }

    const getTags = async () => {
        try {
            const data = new FormData();
            data.append("image", selectedPhoto.image)
            const response = await axiosApi.post('imagga/tags/',data)
            if (response.status === 200){
                const filteredTags = response.data.tags.filter(tag => tag.confianza >= 30);
                const finalTags = filteredTags.map(tag => tag.etiqueta);
                setTags(finalTags)
                updatePhotoData('tags',finalTags)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getCategories = async () => {
        try {
        const response = await axiosApi.get('photos/category/');
        setCategories(response.data);
        } catch (error) {
        console.log('Error al obtener las categorías:', error);
        }
    }

    useEffect(()=>{
        getCategories()
    },[])

    useEffect(() => {
        if (selectedPhoto?.image && !processedImages.has(selectedPhoto.image)) {
            getTags();
            setProcessedImages(prev => new Set(prev).add(selectedPhoto.image)); // Marca la imagen como procesada
        }
    }, [selectedPhoto?.image, processedImages])

    return (
        <div className="flex flex-col gap-5">
            <input 
                type="text"
                name='title'
                label='Titulo de la fotografia'
                placeholder='Ingrese titulo de su foto'
                onChange={handleChange('title')}
                value={selectedPhoto?.title || ''}
                required
                className="h-11 w-full p-1 rounded-xl duration-300 outline-none hover:border-[#3a0ca3] focus:border-[#3a0ca3]"
            />
            <input 
                type="text"
                name='description'
                label='Descripción de la fotografia'
                placeholder='Ingrese descripcion de su foto'
                onChange={handleChange('description')}
                value={selectedPhoto?.description || ''}
                required
                className="h-11 w-full p-1 rounded-xl duration-300 outline-none hover:border-[#3a0ca3] focus:border-[#3a0ca3]"
            />
            <select 
                id="category" 
                name="category"
                onChange={handleChange('category')}
                value={selectedPhoto?.category || ''}
                required
                className="h-11 w-full p-1 rounded-xl duration-300 outline-none hover:border-[#3a0ca3] focus:border-[#3a0ca3]"
                >
                <option value="">Selecciona una categoría</option>
                {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                ))}
            </select>
            <div className="flex flex-col gap-3">
                <label id="tags" htmlFor="tags">Tags</label>
                <input className="h-11 w-full p-1 rounded-xl duration-300 outline-none hover:border-[#3a0ca3] focus:border-[#3a0ca3]" id="tags" type="text" name='tags' placeholder="Ingrese tags adicionales"
                    onKeyDown={(e) => {
                        if(e.key === 'Enter'){
                            e.preventDefault()
                            handleAddTag(e.target.value)
                            e.target.value = ''
                        }
                    } }
                />
            </div>
            {tags ? (
                <div className="flex flex-wrap w-full h-auto gap-2">
                    {selectedPhoto.tags.length > 0 ? (
                        selectedPhoto.tags.map((tag, index) => (    
                            <div  key={index} className="flex justify-center items-center gap-2 p-2 w-auto h-auto rounded-md border-solid border-2 border-[#b5179e] text-[#b5179e]">
                                <span className="w-full">{tag}</span>
                                <button type="button" className="h-auto w-auto"
                                    onClick={() => handleRemoveTag(tag)}
                                >
                                    <i className="fa-solid fa-x text-sm"></i>
                                </button>
                                
                            </div>
                        ))
                    ) : (
                        <p>No hay tags asociados</p>
                    )}
                </div>
            ) : (
                <div>...cargando</div>
            )}
            <div className="grid grid-cols-2 w-full h-auto gap-4">
                <h1 className="text-2xl col-span-2 w-full">Informacio EXIF</h1>
                <p>(No es obligatoria)</p>
                <div className="w-full col-span-2">
                    <input type="text" name='camera' placeholder="Camara" className="h-11 w-full p-1 rounded-xl duration-300 outline-none hover:border-[#3a0ca3] focus:border-[#3a0ca3]"
                        onChange={handleChange('camera')}
                        value={selectedPhoto?.camera || ''}
                        />
                        
                </div>
                <div className="w-full col-span-2">
                    <input type="text" name='lens' placeholder="lente" className="h-11 w-full p-1 rounded-xl duration-300 outline-none hover:border-[#3a0ca3] focus:border-[#3a0ca3]"
                    onChange={handleChange('lens')}
                    value={selectedPhoto?.lens || ''}
                    />
                </div>
                <div className="w-full">
                    <input type="number" name='focal_length' placeholder="Distancia focal" className="h-11 w-full p-1 rounded-xl duration-300 outline-none hover:border-[#3a0ca3] focus:border-[#3a0ca3]"
                    onChange={handleChange('focal_length')}
                    value={selectedPhoto?.focal_length || ''}
                    />
                </div>
                <div className="w-full">
                    <input type="number" name='shutter_speed' placeholder="velocidad de abturacion" className="h-11 w-full p-1 rounded-xl duration-300 outline-none hover:border-[#3a0ca3] focus:border-[#3a0ca3]"
                    onChange={handleChange('shutter_speed')}
                    value={selectedPhoto?.shutter_speed || ''}
                    />
                </div>
                <div className="w-full">
                    <input type="number" name='aperture' placeholder="Apertura" className="h-11 w-full p-1 rounded-xl duration-300 outline-none hover:border-[#3a0ca3] focus:border-[#3a0ca3]"
                    onChange={handleChange('aperture')}
                    value={selectedPhoto?.aperture || ''}
                    />
                </div>
                <div className="w-full ">
                    <input type="number" name='iso' placeholder="ISO" className="h-11 w-full p-1 rounded-xl duration-300 outline-none hover:border-[#3a0ca3] focus:border-[#3a0ca3]" 
                    onChange={handleChange('iso')}
                    value={selectedPhoto?.iso || ''}
                    />
                </div>
            </div>    
            es gratis? 
            <input 
                type="checkbox"
                name='is_free'
                onChange={handleChange('is_free')}
                checked={selectedPhoto?.is_free || false}
            />
            {selectedPhoto?.is_free === false && (
                <input 
                    type="number"
                    name='precio'
                    label='Precio de la fotografia'
                    placeholder='Ingrese precio de su foto'
                    onChange={handleChange('precio')}
                    value={selectedPhoto?.precio || 0}
                    min="0"
                    className="h-11 w-full p-1 rounded-xl duration-300 outline-none hover:border-[#3a0ca3] focus:border-[#3a0ca3]"
                /> 
            )}
        </div>
    )
}
FormPhoto.propTypes = {
    selectedPhoto: PropTypes.shape({
            title: PropTypes.string,
            description: PropTypes.string,
            category: PropTypes.string,
            is_free: PropTypes.bool,
            is_public: PropTypes.bool,
            image: PropTypes.instanceOf(File),
            precio: PropTypes.number,
            camera:PropTypes.string,
            lens: PropTypes.string,
            focal_length: PropTypes.number,
            shutter_speed: PropTypes.number,
            aperture: PropTypes.number,
            iso: PropTypes.number,
            tags : PropTypes.array
        }),
    updatePhotoData: PropTypes.func.isRequired
}