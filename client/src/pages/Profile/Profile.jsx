import { useEffect, useState } from "react"
import axiosApi from "../../services/axiosApi"
//import { useDispatch, useSelector } from "react-redux"
//import { userData } from "../../features/auth/authThunk"
import Tabs from "../../components/Tabs/Tabs"
import Tab from "../../components/Tabs/Tab"
import Portafolio from "../Portafolio/Portafolio"
import CardPhoto from "../../components/Cards/CardPhoto/CardPhoto"
import CardCollectionFolden from "../../components/Cards/CardCollection/CardCollectionFolden"
import { useParams } from "react-router-dom"
import UserStatistics from "../../components/Statistics/UserStatistics"
import ButtonFollower from "../../components/ButtonFollower/ButtonFollower"

export default function Profile() {
    const {id} = useParams()
//    const dispatch = useDispatch()
//    const user = useSelector((state) => state.auth.user)
    const [profile, setProfile] = useState([])
    const [photos, setPhotos] = useState([])
    const [collections, setCollections] = useState([])
    const [user, setUser] = useState([])
    console.log(id)
    const feachProfile = async () =>{
        try {
            const response = await axiosApi.get(`users/api-user/${id}/`)
            if(response){
                setProfile(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const fechPhotos = async () => {
        const response = await axiosApi.get(`photos/photography/user-photographies/${id}/`)
        setPhotos(response.data)
    }
    const fechCollections = async () => {
        const response = await axiosApi.get(`photos/collections/user-collections/${id}/`)
        setCollections(response.data)
    }

    const userInfo = async () => {
        try {
            const response = await axiosApi.get('users/user/')
            setUser(response.data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(()=>{
        fechPhotos()
        feachProfile()
        fechCollections()
        userInfo()
//        dispatch(userData())
    },[id])//dispatch,id])
    console.log(profile.id)

    console.log(collections)

    return (
        <section className="flex flex-col items-center gap-4 h-full w-full">
            <div className="">   
                {
                    profile.profile?.profile_photo ? (
                        <img className='w-[250px] h-[250px] rounded-full' src={'https://res.cloudinary.com/dowtoqcra/'+profile.image} />
                    ):(
                        <img className='w-[250px] h-[250px] rounded-full' src="https://res.cloudinary.com/dowtoqcra/image/upload/v1729264496/wbtownzvwkokccchbbto.webp" alt="sinfotodeperfil" />
                    )
                }
            </div>
            <div className="flex justify-center">
                <div className="flex gap-5">
                    <span className="text-4xl font-semibold">{profile.profile?.name}</span>
                    <span className="text-4xl font-semibold">{profile.profile?.last_name}</span>
                </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-3">
                {profile ? (
                    <>
                        <span className="font-semibold">@{profile.username}</span>
                        <span className="font-semibold">{profile.email}</span>
                        {/* Otros datos del usuario */}
                    </>
                ) : (
                    <div>Cargando datos del usuario...</div>
                )}
                <span className="font-semibold">{profile.profile?.bio}</span>
                <span className="font-semibold"><i className="fa-solid fa-location-dot"></i> {profile.profile?.country}</span>
            </div>
            <div>
                <UserStatistics userId={parseInt(id)} />
            </div>
            {user?.id === parseInt(id) ? (
                <div className="flex justify-center m-10">
                    <button><a href={"/editar-perfil/"+profile?.id}>Editar perfil</a></button>
                </div>
            ):(
                <ButtonFollower followedId={parseInt(id)} />
            )}
            <div className="flex justify-center items-center w-full">
                <Tabs>
                    <Tab title={'Mis fotografias'}>
                        {photos.length > 0 ? (
                            <div className="grid grid-cols-4 gap-5 w-full h-full">
                                {photos.map((photo) => (
                                    <CardPhoto id={photo.id} key={photo.id} url={photo.image_url} title={photo.title} />
                                ))} 
                            </div>
                        ) : (
                            <h1>No tienes fotos creadas</h1>
                        )}
                    </Tab>
                    <Tab title={'Mis colecciones'}>
                        {collections.length > 0 ? (
                        <div className="grid grid-cols-4 gap-8 w-full h-full">
                            {collections.map((collection) => (
                                <CardCollectionFolden id={collection.id} key={collection.id} photos={collection.photos} />
                            ))}
                        </div>
                        ) : (
                            <h1>No tiene colecciones creadas</h1>
                        )}
                    </Tab>
                    <Tab title={'Portafolio'}>
                        {profile?.has_portafolio ? (
                            <>
                                {profile ? (
                                    <Portafolio idUser={profile?.portafolio_id} />
                                ) : (
                                    <div>...cargando</div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col gap-5">
                                <h1>No tienes portafolio creado</h1>
                                {
                                    user.id === parseInt(id) && (
                                        <a className="p-4 flex justify-center bg-[#b5179e] text-white" href="/create-portafolio">Crea tu portafolios</a>
                                    )
                                }
                            </div>
                        )}
                    </Tab>
                </Tabs>
            </div>
        </section>

    )
}
