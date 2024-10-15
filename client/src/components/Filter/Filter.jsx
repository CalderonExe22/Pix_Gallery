import { useState, useEffect } from "react";
import axiosApi from "../../services/axiosApi";

function Filter() {
    const [photos, setPhotos] = useState([]);
    const [categryPhotho, setCategoryPhoto] = useState([]);
    const [category, setCategory] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        const getPhotos = async () => {
            try {
                const response = await axiosApi.get("photos/photography/");
                setPhotos(response.data);
            } catch (error) {
                console.log("Error al obtener las fotos:", error);
            }
        };
        const getCategoryPhoto = async () => {
            try {
                const response = await axiosApi.get("photos/category-photography/");
                setCategoryPhoto(response.data);
            } catch (error) {
                console.log("Error al obtener las categorias de las fotos:", error);
            }
        };
        const getCategory = async () => {
            try {
                const response = await axiosApi.get("photos/category/");
                setCategory(response.data);
            } catch (error) {
                console.log("Error al obtener las categorias:", error);
            }
        };
        getPhotos();
        getCategory();
        getCategoryPhoto();
    }, []);

    const handleCategoryChange = (categoryId) => {
        setSelectedCategories((prevSelected) =>
        prevSelected.includes(categoryId)
            ? prevSelected.filter((id) => id !== categoryId)
            : [...prevSelected, categoryId]
        );
    };

    return (
        <div className="flex">
            <div>
                <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                    <h1 className="text-xl font-bold mb-4">Categorias</h1>
                    {category.map((cat) => (
                        <div key={cat.id} className="mb-2">
                            <label className="flex items-center space-x-2">
                                <input
                                type="checkbox"
                                value={cat.id}
                                onChange={() => handleCategoryChange(cat.id)}
                                checked={selectedCategories.includes(cat.id)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span>{cat.name}</span>
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-5 w-full">
                {photos
                .filter(
                    photo => selectedCategories.length === 0 ||
                    categryPhotho.some(
                        (cp) =>
                        cp.photography === photo.id &&
                        selectedCategories.includes(cp.category)
                    )
                )
                .map((photo) => (
                    <div key={photo.id} className="border border-gray-300 rounded-lg shadow-md p-2">
                        <h2 className="text-center text-xl mb-2">{photo.title}</h2>
                        <img
                            className="w-full h-72 object-cover"
                            src={"https://res.cloudinary.com/drtkhsozv/" + photo.image}
                            alt={photo.title}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Filter;