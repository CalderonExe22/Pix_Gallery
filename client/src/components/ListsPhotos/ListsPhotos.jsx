import style from './ListsPhotos.module.css';
import CardPhoto from '../CardPhoto/CardPhoto';
import PropTypes from 'prop-types';

export default function ListPhotos({ photos }) {
    return (
        <div className={style.containerPhotos}>
            {photos.map((photo, index) => (
                <CardPhoto 
                    key={photo.id} 
                    title={photo.title} 
                    url={photo.image} 
                    isLarge={index % 2 === 0}
                />
            ))}
        </div>
    );
}

// Validación de props con PropTypes
ListPhotos.propTypes = {
    photos: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string,
            image: PropTypes.string.isRequired,
        })
    ).isRequired,
};