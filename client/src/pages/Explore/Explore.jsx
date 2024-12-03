import { useEffect, useState } from "react"
import axiosApi from "../../services/axiosApi"
import ListsPhotos from "../../components/ListsPhotos/ListsPhotos"
import { Link } from "react-router-dom"

export default function Explore() {
    const [exploreData, setExploreData] = useState([])
    const fetchExploreData = async () => {
        try {
            const response = await axiosApi.get('photos/explore/')
            if(response.status === 200){
                setExploreData(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchExploreData()
    },[])
    console.log(exploreData)
    return (
        <div className="flex flex-col gap-48 w-full h-full py-40">
            <section className="flex flex-col justify-center w-full h-auto p-10">
                <div className="flex justify-between items-center w-full px-[72px] py-10">
                    <div className="flex flex-col gap-5">
                        <h1 className="text-2xl font-bold">Fotografias con mas likes</h1>
                        <p>Descubre las fotografias mas con likes en el sitio</p>
                    </div>
                    <Link className="font-semibold transition-colors duration-300 hover:text-[#3a0ca3]" to={'/explore/fotosMasLikeadas'}>Explora mas</Link>
                </div>
                <ListsPhotos gridRowEndOption={false} data={exploreData?.most_liked_photos?.slice(0, 10) || []} layoutStyle={'gridOrden'} type={'photos'} />
            </section>
            <section className="flex flex-col justify-center w-full h-auto p-10">
                <div className="flex justify-between items-center w-full px-[72px] py-10">
                    <div className="flex flex-col gap-5">
                        <h1 className="text-2xl font-bold">Fotografias con mas visitas</h1>
                        <p>Descubre las fotografias mas con visitas en el sitio</p>
                    </div>
                    <Link className="font-semibold transition-colors duration-300 hover:text-[#3a0ca3]" to={'/explore/fotosMasVistas'}>Explora mas</Link>
                </div>
                <ListsPhotos gridRowEndOption={false} data={exploreData?.most_liked_photos?.slice(0, 10) || []} layoutStyle={'gridOrden'} type={'photos'} />
            </section>
            <section className="flex flex-col justify-center w-full h-auto p-10">
                <div className="flex justify-between items-center w-full px-[72px] py-10">
                    <div className="flex flex-col gap-5">
                        <h1 className="text-2xl font-bold">Colecciones con mas visitas</h1>
                        <p>Descubre las Colecciones con mas visitas en el sitio</p>
                    </div>
                    <Link className="font-semibold transition-colors duration-300 hover:text-[#3a0ca3]" to={'/explore/coleccionesConMasVisitas'}>Explora mas</Link>
                </div>
                <ListsPhotos gridRowEndOption={true} data={exploreData?.most_viewed_collections?.slice(0, 10) || []} layoutStyle={'gridOrden'} type={'collections'} />
            </section>
            <section className="flex flex-col justify-center w-full h-auto p-10">
                <div className="flex justify-between items-center w-full px-[72px] py-10">
                    <div className="flex flex-col gap-5">
                        <h1 className="text-2xl font-bold">Colecciones con mas Likes</h1>
                        <p>Descubre las Colecciones con mas Likes en el sitio</p>
                    </div>
                    <Link className="font-semibold transition-colors duration-300 hover:text-[#3a0ca3]" to={'/explore/coleccionesConMasLikes'}>Explora mas</Link>
                </div>
                <ListsPhotos gridRowEndOption={true} data={exploreData?.most_liked_collections?.slice(0, 10) || []} layoutStyle={'gridOrden'} type={'collections'} />
            </section>
        </div>
    )
}
