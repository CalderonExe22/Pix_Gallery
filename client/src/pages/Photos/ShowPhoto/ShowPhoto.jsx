import { useEffect, useRef, useState } from "react"
import { Link, useParams } from "react-router-dom"
import axiosApi from "../../../services/axiosApi"
import LikeButton from "../../../components/Likes/LikeButton"
import NewComment from "../../../components/Comments/NewComment"
import ButtonFollower from "../../../components/ButtonFollower/ButtonFollower"
import NewWishList from "../../../components/Wishlist/NewWishList"
export default function ShowPhoto() {
    const { id } = useParams()
    const [photo,setPhoto] = useState(null)
    const isMounted = useRef(false)

    function DateFormatter({ isoDate }) {
        const formattedDate = new Date(isoDate).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    
        return <span>{formattedDate}</span>;
    }

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
    console.log(photo)
    return (
        <div className="grid grid-cols-3 justify-center items-center w-full h-screen">
            {photo ? (
                <>
                <div className="flex col-span-2 justify-center items-center h-full w-full">
                    <img src={photo.image_url} alt={photo.title} />
                </div>
                <div className="flex flex-col col-span-1 justify-start items-start w-full h-[900px] overflow-hidden overflow-y-auto p-32 gap-16">
                    <div className="sticky top-0 left-0 bg-white flex justify-start gap-10 w-full">
                        <LikeButton type="photo" id={photo.id} />
                        <NewWishList type="photo" id={photo?.id} />
                    </div>
                    <div className="flex flex-col justify-start w-full gap-7">
                        <div className="flex flex-col gap-1">
                            <span className="font-medium">-Titulo de la fotografia.</span>
                            <h1 className="text-4xl">{photo.title}</h1>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="font-medium text-lg">-Descripcion de la fotografia.</span>
                            <p>{photo.description}</p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-start w-full gap-5">
                        <p className="text-base flex gap-3 items-center"><i className="fa-regular fa-heart"></i>{photo.likes_count} <span>Likes</span></p>
                        <p className="text-base flex gap-3 items-center"><i className="fa-regular fa-comment"></i>{photo.comments_count}<span>Comentarios</span></p>
                        <p className="text-base flex gap-3 items-center"><i className="fa-regular fa-eye"></i>{photo.view_count} <span>Vistas</span></p>
                        <p className="text-base flex gap-3 items-center"><i className="fa-solid fa-calendar-days"></i><DateFormatter isoDate={photo.created_at}/></p>
                    </div>
                    <div className="flex justify-between w-full">
                        <div className="flex justify-center items-center gap-3">
                            <div className="flex w-10 h-10 rounded-full">
                                <img className="object-cover w-full h-full" src={photo.user?.profile.profile_photo} alt="profile photo"/>
                            </div>
                            <div>
                                <Link to={'/perfil/'+photo.user?.id} className="font-medium">{photo.user?.username}</Link>
                                <p>{photo.user?.followers_count} {photo.user?.followers_count > 1 ? <span>Seguidores</span> : <span>Seguidor</span> }</p>
                            </div>
                        </div>
                        <ButtonFollower followedId={photo.user?.id} />
                    </div>
                    {photo?.exif_data ? (
                        <div className="flex flex-col justify-start w-full gap-5">
                            <h1 className="font-semibold text-3xl">-Exif data.</h1>
                            <p className="text-base flex gap-3 items-center">Camara: {photo.exif_data?.camera}</p>
                            <p className="text-base flex gap-3 items-center">Lente: {photo.exif_data?.lens}</p>
                            <p className="text-base flex gap-3 items-center">Apertura: {photo.exif_data?.aperture}</p>
                            <p className="text-base flex gap-3 items-center">Distancia focal: {photo.exif_data?.focal_length}</p>
                            <p className="text-base flex gap-3 items-center">Velocidad de apertura: {photo.exif_data?.shutter_speed}</p>
                            <p className="text-base flex gap-3 items-center">ISO: {photo.exif_data?.iso}</p>
                        </div>
                    ) : (
                        <p>No se proporciono exif data</p>
                    )}                 
                    <NewComment photoId={photo.id} />
                    {photo?.tags_photo ? (
                        <div className="flex flex-wrap w-full h-auto gap-2">
                            {photo?.tags_photo.map((tag, index) => (    
                                <div  key={index} className="flex justify-center items-center gap-2 p-2 w-auto h-auto rounded-md border-solid border-2 border-[#b5179e] text-[#b5179e]">
                                    <span className="w-full">{tag.name}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>No se proporciono tags a esta fotografia</div>
                    )}
                </div>
                </>
            ) : (
                <div>Cargando datos del usuario...</div>
            )}
            
        </div>
    )
}


