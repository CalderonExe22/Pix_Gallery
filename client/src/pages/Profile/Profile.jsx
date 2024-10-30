import { useEffect, useState } from "react"
import axiosApi from "../../services/axiosApi"
import { useDispatch, useSelector } from "react-redux"
import { userData } from "../../features/auth/authThunk"

export default function Profile() {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user)
    const [profile, setProfile] = useState([])

    const feachProfile = async () =>{
        try {
            const response = await axiosApi.get('profile/profile/')
            if(response){
                setProfile(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
        feachProfile()
        dispatch(userData())
    },[dispatch])
    return (
        <div className="flex justify-center items-center h-full">
            <section className="flex flex-col items-center gap-4">
                <div className="">   
                    {
                        profile.profile_photo ? (
                            <img className='w-[250px] h-[250px] rounded-full' src={'https://res.cloudinary.com/dowtoqcra/'+profile.image} />
                        ):(
                            <img className='w-[250px] h-[250px] rounded-full' src="https://res.cloudinary.com/dowtoqcra/image/upload/v1729264496/wbtownzvwkokccchbbto.webp" alt="sinfotodeperfil" />
                        )
                    }
                </div>
                <div className="flex justify-center">
                    <div className="flex gap-5">
                        <span className="text-4xl font-semibold">{profile.name}</span>
                        <span className="text-4xl font-semibold">{profile.last_name}</span>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center gap-3">
                    {user ? (
                        <>
                            <span className="font-semibold">@{user.username}</span>
                            <span className="font-semibold">{user.email}</span>
                            {/* Otros datos del usuario */}
                        </>
                    ) : (
                        <div>Cargando datos del usuario...</div>
                    )}
                    <span className="font-semibold">{profile.bio}</span>
                    <span className="font-semibold"><i className="fa-solid fa-location-dot"></i> {profile.country}</span>
                </div>
                <div className="flex justify-center m-10">
                    <div>
                        <button><a href="/editar-perfil">Editar perfil</a></button>
                    </div>
                </div>
            </section>

        </div>
    )
}
