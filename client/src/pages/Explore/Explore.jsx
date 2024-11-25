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
        <div className="flex flex-col gap-48 w-full h-full">
            <section className="flex flex-col justify-center w-full h-full p-10">
                <div className="flex justify-between p-10">
                    <h1 className="text-xl font-semibold">Fotos mas likeadas</h1>
                    <Link to={'/explore/fotosMasLikeadas'}>Explora mas</Link>
                </div>
                <ListsPhotos gridRowEndOption={true} data={exploreData?.most_liked_photos?.slice(0, 10) || []} layoutStyle={'grid'} type={'photos'} />
            </section>
            <section className="flex flex-col justify-center w-full h-full p-10">
                <div className="flex justify-between p-10">
                    <h1 className="text-xl font-semibold">Fotos mas vistas</h1>
                    <Link to={'/explore/fotosMasVistas'}>Explora mas</Link>
                </div>
                <ListsPhotos gridRowEndOption={true} data={exploreData?.most_liked_photos?.slice(0, 10) || []} layoutStyle={'grid'} type={'photos'} />
            </section>
            <section className="flex flex-col justify-center w-full h-full p-10">
                <div className="flex justify-between p-10">
                    <h1 className="text-xl font-semibold">Colecciones con mas vistas</h1>
                    <Link to={'/explore/coleccionesConMasVisitas'}>Explora mas</Link>
                </div>
                <ListsPhotos gridRowEndOption={true} data={exploreData?.most_viewed_collections?.slice(0, 10) || []} layoutStyle={'grid'} type={'collections'} />
            </section>
            <section className="flex flex-col justify-center w-full h-full p-10">
                <div className="flex justify-between p-10">
                    <h1 className="text-xl font-semibold">Colecciones con mas likes</h1>
                    <Link to={'/explore/coleccionesConMasLikes'}>Explora mas</Link>
                </div>
                <ListsPhotos gridRowEndOption={true} data={exploreData?.most_liked_collections?.slice(0, 10) || []} layoutStyle={'grid'} type={'collections'} />
            </section>
        </div>
    )
}
