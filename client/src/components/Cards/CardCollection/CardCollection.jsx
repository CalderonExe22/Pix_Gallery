import PropTypes from 'prop-types';
import LikeButton from '../../Likes/LikeButton';
import NewWishList from '../../Wishlist/NewWishList';
import { useNavigate } from 'react-router-dom';
import EditCollection from '../../EditCollection/EditCollection';
import DeleteButton from '../../DeleteButton/DeleteButton';
import PrivacyButton from '../../PrivacyButton/PrivacyButton';

export default function CardCollection({ collection, show,gridRowEndOption, idUser }) {

    const navigate = useNavigate()

    const getImages = () => {
        // Si hay menos de 3 fotos, devuelve todas las disponibles
        if (collection.photos?.length < 3) {
            return collection?.photos;
        }
        // Si hay 3 o más fotos, devuelve solo las primeras 3
        return collection?.photos.slice(0, 3);
    }

    const showCollection = (idCollection) => {
        navigate('/ver-coleccion/'+idCollection)
        location.reload()
    }  

    const images = getImages();
    console.log(collection)
    return (
        <div className="relative overflow-hidden rounded-lg shadow-lg group cursor-pointer h-full w-f" style={{ gridRowEnd: gridRowEndOption ? `span ${Math.floor(Math.random() * 5) + 10}` : '' }}>
            <div className="absolute z-30 top-0 left-0 w-full flex items-center justify-start gap-2 px-5 pt-4">
                <div className="flex items-center gap-5 text-white ">
                    {images?.isPublic ===  false && (
                        <i className="fa-solid fa-lock"></i>
                    )}
                </div>
            </div>
            {show && (
                <div className="absolute z-30 top-0 left-0 w-full flex items-center justify-end gap-2 px-5 pt-4 transform -translate-y-full transition-all duration-300 group-hover:-translate-y-0">
                    
                    <div className="flex items-center gap-5 text-white ">
                        {collection?.user?.id === idUser && (
                            <>
                                <EditCollection collectionData={collection} />
                                <DeleteButton id={collection?.id} type={'collection'}/>
                                <PrivacyButton id={collection?.id} isPublic={collection?.is_public} type={'collection'} />
                            </>
                        )}
                    </div>
                
                </div> 
            )}
            <div className='h-full w-full z-50'>
                {images.map((image, index) => {
                    const isThreeImages = images.length === 3;
                    const isTwoImages = images.length === 2;
                    return (
                        <img
                            key={index}
                            src={image.image_url}
                            className={`absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 transform z-${20 - index * 10} ${
                                isThreeImages
                                    ? index === 0
                                        ? "group-hover:-translate-x-2/3"
                                        : index === 1
                                        ? "group-hover:-translate-x-1/3"
                                        : ""
                                    : isTwoImages && index === 0
                                    ? "group-hover:-translate-x-1/2" // Solo desplaza la primera imagen si hay 2
                                    : ""
                            }`}
                            alt={image.title}
                        />
                    );
                })}
            </div>
            {/* Overlay */}
            <div  onClick={() => showCollection(collection?.id)} className="absolute z-20 inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-50"></div>
            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full flex items-center justify-between gap-2 px-4 pb-4 z-30 transform translate-y-full transition-all duration-300 group-hover:translate-y-0">
                <div className="flex justify-center items-center gap-3">
                    <img className="object-cover rounded-full cursor-pointer w-8 h-8" src={collection?.user?.profile?.profile_photo} alt="foto de perfil" />
                    <span className="text-sm font-semibold text-white">{collection?.user?.username}</span>
                </div>
                <div className="flex justify-center items-center gap-5 text-white">
                    <NewWishList id={collection?.id} type="collection" />
                    <LikeButton id={collection?.id} type="collection" />
                </div>
            </div>
        </div>
    );
}

CardCollection.propTypes = {
    show: PropTypes.bool,
    gridRowEndOption : PropTypes.bool,
    idUser : PropTypes.number,
    collection: PropTypes.object.isRequired, 
};