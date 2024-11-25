import { useEffect, useState } from "react"
import PropTypes from 'prop-types';
import axiosApi from "../../services/axiosApi";

export default function FormEditPhotoCollection({updatePhotoData, selectedPhoto}) {
    const [categories, setCategories] = useState([])
    const [tags, setTags] = useState([])
    console.log(Array.isArray(selectedPhoto?.tags_photo))
    const handleAddTag = (tag) => {
        if (tag && !tags.some(t => t === tag)) { // Usa `tags` en lugar de `selectedPhoto.tags_photo`
            const updatedTags = [...tags, tag];
            setTags(updatedTags); // Actualiza el estado local
            updatePhotoData('tags_photo', updatedTags); // Actualiza el estado del padre
        }
    };
    
    const handleRemoveTag = (tagToRemove) => {
        const updatedTags = tags.filter(tag => tag !== tagToRemove); // Filtra usando el estado local
        setTags(updatedTags); // Actualiza el estado local
        updatePhotoData('tags_photo', updatedTags); // Actualiza el estado del padre
    };

    const handleChange = (field) => (e) => {
        const value = field === 'is_free' ? e.target.checked : e.target.value
        updatePhotoData(field, value);
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
        setTags(selectedPhoto.tags_photo || []);
    }, [selectedPhoto.tags_photo]);

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
            />
            <input 
                type="text"
                name='description'
                label='Descripción de la fotografia'
                placeholder='Ingrese titulo de su foto'
                onChange={handleChange('description')}
                value={selectedPhoto?.description || ''}
                required={true}
            />
            <select 
                id="category" 
                name="category"
                onChange={handleChange('category')}
                defaultValue={selectedPhoto?.category || ''}
                required
                >
                {categories.map(category => (
                    <option key={category?.id} value={category?.id}>{category?.name}</option>
                ))}
            </select>
            <div className="flex flex-col gap-3">
                <label id="tags" htmlFor="tags">Tags</label>
                <input id="tags" type="text" name='tags' placeholder="Ingrese tags adicionales"
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
                    {tags.length > 0 ? (
                        tags.map((tag, index) => (    
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
                <div className="w-full col-span-2">
                    <input type="text" name='camera' placeholder="Camara" className="w-full"
                        onChange={handleChange('camera')}
                        value={selectedPhoto?.camera || ''}
                        required={true}/>
                </div>
                <div className="w-full col-span-2">
                    <input type="text" name='lens' placeholder="lente" className="w-full"
                    onChange={handleChange('lens')}
                    value={selectedPhoto?.lens || ''}
                    required={true}/>
                </div>
                <div className="w-full">
                    <input type="number" name='focal_length' placeholder="Distancia focal" className="w-full"
                    onChange={handleChange('focal_length')}
                    value={selectedPhoto?.focal_length || ''}
                    required={true}/>
                </div>
                <div className="w-full">
                    <input type="number" name='shutter_speed' placeholder="velocidad de abturacion" className="w-full"
                    onChange={handleChange('shutter_speed')}
                    value={selectedPhoto?.shutter_speed || ''}
                    required={true}
                    />
                </div>
                <div className="w-full">
                    <input type="number" name='aperture' placeholder="Apertura" className="w-full"
                    onChange={handleChange('aperture')}
                    value={selectedPhoto?.aperture || ''}
                    required={true}
                    />
                </div>
                <div className="w-full ">
                    <input type="number" name='iso' placeholder="ISO" className="w-full" 
                    onChange={handleChange('iso')}
                    value={selectedPhoto?.iso || ''}
                    required={true}
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
                /> 
            )}
        </div>
    )
}
FormEditPhotoCollection.propTypes = {
    selectedPhoto: PropTypes.shape({
            title: PropTypes.string,
            description: PropTypes.string,
            category: PropTypes.string,
            is_free: PropTypes.bool,
            is_public: PropTypes.bool,
            precio: PropTypes.number,
            camera:PropTypes.string,
            lens: PropTypes.string,
            focal_length: PropTypes.number,
            shutter_speed: PropTypes.number,
            aperture: PropTypes.number,
            iso: PropTypes.number,
            tags_photo : PropTypes.array
        }),
    updatePhotoData: PropTypes.func.isRequired
}