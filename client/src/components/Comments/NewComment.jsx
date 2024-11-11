import { useState, useEffect } from 'react';
import axiosApi from '../../services/axiosApi';
import PropTypes from 'prop-types';

export default function NewComment({ photoId }) {

    const [comments, setComments] = useState([]);

    const getComments = async () => {
        try {
            const response = await axiosApi.get('comments/comments/');
            response.data = response.data.filter(comment => comment.photo === photoId);
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
        <div className="p-1">
            <div className="mb-5 p-1 border border-gray-400">
                {
                    comments.length == 0 ? <p>Se el primero en agregar un comentario!</p> :
                    <div className="flex justify-between p-2">
                        {comments.map(comment => (
                            <div key={comment.id} >
                                <p>{comment.comment}</p>
                                <button onClick={() => handleRemoveComment(comment.id)} className="bg-red-500 text-white p-2">Eliminar</button>
                            </div>
                        ))}
                    </div>
                }
                
            </div>
            <form onSubmit={handleAddComment} method="post">
                <input type="text" name="comment" id="comment" className="p-2 mb-2 rounded border border-gray-400" placeholder="Agregar un Comentario" />
                <button type="submit" className="p-2 bg-blue-500 text-white">Enviar</button>
            </form>
        </div>
    )
}

NewComment.propTypes = {
    photoId: PropTypes.number.isRequired,
};