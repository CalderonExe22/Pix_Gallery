import { useEffect, useState } from "react"
import PropTypes from 'prop-types';
import axiosApi from "../../services/axiosApi";

export default function FormPhoto({updatePhotoData, selectedPhoto}) {
    const [categories, setCategories] = useState([])
    const handleChange = (field) => (e) => {
        const value = field === 'is_free' ? e.target.checked : e.target.value
        updatePhotoData(field, value);
    };

    const getCategories = async () => {
        try {
        const response = await axiosApi.get('photos/category/');
        setCategories(response.data);
        } catch (error) {
        console.log('Error al obtener las categorías:', error);
        }
    };

    useEffect(()=>{
        getCategories()
    },[])

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
                value={selectedPhoto?.category || ''}
                required
                >
                <option value="">Selecciona una categoría</option>
                {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                ))}
            </select>
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
FormPhoto.propTypes = {
    selectedPhoto: PropTypes.shape({
            title: PropTypes.string,
            description: PropTypes.string,
            category: PropTypes.string,
            is_free: PropTypes.bool,
            is_public: PropTypes.bool,
            image: PropTypes.instanceOf(File),
            precio: PropTypes.number,
        }),
    updatePhotoData: PropTypes.func.isRequired
}