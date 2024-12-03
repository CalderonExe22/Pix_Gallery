import { useEffect, useState } from "react"
import axiosApi from "../../services/axiosApi"
import { useDispatch, useSelector } from "react-redux"
import { userData } from "../../features/auth/authThunk"
import Tabs from "../../components/Tabs/Tabs"
import Tab from "../../components/Tabs/Tab"
import Portafolio from "../Portafolio/Portafolio"
import CardPhoto from "../../components/Cards/CardPhoto/CardPhoto"
import { useParams } from "react-router-dom"
import UserStatistics from "../../components/Statistics/UserStatistics"
import ButtonFollower from "../../components/ButtonFollower/ButtonFollower"
import CardCollection from "../../components/Cards/CardCollection/CardCollection"

export default function Profile() {
    const {id} = useParams()
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user)
    const [profile, setProfile] = useState([])
    const [photos, setPhotos] = useState([])
    const [collections, setCollections] = useState([])
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
    useEffect(()=>{
        fechPhotos()
        feachProfile()
        fechCollections()
        dispatch(userData())
    },[dispatch,id])
    console.log(profile)
    console.log(collections)
    return (
        <section className="flex flex-col items-center gap-4 h-full w-full py-28">
            <div className="">   
                <img className='w-[250px] h-[250px] rounded-full' src={profile?.profile?.profile_photo} />
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
                    <a className="bg-[#b5179e] text-white p-3 rounded-sm cursor-pointer" href={"/manage-account/editar-perfil/"+user?.id}>Editar perfil</a>
                </div>
            ):(
                <ButtonFollower followedId={parseInt(id)} />
            )}
            <div className="flex justify-center items-center w-full px-10">
                <Tabs styleButtonTab={'w-[200px] text-ms font-semibold'}>
                    <Tab title={'Mis fotografias: ('+photos.length+')'}>
                        {photos.length > 0 ? (
                            <div className="grid grid-cols-5  gap-5 w-full h-full p-10">
                                {photos.map((photo) => (
                                    <CardPhoto idUser={user?.id} show={true} gridRowEndOption={true} key={photo.id} data={photo} />
                                ))} 
                            </div>
                        ) : (
                            <h1>No tienes fotos creadas</h1>
                        )}
                    </Tab>
                    <Tab title={'Mis colecciones: ('+collections.length+')'}>
                        {collections.length > 0 ? (
                        <div className="grid grid-cols-[repeat(5,minmax(300px,1fr))] gap-5 w-full h-full p-10">
                            {collections.map((collection) => (
                                <CardCollection show={true} idUser={user?.id} gridRowEndOption={true} key={collection.id} collection={collection} />
                            ))}
                        </div>
                        ) : (
                            <h1>No tiene colecciones creadas</h1>
                        )}
                    </Tab>
                    <Tab title={'Portafolio'}>
                        {profile?.has_portafolio ? (
                            <>
                                {user ? (
                                    <Portafolio idUser={user?.portafolio_id} />
                                ) : (
                                    <div>...cargando</div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col gap-5">
                                <h1>No tienes portafolio creado</h1>
                                {user?.id === parseInt(id) && (
                                    <a className="p-4 flex justify-center bg-[#b5179e] text-white" href="/create-portafolio">Crea tu portafolios</a>
                                )}
                            </div>
                        )}
                    </Tab>
                </Tabs>
            </div>
        </section>

    )
}
