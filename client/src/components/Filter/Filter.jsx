import PropTypes from 'prop-types';
import { useState } from "react";

function Filter({ photos, categories, categoryPhoto, onFilter }) {

    const [selectedCategories, setSelectedCategories] = useState([]);

    const handleCategoryChange = (categoryId) => {
        const updatedSelectedCategories = selectedCategories.includes(categoryId)
            ? selectedCategories.filter((id) => id !== categoryId)
            : [...selectedCategories, categoryId];
        setSelectedCategories(updatedSelectedCategories);
        const filteredPhotos = photos.filter(
            (photo) =>
                updatedSelectedCategories.length === 0 ||
                categoryPhoto.some(
                    (cp) =>
                        cp.photography === photo.id &&
                        updatedSelectedCategories.includes(cp.category)
                )
        );
        onFilter(filteredPhotos);
    };

    return (
        <div className="bg-gray-100 p-4 rounded-lg">
            <h1 className="text-xl text-center font-bold mb-4">Categorías</h1>
            {categories.map((category) => (
                <div key={category.id} className="mb-2">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            value={category.id}
                            onChange={() => handleCategoryChange(category.id)}
                            checked={selectedCategories.includes(category.id)}
                            className="h-10"
                        />
                        <span>{category.name}</span>
                    </label>
                </div>
            ))}
        </div>
    );
}

// Validación de props con PropTypes
Filter.propTypes = {
    photos: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string,
            image: PropTypes.string.isRequired,
        })
    ).isRequired,
    categoryPhoto: PropTypes.arrayOf(
        PropTypes.shape({
            photography: PropTypes.number.isRequired,
            category: PropTypes.number.isRequired,
        })
    ).isRequired,
    categories: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    onFilter: PropTypes.func.isRequired,
};

export default Filter;