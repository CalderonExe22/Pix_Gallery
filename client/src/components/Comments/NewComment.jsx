import { useState, useEffect } from 'react';
import axiosApi from '../../services/axiosApi';
import PropTypes from 'prop-types';
import { Tooltip } from 'flowbite-react';

export default function NewComment({ photoId = null, collectionId = null }) {
    const [comments, setComments] = useState([]);
    const idUser = localStorage.getItem('userId')
    console.log(comments)
    const getComments = async () => {
        try {
            const response = await axiosApi.get('comments/comments/get_all_comments/');
            response.data = response.data.filter(comment => 
                (photoId && comment.photo === photoId) ||
                (collectionId && comment.collection === collectionId)
            )
            console.log(response.data);
            setComments(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getComments()
    }, [photoId, collectionId])

    const handleAddComment = async (e) => {
        e.preventDefault();
        const comment = e.target.comment.value;
        const payload = {
            comment,
            ...(photoId && { photo: photoId }),
            ...(collectionId && { collection: collectionId }),
        }
        try {
            await axiosApi.post('comments/comments/', payload);
            getComments();
            e.target.comment.value = '';
        } catch (error) {
            console.log(error);
        }
    }

    const handleRemoveComment = async (id) => {
        try {
            await axiosApi.delete(`comments/comments/${id}/`);
            getComments();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="flex flex-col w-full bg-gray-100 rounded-lg shadow-md">
            <div className="flex flex-col w-full mb-5 p-4 bg-white rounded-lg h-[450px] overflow-hidden overflow-y-auto">
                {
                    comments.length === 0 ? 
                    <p className="text-gray-500">Se el primero en agregar un comentario!</p> :
                    <div>
                        <h2 className="text-xl font-semibold mb-2">{comments.length} Comentarios</h2>
                        <div className='space-y-4'> 
                            {comments.map(comment => (
                                <div key={comment.id} className="flex flex-col gap-5 p-2">
                                    <div className='flex justify-between items-center'>
                                        <div className="flex justify-center items-center gap-1">
                                            <div className="flex w-10 h-10 rounded-full">
                                                <img className="object-cover w-full h-full" src={comment.user.profile.profile_image_url} alt="profile photo"/>
                                            </div>
                                            <div>
                                                <p className="font-medium">{comment.user?.username}</p>
                                            </div>
                                        </div>
                                        {parseInt(idUser) === parseInt(comment.user?.id) && (
                                            <Tooltip content='Eliminar comentario' style='dark' placement='bottom' >
                                                <button 
                                                    onClick={() => handleRemoveComment(comment.id)} 
                                                    className="text-red-500 rounded hover:text-red-700">
                                                        <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </Tooltip>
                                        )}
                                    </div>
                                    <p className="pl-4 border-l-2 border-l-[#3a0ca3]">{comment.comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                }
            </div>
            <form onSubmit={handleAddComment} method="post" className="flex flex-col space-y-2">
                <input type="text" name="comment" id="comment" className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Agregar un Comentario" />
                <button type="submit" className="bg-[#b5179e] text-white p-3 rounded-sm">Enviar</button>
            </form>
        </div>
    )
}

NewComment.propTypes = {
    photoId: PropTypes.number,
    collectionId: PropTypes.number
};