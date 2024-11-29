import { useState, useEffect } from 'react';
import axiosApi from '../../services/axiosApi';
import PropTypes from 'prop-types';
import style from './NewWishList.module.css';
import { useSelector } from 'react-redux';
import { Modal } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';

export default function NewWishList({ id, type }) {

    const [wishlist, setWishlist] = useState([]);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [isWishlistAnimation, setIsWishlistAnimation] = useState(false);
    const [isNoWishlistAnimation, setIsNoWishlistAnimation] = useState(false);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

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
            <button onClick={() => isAuthenticated ?
                (isInWishlist ? handleRemoveFromWishlist() : handleAddToWishlist()) : handleOpenModal()
            }>
                <i className={`fa-solid fa-star ${isWishlistAnimation ? style.wishlist_animation : isNoWishlistAnimation ? style.noWishlist_animation : '' } ${isInWishlist ? style.wishlistStyle : style.noWishlistStyle }`} />
            </button>
            <Modal show={openModal} onClose={handleCloseModal}>
                <Modal.Header>PixGallery</Modal.Header>
                <Modal.Body>
                    <div className="text-center">
                        <p className='text-2xl mb-4'>¡UPS!, No se puedo agregar a la WishList</p>
                        <i className="fa-solid fa-star-half-alt text-9xl text-[rgb(181,23,158)]"></i>	
                        <p className="text-lg my-4">Debes iniciar sesión para agregar un elemnto a la WishList</p>
                        <button className="bg-[#3a0ca3] text-white py-2 px-4 rounded mb-2" onClick={()=> navigate("/login")}>Iniciar Sesión</button>
                        <p className="mb-2">Si aún no tienes cuenta puedes</p>
                        <button className="bg-[#3a0ca3] text-white py-2 px-4 rounded" onClick={()=> navigate("/register")}>Registrarte</button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}

NewWishList.propTypes = {
    id: PropTypes.number.isRequired,
    type: PropTypes.oneOf(['photo', 'collection']).isRequired,
};