import { useState, useEffect } from 'react';
import axiosApi from '../../services/axiosApi';
import PropTypes from 'prop-types';
import style from './NewWishList.module.css'

export default function NewWishList({ id, type }) {
    const [wishlist, setWishlist] = useState([]);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [isWishlistAnimation, setIsWishlistAnimation] = useState(false)
    const [isNoWishlistAnimation, setIsNoWishlistAnimation] = useState(false)

    const getWishlist = async () => {
        try {
            const response = await axiosApi.get('wishlist/wishlist/get_user_wishlist/');
            console.log(response.data);
            setWishlist(response.data);
            if (type === 'photo') {
                setIsInWishlist(response.data.some(item => item.photo?.id === id));
            } else if (type === 'collection') {
                setIsInWishlist(response.data.some(item => item.collection?.id === id));
            }
        } catch (error) {
            console.error('Error al obtener la wishlist:', error);
        }
    }

    const triggerAnimationWishlist = () => {
        setIsWishlistAnimation(true);
        setTimeout(() => setIsWishlistAnimation(false), 300); // La animación dura 0.3s
    }

    const triggerAnimationNoWishlist = () => {
        setIsNoWishlistAnimation(true)
        setTimeout(() => setIsNoWishlistAnimation(false), 300); // La animación dura 0.3s
    };
    
    useEffect(() => {
        getWishlist();
    }, []);

    const handleAddToWishlist = async () => {
        try {
            const payload = type === 'photo' ? { photo: id } : { collection: id }
            const response = await axiosApi.post('wishlist/wishlist/', payload);
            console.log(response.data);
            getWishlist();
            triggerAnimationWishlist()
        } catch (error) {
            console.log('Error al agregar a la wishlist:', error);
        }
    };

    const handleRemoveFromWishlist = async () => {
        try {
            let itemToRemove
            if(type === 'photo'){
                itemToRemove = wishlist.find(item => item.photo?.id === id);
            } else if (type === 'collection') {
                itemToRemove = wishlist.find(item => item.collection?.id === id);
            }
            if (itemToRemove) {
                const response = await axiosApi.delete(`/wishlist/wishlist/${itemToRemove.id}/`);
                console.log(response);
                getWishlist();
                triggerAnimationNoWishlist();
            }
        } catch (error) {
            console.log('Error al eliminar de la wishlist:', error);
        }
    };

    return (
        <div>
            <button onClick={() => isInWishlist ? handleRemoveFromWishlist() : handleAddToWishlist()}>
                <i className={`fa-solid fa-star ${isWishlistAnimation ? style.wishlist_animation : isNoWishlistAnimation ? style.noWishlist_animation : '' } ${isInWishlist ? style.wishlistStyle : style.noWishlistStyle }`} />
            </button>
        </div>
    );
}

NewWishList.propTypes = {
    id: PropTypes.number.isRequired,
    type: PropTypes.oneOf(['photo', 'collection']).isRequired,
};