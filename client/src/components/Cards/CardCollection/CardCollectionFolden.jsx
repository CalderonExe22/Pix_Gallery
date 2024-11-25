import PropTypes from 'prop-types' 
import { useNavigate } from 'react-router-dom'
import NewWishList from '../../Wishlist/NewWishList'
import LikeButton from '../../Likes/LikeButton'
import DeleteButton from '../../DeleteButton/DeleteButton'
import PrivacyButton from '../../PrivacyButton/PrivacyButton'
import EditCollection from '../../EditCollection/EditCollection'
export default function CardCollectionFolden({collection,rowSpan}) {
    const navigate = useNavigate()
    const showCollection = (idCollection) => {
        navigate('/ver-coleccion/'+idCollection)
        location.reload()
    }   
    return (
        <div className="flex flex-col gap-3 p-4 shadow-xl bg-gray-300 group cursor-pointer"  style={{ gridRowEnd: `span ${rowSpan}` }}>
            <div className='flex justify-between items-center w-full'>
                <div className='flex gap-2'>
                    <i className="fa-solid fa-images"></i><p>{collection?.photos.length}</p>    
                </div>
                <div className='flex gap-4'>
                    <DeleteButton id={collection?.id} type={'collection'} />
                    <PrivacyButton id={collection?.id} type={'collection'} isPublic={collection?.is_public} />
                    <EditCollection collectionData={collection} />
                </div>
            </div>
            <div onClick={collection?.id ? (() => showCollection(collection?.id)) : ( ()=>{} )} className='grid grid-cols-2 grid-rows-2 gap-5'>
                {collection?.photos.map((photo) => (
                    <img key={photo.id} 
                        src={photo.image_url}
                        className='w-full h-full object-cover transition-transform duration-500 transform group-hover:scale-105'
                        alt={photo.title}
                    />
                ))}
            </div>
            <div className='flex justify-between items-center w-full h-full'>
                <div className="flex justify-center items-center gap-3">
                    <span className="text-sm font-semibold">{collection?.name}</span>
                </div>
                <div className="flex justify-center items-center gap-5">
                    <NewWishList id={collection?.id} type="collection" />
                    <LikeButton id={collection?.id} type="collection" />
                </div>
            </div>
        </div>
    )   
}

CardCollectionFolden.propTypes = {
    collection : PropTypes.object,
    rowSpan: PropTypes.number,
}