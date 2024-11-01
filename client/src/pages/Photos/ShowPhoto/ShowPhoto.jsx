import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axiosApi from "../../../services/axiosApi"
export default function ShowPhoto() {
    const { id } = useParams()
    const [photo,setPhoto] = useState(null)
    console.log(id)
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
        fetchPhoto(id)
    },[id])
    console.log(photo)
    return (
        <div className="grid grid-cols-3">
            {photo ? (
                <>
                <div className="col-span-2 ms-7 me-7 h-full w-full">
                    <img className="object-cover h-full w-full" src={photo.image_url} alt={photo.title} />
                </div>
                <div className="col-span-1 flex flex-col gap-10 ms-7 me-7">
                    <h1 className="text-4xl">{photo.title}</h1>
                    <h1>{photo.description}</h1>
                </div>
                </>
            ) : (
                <div>Cargando datos del usuario...</div>
            )}
            
        </div>
    )
}
