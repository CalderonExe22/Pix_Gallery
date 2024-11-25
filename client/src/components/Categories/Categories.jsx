import { useEffect, useState } from "react";
import {PropTypes} from 'prop-types'
import axiosApi from "../../services/axiosApi";

export default function Categories({register,required = false, value}) {
    const [categories, setCategories] = useState([])

    const getCategories = async () => {
        try {
        const response = await axiosApi.get('photos/category/')
        setCategories(response.data)
        } catch (error) {
        console.log('Error al obtener las categorías:', error)
        }
    }

    useEffect(() => {
        getCategories()
    }, [])

    return (
        <div className="flex flex-col gap-3">
            <label id="category" htmlFor="category">Seleccione una categoria</label>
            <select 
                id="category" name="category" {...register('category',{required})}
                value={value || ''}
                required
                >
                <option value="">Selecciona una categoría</option>
                {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                ))}
            </select>
        </div>
    )
}

Categories.propTypes = {
    register: PropTypes.func,
    value: PropTypes.string,
    required: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
    ]),
}