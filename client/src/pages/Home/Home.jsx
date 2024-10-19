import { useState, useEffect } from "react";
import style from './Home.module.css';
import Filter from '../../components/Filter/Filter';
import ListPhotos from '../../components/ListsPhotos/ListsPhotos';
import axiosApi from '../../services/axiosApi';

export default function Home() {

    const [photos, setPhotos] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categoryPhoto, setCategoryPhoto] = useState([]);
    const [filteredPhotos, setFilteredPhotos] = useState([]);

    const getPhotos = async () => {
        try {
            const response = await axiosApi.get("photos/photography/");
            setPhotos(response.data);
            setFilteredPhotos(response.data);
        } catch (error) {
            console.log("Error al obtener las fotos:", error);
        }
    };

    const getCategories = async () => {
        try {
            const response = await axiosApi.get("photos/category/");
            setCategories(response.data);
        } catch (error) {
            console.log("Error al obtener las categorías:", error);
        }
    };

    const getCategoryPhoto = async () => {
        try {
            const response = await axiosApi.get("photos/category-photography/");
            setCategoryPhoto(response.data);
        } catch (error) {
            console.log("Error al obtener las categorías de las fotos:", error);
        }
    };

    useEffect(() => {
        getPhotos();
        getCategories();
        getCategoryPhoto();
    }, []);

    const handleFilter = (filteredPhotos) => { setFilteredPhotos(filteredPhotos) };

    return (
        <div className={style.home_container}>
            <div className="flex">
                <Filter 
                    photos={photos} 
                    categories={categories} 
                    categoryPhoto={categoryPhoto} 
                    onFilter={handleFilter} 
                />
                <ListPhotos photos={filteredPhotos} />
            </div>
        </div>
    );
}