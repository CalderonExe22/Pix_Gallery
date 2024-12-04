import { useEffect, useState } from "react"
import axiosApi from "../../services/axiosApi"
import Tabs from "../../components/Tabs/Tabs"
import Tab from "../../components/Tabs/Tab"
import ListsPhotos from "../../components/ListsPhotos/ListsPhotos"
import { Spinner } from "flowbite-react"

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
        document.title = 'WishList'
        getWishlist()
    },[])

    const allCollections = wishlist.filter(item => item.collection)
    const collections = allCollections.map(item => item.collection)
    const individualPhotos = wishlist.filter(item => item.photo)
    const photos = individualPhotos.map(item => item.photo)

    return (
        <div className="flex flex-col h-full w-full gap-10">
            <div className="flex justify-center items-center">
                <h1 className="font-semibold text-2xl">Explora y añade imágenes a tu WishList</h1>
            </div>
            {wishlist?.length > 0 ? (
                <>
                {wishlist?.length > 0 ? (
                    <Tabs styleButtonTab={'w-[200px] text-xl font-semibold'}>
                        <Tab title={'fotografias ('+photos.length+')'}>
                            {photos.length > 0 ? (
                                <ListsPhotos gridRowEndOption={true} layoutStyle={'grid'} type={'photos'} data={photos} />
                            ):(
                                <h1 className="font-semibold text-2xl">Cuanto espacio!. Explora y añade Colecciones a tu WishList</h1>
                            )}
                        </Tab>
                        <Tab title={'Colecciones ('+collections.length+')'}>
                            {collections.length > 0 ? (
                                <ListsPhotos gridRowEndOption={true} layoutStyle={'grid'} type={'collections'} data={collections} />    
                            ):(
                                <h1 className="font-semibold text-2xl">Cuanto espacio!. Explora y añade Colecciones a tu WishList</h1>
                            )}
                        </Tab>
                    </Tabs>
                ) : (
                    <div className="flex justify-center items-center">
                        <h1 className="font-semibold text-2xl">Cuanto espacio!. Explora y añade imágenes a tu WishList</h1>
                    </div>
                )}
                </>
            ) : (
                <div className="flex justify-center w-full">
                    <Spinner color="purple" aria-label="Extra large spinner example" size="xl" />
                </div>
            )}
            
        </div>
    )
}
