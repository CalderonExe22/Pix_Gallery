import { useEffect, useState } from 'react'
import style from './ListsPhotos.module.css'
import axiosApi from '../../services/axiosApi'
import CardPhoto from '../CardPhoto/CardPhoto'

export default function ListsPhotos() {
    const [photos, setPhotos] = useState([])
    const fetchPhotos = async () => {
        const response = await axiosApi.get('photos/photography/get_all_photographies/')
        setPhotos(response.data)
    }
    useEffect(()=>{
        fetchPhotos()
    },[])
    
    return (
        <div className={style.containerPhotos}>
            {photos.map((photo, index) => (
                <CardPhoto 
                    key={photo.id} 
                    title={photo.title} 
                    url={photo.image_url} 
                    isLarge={index % 2 === 0}
                />
            ))}
        </div>
    )
}
