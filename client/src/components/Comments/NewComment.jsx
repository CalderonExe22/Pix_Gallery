import { useState, useEffect } from 'react';
import axiosApi from '../../services/axiosApi';
import PropTypes from 'prop-types';

export default function NewComment({ photoId }) {

    const [comments, setComments] = useState([]);

    const getComments = async () => {
        try {
            const response = await axiosApi.get('comments/comments/get_all_comments/');
            response.data = response.data.filter(comment => comment.photo === photoId);
            console.log(response.data);
            setComments(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getComments();
    }, []);

    const handleAddComment = async (e) => {
        e.preventDefault();
        const comment = e.target.comment.value;
        try {
            await axiosApi.post('comments/comments/', { photo: photoId, comment: comment });
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
        <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <div className="mb-5 p-4 border border-gray-300 bg-white rounded-lg">
                {
                    comments.length === 0 ? 
                    <p className="text-gray-500">Se el primero en agregar un comentario!</p> :
                    <div>
                        <h2 className="text-xl font-semibold mb-2">{comments.length} Comentarios</h2>
                        <div className='space-y-4'> 
                            {comments.map(comment => (
                                <div key={comment.id} className="p-2">
                                    <div className='flex justify-between items-center'>
                                        <p>{comment.user}</p>
                                        <button 
                                            onClick={() => handleRemoveComment(comment.id)} 
                                            className="text-red-500 rounded hover:text-red-700">
                                                <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                    <p className="pl-4 border-l-2 border-l-blue-500">{comment.comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                }
            </div>
            <form onSubmit={handleAddComment} method="post" className="flex flex-col space-y-2">
                <input type="text" name="comment" id="comment" className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Agregar un Comentario" />
                <button type="submit" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">Enviar</button>
            </form>
        </div>
    )
}

NewComment.propTypes = {
    photoId: PropTypes.number.isRequired,
};