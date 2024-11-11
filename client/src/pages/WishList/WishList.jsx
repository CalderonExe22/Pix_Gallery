import { useState, useEffect } from "react";
import axiosApi from "../../services/axiosApi";
import ListPhotos from "../../components/ListsPhotos/ListsPhotos";
import { useNavigate } from "react-router-dom";

export default function WishList() {

    const navigate = useNavigate();
    const [wishlist, setWishlist] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [photosWishlist, setPhotosWishlist] = useState([]);

    const getWishlist = async () => {
        try {
            const response = await axiosApi.get('wishlist/wishlist/get_user_wishlist/');
            console.log(response.data);
            setWishlist(response.data);
        } catch (error) {
            console.error(error)
        }
    }

    const handleExplore = () => {navigate("/")}

    const getPhotos = async () => {
        try {
            const response = await axiosApi.get('photos/photography/');
            console.log(response.data);
            setPhotos(response.data);
        } catch (error) {
            console.error(error)
        }
    }

    const filterPhotos = () => {
        if (wishlist.length === 0 || photos.length === 0) return;
        const photosWishlist = photos.filter(photo => wishlist.some(wish => wish.photo === photo.id));
        setPhotosWishlist(photosWishlist);
    }
    
    useEffect(() => {
        // Promise.all() permite ejecutar varias promesas al mismo tiempo
        Promise.all([getWishlist(), getPhotos()])
            .then(() => setLoading(false));
    }, [])
    
    useEffect(() => {
        if (wishlist.length > 0 && photos.length > 0){
            filterPhotos();
        }
    }, [wishlist, photos])

    return (
        <div>
            {
                loading ? 
                    <h1 className="text-3xl mb-4" >Cargando...</h1>
                :
                    (
                        photosWishlist.length === 0 ?
                            <div className="text-center">
                                <h1 className="text-2xl mb-4">Cuanto espacio! Explora y añade imágenes a tu WishList</h1>
                                <button className="bg-blue-500 text-white px-4 py-2" onClick={handleExplore}>Explorar</button>
                            </div>
                        :
                            <ListPhotos photos={photosWishlist} />
                    )
            }
        </div>
    )
}