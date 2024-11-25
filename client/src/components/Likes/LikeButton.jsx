import { useState, useEffect } from 'react';
import axiosApi from '../../services/axiosApi';
import PropTypes from 'prop-types';
import style from './LikeButton.module.css'
export default function LikeButton({ id , type }) {
    const [likes, setLikes] = useState([]);
    const [isInLikes, setIsInLikes] = useState(false);
    const [isLikeAnimation, setIsLikeAnimation] = useState(false)
    const [isDislikeAnimation, setIsDislikeAnimation] = useState(false)

    const getLikes = async () => {
        try {
            const response = await axiosApi.get('likes/likes/get_user_likes/');
            setLikes(response.data);
            console.log(response.data);
            setIsInLikes(
                type === 'photo'
                ? response.data.some(like => like.photo === id)
                : response.data.some(like => like.collection === id)
            );        
        } catch (error) {
            console.error('Error al obtener los Likes:', error);
        }
    };
    
    useEffect(() => {
        getLikes()
    }, []);

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
            <button 
                onClick={() => isInLikes ? handleRemoveToLike() : handleAddToLike()}>
                <i className={`fa-solid fa-heart ${isLikeAnimation ? style.like_animation : isDislikeAnimation ? style.dislike_animation : '' } ${isInLikes ? style.likeStyle : style.dislikeStyle }`} />
            </button>
        </div>
    );
}

LikeButton.propTypes = {
    id: PropTypes.number.isRequired,
    type: PropTypes.oneOf(['photo', 'collection']).isRequired
};