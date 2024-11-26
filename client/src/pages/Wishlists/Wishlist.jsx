import { useEffect, useState } from "react"
import axiosApi from "../../services/axiosApi"
import Tabs from "../../components/Tabs/Tabs"
import Tab from "../../components/Tabs/Tab"
import ListsPhotos from "../../components/ListsPhotos/ListsPhotos"

export default function Wishlist() {
    const [wishlist, setWishlist] = useState([])
    
    const getWishlist = async () => {
        try {
            const response = await axiosApi.get('wishlist/wishlist/get_user_wishlist/')
            if(response.status === 200){
                setWishlist(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        getWishlist()
    },[])

    console.log(wishlist)

    const allCollections = wishlist.filter(item => item.collection)
    const collections = allCollections.map(item => item.collection)
    const individualPhotos = wishlist.filter(item => item.photo)
    const photos = individualPhotos.map(item => item.photo)

    console.log(collections)

    return (
        <div className="flex flex-col h-full w-full gap-10">
            <div className="flex justify-center items-center">
                <h1 className="font-semibold text-2xl">Explora y añade imágenes a tu WishList</h1>
            </div>
            {wishlist?.length > 0 ? (
                <Tabs>
                    <Tab title={'fotografias'}>
                        <ListsPhotos gridRowEndOption={true} layoutStyle={'grid'} type={'photos'} data={photos} />
                    </Tab>
                    <Tab title={'Colecciones'}>
                        <ListsPhotos gridRowEndOption={true} layoutStyle={'grid'} type={'collections'} data={collections} />    
                    </Tab>
                </Tabs>
            ) : (
                <h1>No tienes colecciones o fotografias añadidas</h1>
            )}
            
        </div>
    )
}
