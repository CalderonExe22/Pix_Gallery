import { useEffect, useRef, useState } from "react"
import axiosApi from "../../services/axiosApi"
import PropTypes from 'prop-types'

export default function Filter({onFilterChange}) {
    const [categories, setCategories] = useState([])
    const [tags, setTags] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedTag, setSelectedTag] = useState('') 
    const [isFree, setIsFree] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    const handleClickOutside = (e) => {
        if(dropdownRef.current && !dropdownRef.current.contains(e.target)){
            setIsOpen(false)
        }
    }

    const toggleDropdown = () => setIsOpen(!isOpen)

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
        onFilterChange(categoryId, selectedTag, isFree)  
    }
    
    
    const handleTagChange = (e) => {
        const tagId = e.target.value
        setSelectedTag(tagId)
        onFilterChange(selectedCategory, tagId, isFree)
    }

    const handleIsFreeChange = (e) => {
        const isFreeValue = e.target.value
        setIsFree(isFreeValue)
        onFilterChange(selectedCategory, selectedTag, isFreeValue)
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    useEffect(() => {
        fetchCategories()
        fetchTags()
    }, [])

    return (
        <div ref={dropdownRef} className="relative flex flex-col">
            <button className="flex justify-center items-center gap-5 border-solid border-black rounded-lg border-2 cursor-pointer transition-colors duration-300 hover:border-white hover:bg-[#b5179e] hover:text-white px-4 py-2" onClick={toggleDropdown}>
                Filtros
                <i className={`fa-solid fa-chevron-up transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
            </button>
            <div className={`absolute left-0 top-full mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-50 transform transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                <div className="p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                        <select
                            className="w-full border border-gray-300 rounded-lg p-2"
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                        >
                            <option value="">Quitar filtro</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Dropdown de Etiquetas */}
                    <div className="p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Etiqueta</label>
                        <select
                            className="w-full border border-gray-300 rounded-lg p-2"
                            value={selectedTag}
                            onChange={handleTagChange}
                        >
                            <option value="">Quitar filtro</option>
                            {tags.map((tag) => (
                                <option key={tag.id} value={tag.id}>
                                    {tag.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Dropdown de Gratuito/No gratuito */}
                    <div className="p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                        <select
                            className="w-full border border-gray-300 rounded-lg p-2"
                            value={isFree}
                            onChange={handleIsFreeChange}
                        >
                            <option value="">Ambos</option>
                            <option value="true">Gratuito</option>
                            <option value="false">No gratuito</option>
                        </select>
                    </div>
                </div>
        </div>
    )
}

Filter.propTypes = {
    onFilterChange : PropTypes.func
}