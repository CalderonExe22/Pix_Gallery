import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import axiosApi from "../../../services/axiosApi"
import LikeButton from "../../../components/Likes/LikeButton"
import NewComment from "../../../components/Comments/NewComment"
import ButtonFollower from "../../../components/ButtonFollower/ButtonFollower"
export default function ShowPhoto() {
    const { id } = useParams()
    const [photo,setPhoto] = useState(null)
    const isMounted = useRef(false)
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
    return (
        <div className="grid grid-cols-3 w-full h-full">
            {photo ? (
                <>
                <div className="col-span-2 h-screen w-full">
                    <img className="object-cover h-full w-full" src={photo.image_url} alt={photo.title} />
                </div>
                <div className="col-span-1 flex flex-col gap-10 ms-7 me-7">
                    <div className="flex justify-start w-full">
                        <LikeButton photoId={photo.id} />
                    </div>
                    <div className="flex flex-col justify-start w-full gap-5">
                        <h1 className="text-4xl">{photo.title}</h1>
                        <h1>{photo.description}</h1>
                    </div>
                    <div>
                        <ButtonFollower followedId={photo?.user} />
                    </div>
                    <div>
                        <NewComment photoId={photo.id} />
                    </div>
                </div>
                </>
            ) : (
                <div>Cargando datos del usuario...</div>
            )}
            
        </div>
    )
}
