import { useState, useEffect } from 'react';
import axiosApi from '../../services/axiosApi';
import PropTypes from 'prop-types';

export default function Wishlist({ photoId }) {
    const [wishlist, setWishlist] = useState([]);
    const [isInWishlist, setIsInWishlist] = useState(false);

    const getWishlist = async () => {
        try {
            const response = await axiosApi.get('wishlist/wishlist/');
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
                className={`text-white py-2 px-4 rounded ${isInWishlist ? 'bg-red-500' : 'bg-blue-500'}`} 
                onClick={() => isInWishlist ? handleRemoveFromWishlist() : handleAddToWishlist()}>
                {isInWishlist ? 'Eliminar de WishList' : 'Agregar a Wishlist'}
            </button>
        </div>
    );
}

Wishlist.propTypes = {
    photoId: PropTypes.number.isRequired,
};