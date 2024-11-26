import { useEffect, useState } from "react"
import axiosApi from "../../services/axiosApi"
import PropTypes from 'prop-types'

export default function Filter({onFilterChange}) {
    const [categories, setCategories] = useState([])
    const [tags, setTags] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedTag, setSelectedTag] = useState('') 

    const fetchTags = async () => {
        try {
            const response = await axiosApi.get('photos/photography/get_all_tags/')
            if(response.status === 200){
                setTags(response.data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await axiosApi.get('photos/photography/get_all_categories/')
            if(response.status === 200){
                setCategories(response.data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleCategoryChange = (e) => {
        const categoryId = e.target.value
        setSelectedCategory(categoryId)
        onFilterChange(categoryId, selectedTag)  
    }
    
    
    const handleTagChange = (e) => {
        const tagId = e.target.value
        setSelectedTag(tagId)
        onFilterChange(selectedCategory, tagId)
    }

    useEffect(() => {
        fetchCategories()
        fetchTags()
    }, [])

    return (
        <div>
            {/* Dropdown de Categorías */}
            <select className="border-solid border-black rounded-s-sm border-2 cursor-pointer transition-colors duration-300 hover:border-white hover:bg-[#b5179e] hover:text-white" value={selectedCategory} onChange={handleCategoryChange}>
                <option value="">Quitar filtro</option>
                {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
                ))}
            </select>
            {/* Dropdown de Etiquetas */}
            <select  className="border-solid border-black rounded-s-sm border-2 cursor-pointer transition-colors duration-300 hover:border-white hover:bg-[#b5179e] hover:text-white" value={selectedTag} onChange={handleTagChange}>
                <option value="">Quitar filtro</option>
                {tags.map(tag => (
                <option key={tag.id} value={tag.id}>{tag.name}</option>
                ))}
            </select>
        </div>
    )
}

Filter.propTypes = {
    onFilterChange : PropTypes.func
}