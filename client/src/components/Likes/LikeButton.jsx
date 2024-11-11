import { useState, useEffect } from 'react';
import axiosApi from '../../services/axiosApi';
import PropTypes from 'prop-types';

export default function LikeButton({ photoId }) {
    const [likes, setLikes] = useState([]);
    const [isInLikes, setIsInLikes] = useState(false);

    const getLikes = async () => {
        try {
            const response = await axiosApi.get('likes/likes/get_user_likes/');
            setLikes(response.data);
            console.log(response.data);
            setIsInLikes(response.data.some(photo => photo.photo === photoId));
        } catch (error) {
            console.error('Error al obtener los Likes:', error);
        }
    };
    
    useEffect(() => {
        getLikes();
    }, []);

    const handleAddToLike = async () => {
        try {
            const response = await axiosApi.post('likes/likes/', { photo: photoId });
            console.log(response.data);
            getLikes();
        } catch (error) {
            console.log('Error al dar Like:', error);
        }
    };

    const handleRemoveToLike = async () => {
        try {
            const photo_id = likes.find(photo => photo.photo === photoId).id;
            const response = await axiosApi.delete(`/likes/likes/${photo_id}/`);
            console.log(response);
            getLikes();
        } catch (error) {
            console.log('Error al quitar Like:', error);
        }
    };

    return (
        <div>
            <button 
                className="text-red-500 bg-white text-3xl h-12 w-12 rounded-full hover:text-white hover:bg-red-500" 
                onClick={() => isInLikes ? handleRemoveToLike() : handleAddToLike()}>
                {
                    isInLikes ? 
                        <i className="fa-sharp fa-solid fa-heart"></i>
                    : 
                        <i className="fa-sharp fa-regular fa-heart"></i>
                }
            </button>
        </div>
    );
}

LikeButton.propTypes = {
    photoId: PropTypes.number.isRequired,
};