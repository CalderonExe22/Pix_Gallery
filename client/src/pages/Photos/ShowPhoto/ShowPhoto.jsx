import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import axiosApi from "../../../services/axiosApi"
import NewComment from "../../../components/Comments/NewComment"
import Wishlist from "../../../components/Wishlist/NewWishList"
import LikeButton from "../../../components/Likes/LikeButton"
import style from "./ShowPhoto.module.css"

export default function ShowPhoto() {

    const { id } = useParams()
    const [photo,setPhoto] = useState(null)
    const isMounted = useRef(false)
    //console.log(id)

    const getViews = async () => {
        try {
            const response = await axiosApi.get('views/views/get_user_views/');
            console.log(response.data)
            const viewPhoto = response.data.some(view => view.photo === parseInt(id));
            console.log(viewPhoto)
            if(!viewPhoto){
                try {
                    const response = await axiosApi.post('views/views/', {photo: id});
                    console.log(response)
                } catch (error) {
                    console.log(error)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchPhoto = async (id) =>{
        try {
            const response = await axiosApi.get(`photos/photography/${id}/`)
            if(response.data){
                setPhoto(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        if (isMounted.current) return
        isMounted.current = true
        getViews()
        fetchPhoto(id)
    },[id])
    //console.log(photo)

    return (
        <div className="grid grid-cols-3 justify-center items-center">
            {photo ? (
                <>
                    <div className="col-span-2 ms-7 me-7">
                        <div className={style.containerPhoto}>
                            <img className={style.image} src={photo.image_url} alt={photo.title} />
                            <div className={style.wishlist}>
                                <Wishlist photoId={photo.id} />
                            </div>
                            <div className={style.like}>
                                <LikeButton photoId={photo.id} />
                            </div>
                        </div>
                    </div>
                    <div className="col-span-1 flex flex-col gap-10 ms-7 me-7">
                        <h1 className="text-4xl">{photo.title}</h1>
                        <p>{photo.description}</p>
                        <NewComment photoId={photo.id} />
                    </div>
                </>
            ) : (
                <div>Cargando datos del usuario...</div>
            )}
        </div>
    )
}
