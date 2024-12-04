"use client";
import { Link, useParams } from "react-router-dom"
import axiosApi from "../../../services/axiosApi"
import PropTypes from 'prop-types' 
import { useEffect, useRef, useState } from "react"
import { Carousel } from "flowbite-react";
import NewComment from "../../../components/Comments/NewComment";
import ButtonFollower from "../../../components/ButtonFollower/ButtonFollower";
import LikeButton from "../../../components/Likes/LikeButton";
import NewWishList from "../../../components/Wishlist/NewWishList";
import PaymentCollections from "../../../components/PaymentButton/PaymentCollection";
import ButtonDownload from "../../../components/ButtonDownload/ButtonDownload";
import EditCollection from "../../../components/EditCollection/EditCollection";
import DeleteButton from "../../../components/DeleteButton/DeleteButton";
import PrivacyButton from "../../../components/PrivacyButton/PrivacyButton";

export default function ShowCollection() {

    const {id} = useParams()
    const [collection, setCollection] = useState([])
    const [activeIndex, setActiveIndex] = useState(0)
    const isMounted = useRef(false)
    const [isPayment, setIsPayment] = useState(false);
    const [user, setUser] = useState({});

    const getUserInfo = async () => {
        try {
            const response = await axiosApi.get('users/user/')
            setUser(response.data)
        } catch (error) {
            console.error(error)
        }
    }

    const handlePriceColecction = () => {
        if (!collection.photos) return "0";
        const precios = collection.photos.map(photo => parseFloat(photo.precio));
        const total = precios.reduce((acc, precio) => acc + precio, 0);
        return total;
    }

    const getPayments = async () => {
        try {
            const response = await axiosApi.get('payments/success/get_user_payments/');
            const payments = response.data.filter(payment => payment.collection === parseInt(id) && payment.status === 'approved');
            setIsPayment(payments.length > 0);
        } catch (error) {
            console.log('Error al obtener los pagos:', error);
        }
    };

    const getViews = async () => {
        try {
            const response = await axiosApi.get('views/views/get_user_views/');
            const viewPhoto = response.data.some(view => view.collection === parseInt(id));
            if(!viewPhoto){
                try {
                    await axiosApi.post('views/views/', {collection: id});
                } catch (error) {
                    console.log(error)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    function DateFormatter( isoDate ) {
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

    const fechCollection = async (idCollection) => {
        try {
            const response = await axiosApi.get('photos/collections/'+idCollection)
            if(response.data){
                setCollection(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const dataPhoto = (index) => {
        setActiveIndex(index)
    }

    useEffect(()=>{
        if (isMounted.current) return
        isMounted.current = true
        fechCollection(id)
        getViews()
        getPayments()
        getUserInfo()
    },[id])
    console.log(collection)
    return (
        <div className="grid grid-cols-3 justify-center items-center w-full h-screen">
            {collection && user ? (
                <>
                <div className="flex col-span-2 justify-center items-center h-full w-full">
                    <Carousel rightControl={<div className="flex justify-center items-center h-20 w-20 rounded-full text-4xl border-2 border-solid border-[#3a0ca3] bg-[#3a0ca3] text-white transition-colors duration-300 hover:bg-[#fff] hover:text-[#3a0ca3]"><i className="fa-solid fa-chevron-right"></i></div>} leftControl={<div className="flex justify-center items-center h-20 w-20 rounded-full text-4xl border-2 border-solid border-[#3a0ca3] bg-[#3a0ca3] text-white transition-colors duration-300 hover:bg-[#fff] hover:text-[#3a0ca3]"><i className="fa-solid fa-chevron-left"></i></div>} onSlideChange={dataPhoto} slide={false}>
                        {collection?.photos?.map((photo) => (
                            <img className="max-w-full max-h-full object-contain" key={photo.id} src={photo.image_url} alt={photo.title} />
                        ))}
                    </Carousel>
                </div>
                <div className="relative flex flex-col col-span-1 justify-start items-start w-full h-[900px] overflow-hidden overflow-y-auto px-10 gap-16 pb-10">
                    <div className="sticky top-0 left-0 bg-white flex justify-start gap-7 w-full h-full">
                        {collection?.id ? (
                            <>
                                <LikeButton type="collection" id={collection?.id} />
                                <NewWishList type="collection" id={collection?.id} />
                            </>
                        ):(
                            <div>...cargando</div>
                        )}
                        { collection.user?.id === user.id && (
                            <>
                                <EditCollection collectionData={collection} />
                                <DeleteButton id={collection?.id} type="collection" />
                                <PrivacyButton id={collection?.id} isPublic={collection?.is_public} type={'collection'} />
                            </>
                        )}
                        {   
                        collection?.user?.id !== (user.id) &&
                        (isPayment || handlePriceColecction() === 0 ?
                            collection.photos &&
                            <ButtonDownload title={collection.photos[activeIndex].title} image_url={collection.photos[activeIndex].image_url} />
                        :
                            <PaymentCollections onPayment={collection} />)
                    }
                    </div>
                    <div className="flex flex-col justify-start w-full gap-7">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-lg font-bold">{collection.name}</h1>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p>{collection.description}</p>
                        </div>
                    </div>
                    {collection?.category_data ? (
                            <div className="flex justify-start items-center">
                                <p>Categoria: <span className="font-bold">{collection?.category_data.name}</span></p>
                            </div>
                        ) : (
                            <div><p>No hay categoria asociada</p></div>
                        )}
                    <div className="border-solid border-b-2 border-black border-opacity-75 w-full"></div>
                        {collection?.photos ? (
                            <div className="flex flex-col gap-10">
                                <div className="flex flex-col justify-start w-full gap-7">
                                    <div className="flex flex-col gap-1">
                                        <h1 className="text-lg font-bold">{collection.photos[activeIndex].title}</h1>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p>{collection.photos[activeIndex].description}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-start w-full gap-5">
                                    <p className="text-base flex gap-3 items-center"><i className="fa-regular fa-heart"></i>{collection.photos[activeIndex].likes_count} <span>Likes</span></p>
                                    <p className="text-base flex gap-3 items-center"><i className="fa-regular fa-comment"></i>{collection.photos[activeIndex].comments_count}<span>Comentarios</span></p>
                                    <p className="text-base flex gap-3 items-center"><i className="fa-regular fa-eye"></i>{collection.photos[activeIndex].view_count} <span>Vistas</span></p>
                                    <p className="text-base flex gap-3 items-center"><i className="fa-solid fa-calendar-days"></i><DateFormatter isoDate={collection.photos[activeIndex]?.created_at} /></p>
                                </div>
                                {collection.photos[activeIndex]?.exif_data ? (
                                    <div className="flex flex-col justify-start w-full gap-5">
                                        <div className="flex justify-start items-center">
                                            <p className="text-base flex gap-3 items-center"><span className="font-bold"><i className="fa-solid fa-camera"></i> Camara:</span> {collection.photos[activeIndex].exif_data?.camera || 'No proporcionado'}</p>
                                        </div>
                                        <div className="flex justify-start items-center">
                                            <p className="text-base flex items-center"><span className="font-bold"><i className="fa-brands fa-files-pinwheel"></i> Lente:</span> {collection.photos[activeIndex].exif_data?.lens || 'No proporcionado'}</p>
                                        </div>
                                        <div className="flex justify-start items-center">
                                            <p className="text-base flex gap-1 items-center"><img width="16" height="16" src="https://img.icons8.com/material-outlined/24/aperture.png" alt="aperture"/><span className="font-bold"> Apertura:</span> {collection.photos[activeIndex].exif_data?.camera || 'No proporcionado'}</p>
                                        </div>
                                        <div className="flex justify-start items-center">
                                            <p className="text-base flex gap-1 items-center"><img width="16" height="16" src="https://img.icons8.com/material-outlined/24/focal-length.png" alt="focal-length"/><span className="font-bold"> Distancia focal:</span> {collection.photos[activeIndex].exif_data?.lens || 'No proporcionado'}</p>
                                        </div>
                                        <div className="flex justify-start items-center">
                                            <p className="text-base flex items-center"><span className="font-bold"><i className="fa-solid fa-gauge-high"></i> Velocidad de apertura:</span> {collection.photos[activeIndex].exif_data?.camera || 'No proporcionado'}</p>
                                        </div>
                                        <div className="flex justify-start items-center">
                                            <p className="text-base flex gap-1 items-center"><img width="16" height="16" src="https://img.icons8.com/material/24/iso.png" alt="iso"/><span className="font-bold"> ISO:</span> {collection.photos[activeIndex].exif_data?.lens || 'No proporcionado'}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p>No se proporciono exif data</p>
                                )}        
                                {collection.photos[activeIndex]?.tags_photo > 0 ? (
                                    <div className="flex flex-wrap w-full h-auto gap-2">
                                        {collection.photos[activeIndex]?.tags_photo.map((tag, index) => (    
                                            <div  key={index} className="flex justify-center items-center gap-2 p-2 w-auto h-auto rounded-md border-solid border-2 border-[#b5179e] text-[#b5179e]">
                                                <span className="w-full">{tag.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div>No se proporciono tags a esta fotografia</div>
                                )}
                            </div>
                        ) : (
                            <div>..cargando</div>
                        )}
                    <div className="border-solid border-b-2 border-black border-opacity-75 w-full"></div>
                    {collection?.user ? (
                        <>
                            <div className="flex justify-between w-full">
                                <div className="flex justify-center items-center gap-3">
                                    <div className="flex">
                                        <img className="object-cover w-10 h-10 rounded-full" src={collection.user?.profile.profile_image_url} alt="profile photo" />                                    </div>
                                    <div>
                                        <Link to={'/perfil/'+collection.user?.id} className="font-medium">{collection.user?.username}</Link>
                                        <p>{collection.user?.followers_count} {collection.user?.followers_count > 1 ? <span>Seguidores</span> : <span>Seguidor</span> }</p>
                                    </div>
                                </div>
                                <ButtonFollower followedId={collection.user?.id} />
                            </div>
                            <NewComment collectionId={collection.id} />
                        </>
                    ) : (
                        <div>..cargandoo</div>
                    )}
                    
                </div>
                </>
            ) : (
                <div>Cargando datos del usuario...</div>
            )}
            
        </div>
    )
}

ShowCollection.propTypes = {
    id : PropTypes.number,
}