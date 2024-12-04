import { useState, useEffect } from 'react';
import axiosApi from '../../services/axiosApi';
import PropTypes from 'prop-types';
import style from './LikeButton.module.css';
import { useSelector } from 'react-redux';
import { Modal } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from "flowbite-react";

export default function LikeButton({ id , type, showLike }) {

    const [likes, setLikes] = useState([]);
    const [isInLikes, setIsInLikes] = useState(false);
    const [isLikeAnimation, setIsLikeAnimation] = useState(false);
    const [isDislikeAnimation, setIsDislikeAnimation] = useState(false);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [openModal, setOpenModal] = useState(false);
    const [likeCount, setLikeCount] = useState(0)
    const navigate = useNavigate();

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const getLikes = async () => {
        if(isAuthenticated){
            try {
                const response = await axiosApi.get('likes/likes/get_user_likes/');
                setLikes(response.data);
                setIsInLikes(
                    type === 'photo'
                    ? response.data.some(like => like.photo === id)
                    : response.data.some(like => like.collection === id)
                );        
            } catch (error) {
                console.error('Error al obtener los Likes:', error);
            }
        }
    };

    useEffect(() => {
        if(showLike){
            const showLike = async () => {
                try {
                    const response = await axiosApi.get(`likes/likes/get_all_likes_photo/${id}/`)
                    if(response.status === 200){
                        setLikeCount(response.data.like_count)
                    }
                } catch (error) {
                    console.error(error)
                }
            }
            showLike()
        }
        getLikes()
    }, [id]);

    const handleAddToLike = async () => {
        try {
            const payload = type === 'photo' ? { photo: id } : { collection: id }
            const response = await axiosApi.post('likes/likes/', payload);
            console.log(response.data);
            getLikes()
            triggerAnimationLike()
        } catch (error) {
            console.log('Error al dar Like:', error);
        }
    };

    const handleRemoveToLike = async () => {
        try {
            const likeId =
                type === 'photo'
                    ? likes.find(like => like.photo === id)?.id
                    : likes.find(like => like.collection === id)?.id;
            
            if(likeId){
                const response = await axiosApi.delete(`/likes/likes/${likeId}/`);
                console.log(response);
                getLikes();
                triggerAnimationDislike()
            }
        } catch (error) {
            console.log('Error al quitar Like:', error);
        }
    }

    const triggerAnimationLike = () => {
        setIsLikeAnimation(true);
        setTimeout(() => setIsLikeAnimation(false), 300); // La animación dura 0.3s
    }

    const triggerAnimationDislike = () => {
        setIsDislikeAnimation(true)
        setTimeout(() => setIsDislikeAnimation(false), 300); // La animación dura 0.3s
    };

    return (
        <div>
            <Tooltip content='Me gusta' style='dark' placement='bottom' >
                <button
                    className='relative p-2'
                    onClick={() => isAuthenticated ? 
                    (isInLikes ? handleRemoveToLike() : handleAddToLike()) : handleOpenModal()}>
                    {showLike && (
                        <span className='absolute top-0 right-0 z-10 text-white font-semibold'>{likeCount}</span>
                    )}
                    <i className={`fa-solid fa-heart ${isLikeAnimation ? style.like_animation : isDislikeAnimation ? style.dislike_animation : '' } ${isInLikes ? style.likeStyle : style.dislikeStyle }`} />
                </button>
            </Tooltip>
            <Modal show={openModal} onClose={handleCloseModal}>
                <Modal.Header>PixGallery</Modal.Header>
                <Modal.Body>
                    <div className="text-center">
                        <p className='text-2xl mb-4'>¡UPS!, No se puedo dar Like</p>
                        <i className="fa-solid fa-heart-broken text-9xl text-[rgb(181,23,158)]"></i>	
                        <p className="text-lg my-4">Debes iniciar sesión para dar Like</p>
                        <button className="bg-[#3a0ca3] text-white py-2 px-4 rounded mb-2" onClick={()=> navigate("/auth/login")}>Iniciar Sesión</button>
                        <p className="mb-2">Si aún no tienes cuenta puedes</p>
                        <button className="bg-[#3a0ca3] text-white py-2 px-4 rounded" onClick={()=> navigate("/auth/register")}>Registrarte</button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}

LikeButton.propTypes = {
    id: PropTypes.number.isRequired,
    type: PropTypes.oneOf(['photo', 'collection']).isRequired,
    showLike: PropTypes.bool,
};