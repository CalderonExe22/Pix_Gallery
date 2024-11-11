import { useState, useEffect } from 'react';
import axiosApi from '../../services/axiosApi';
import PropTypes from 'prop-types';

export default function NewWishList({ photoId }) {
    const [wishlist, setWishlist] = useState([]);
    const [isInWishlist, setIsInWishlist] = useState(false);

    const getWishlist = async () => {
        try {
            const response = await axiosApi.get('wishlist/wishlist/get_user_wishlist/');
            console.log(response.data);
            setWishlist(response.data);
            setIsInWishlist(response.data.some(photo => photo.photo === photoId));
        } catch (error) {
            console.error('Error al obtener la wishlist:', error);
        }
    };
    
    useEffect(() => {
        getWishlist();
    }, []);

    const handleAddToWishlist = async () => {
        try {
            const response = await axiosApi.post('wishlist/wishlist/', { photo: photoId });
            console.log(response.data);
            getWishlist();
        } catch (error) {
            console.log('Error al agregar a la wishlist:', error);
        }
    };

    const handleRemoveFromWishlist = async () => {
        try {
            const photo_id = wishlist.find(photo => photo.photo === photoId).id;
            const response = await axiosApi.delete(`/wishlist/wishlist/${photo_id}/`);
            console.log(response);
            getWishlist();
        } catch (error) {
            console.log('Error al eliminar de la wishlist:', error);
        }
    };

    return (
        <div>
            <button 
                className="text-blue-500 bg-white text-3xl h-12 w-12 rounded-full hover:text-white hover:bg-blue-500" 
                onClick={() => isInWishlist ? handleRemoveFromWishlist() : handleAddToWishlist()}>
                {
                    isInWishlist ? 
                        <i className="fa-solid fa-star"></i>
                    : 
                        <i className="fa-regular fa-star"></i>
                }
            </button>
        </div>
    );
}

NewWishList.propTypes = {
    photoId: PropTypes.number.isRequired,
};