import PropTypes from 'prop-types' 
import { useNavigate } from 'react-router-dom'
export default function CardCollectionFolden({id = null,photos,title,width = 300, height = 300}) {
    const navigate = useNavigate()
    const showCollection = (idCollection) => {
        navigate('/ver-coleccion/'+idCollection)
        location.reload()
    }   
    return (
        <div onClick={id ? (() => showCollection(id)) : ( ()=>{} )} className="flex flex-col gap-3 p-4 shadow-xl bg-gray-200 group cursor-pointer">
            <div className='flex gap-2'>
                <i className="fa-solid fa-images"></i><p>{photos.length}</p>
            </div>
            <div className='grid grid-cols-2 grid-rows-2 gap-5' style={{ width: `${width}px`, height: `${height}px` }}>
                {photos.map((photo) => (
                    <img key={photo.id} 
                        src={photo.image_url}
                        className='w-full h-full object-cover transition-transform duration-500 transform group-hover:scale-105'
                        alt={photo.title}
                    />
                ))}
            </div>
            <div>
                {title}
            </div>
        </div>
    )   
}

CardCollectionFolden.propTypes = {
    photos:PropTypes.array,
    id:PropTypes.number,
    title:PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number
}