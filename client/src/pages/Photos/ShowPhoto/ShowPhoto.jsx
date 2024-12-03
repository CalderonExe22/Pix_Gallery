import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosApi from "../../../services/axiosApi";
import LikeButton from "../../../components/Likes/LikeButton";
import NewComment from "../../../components/Comments/NewComment";
import ButtonFollower from "../../../components/ButtonFollower/ButtonFollower";
import NewWishList from "../../../components/Wishlist/NewWishList";
import PaymentPhoto from "../../../components/PaymentButton/PaymentPhoto";
import PropsTypes from 'prop-types';
import EditPhoto from "../../../components/EditPhoto/EditPhoto";
import DeleteButton from "../../../components/DeleteButton/DeleteButton";
import PrivacyButton from "../../../components/PrivacyButton/PrivacyButton";

export default function ShowPhoto() {
    const { id } = useParams();
    const [photo, setPhoto] = useState(null);
    const isMounted = useRef(false);
    const [user, setUser] = useState([]);
    console.log(photo)
    const getUserInfo = async () => {
        try {
            const response = await axiosApi.get('users/user/', { timeout: 5000 });
            setUser(response.data);
        } catch (error) {
            if (error.code === 'ECONNABORTED') {
                console.error("Request timed out while fetching user info");
            } else {
                console.error("Error al obtener el usuario", error);
            }
        }
    };

    function DateFormatter({ isoDate }) {
        const formattedDate = new Date(isoDate).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
        DateFormatter.propTypes = {
            isoDate: PropsTypes.string.isRequired,
        };
        return <span>{formattedDate}</span>;
    }

    const getViews = async () => {
        try {
            const response = await axiosApi.get('views/views/get_user_views/', { timeout: 5000 });
            const viewPhoto = response.data.some(view => view.photo === parseInt(id));
            if (!viewPhoto) {
                try {
                    await axiosApi.post('views/views/', { photo: id });
                } catch (error) {
                    console.log("Error al guardar el visto", error);
                }
            }
        } catch (error) {
            if (error.code === 'ECONNABORTED') {
                console.error("Request timed out while fetching views");
            } else {
                console.log("Error al obtener las vistas", error);
            }
        }
    };

    const fetchPhoto = async (id) => {
        try {
            const response = await axiosApi.get(`photos/photography/${id}/`, { timeout: 5000 });
            if (response.data) {
                setPhoto(response.data);
            }
        } catch (error) {
            if (error.code === 'ECONNABORTED') {
                console.error("Request timed out while fetching photo");
            } else {
                console.log("Error al obtener las Fotos", error);
            }
        }
    };

    useEffect(() => {
        if (isMounted.current) return;
        isMounted.current = true;
        getViews();
        getUserInfo();
        fetchPhoto(id);
    }, [id]);

    return (
        <div className="grid grid-cols-3 justify-center items-center w-full h-screen py-32">
            {photo && user ? (
                <>
                    <div className="flex col-span-2 justify-center items-center h-full w-full">
                        <img className="max-w-full max-h-full object-contain" src={photo.image_url} alt={photo.title} />
                    </div>
                    <div className="relative flex flex-col col-span-1 justify-start items-start w-full h-[900px] overflow-hidden overflow-y-auto px-10 gap-20 pb-10">
                        <div className="sticky top-0 left-0 bg-white flex justify-start gap-10 py-5 w-full">
                            <LikeButton type="photo" id={photo.id} showLike={false} />
                            <NewWishList type="photo" id={photo?.id} />
                            {photo?.user?.id !== user.id && <PaymentPhoto onPayment={photo} />}
                            { photo.user?.id === user.id && (
                                <>
                                    <EditPhoto photoData={photo} />
                                    <DeleteButton id={photo?.id} type="photo" />
                                    <PrivacyButton id={photo?.id} isPublic={photo?.is_public} type={'photo'} />
                                </>
                            )}
                        </div>
                        <div className="flex flex-col justify-start w-full gap-7">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-lg font-bold">{photo.title}</h1>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p>{photo.description}</p>
                            </div>
                        </div>
                        {photo?.category_data ? (
                            <div className="flex justify-start items-center">
                                <p>Categoria: <span className="font-bold">{photo?.category_data.name}</span></p>
                            </div>
                        ) : (
                            <div><p>No hay categoria asociada</p></div>
                        )}
                        <div className="flex flex-col justify-start w-full gap-5">
                            <p className="text-base flex gap-3 items-center"><i className="fa-regular fa-heart"></i>{photo.likes_count} <span>Likes</span></p>
                            <p className="text-base flex gap-3 items-center"><i className="fa-regular fa-comment"></i>{photo.comments_count}<span>Comentarios</span></p>
                            <p className="text-base flex gap-3 items-center"><i className="fa-regular fa-eye"></i>{photo.view_count} <span>Vistas</span></p>
                            <p className="text-base flex gap-3 items-center"><i className="fa-solid fa-calendar-days"></i><DateFormatter isoDate={photo.created_at} /></p>
                        </div>
                        <div className="flex justify-between w-full">
                            <div className="flex justify-center items-center gap-3">
                                <div className="flex w-10 h-10 rounded-full">
                                    <img className="object-cover w-full h-full" src={photo.user?.profile.profile_photo} alt="profile photo" />
                                </div>
                                <div>
                                    <Link to={'/perfil/' + photo.user?.id} className="font-medium">{photo.user?.username}</Link>
                                    <p>{photo.user?.followers_count} {photo.user?.followers_count > 1 ? <span>Seguidores</span> : <span>Seguidor</span>}</p>
                                </div>
                            </div>
                            <ButtonFollower followedId={photo.user?.id} />
                        </div>
                        {photo?.exif_data ? (
                            <div className="flex flex-col justify-start w-full gap-5">
                                <div className="flex justify-start items-center">
                                    <p className="text-base flex items-center"><span className="font-bold"><i className="fa-solid fa-camera"></i> Camara: </span> {photo.exif_data?.camera || ' No proporcionado'}</p>
                                </div>
                                <div className="flex justify-start items-center">
                                    <p className="text-base flex items-center"><span className="font-bold"><i className="fa-brands fa-files-pinwheel"></i> Lente: </span> {photo.exif_data?.lens || ' No proporcionado'}</p>
                                </div>
                                <div className="flex justify-start items-center">
                                    <p className="text-base flex gap-1 items-center"><img width="16" height="16" src="https://img.icons8.com/material-outlined/24/aperture.png" alt="aperture"/><span className="font-bold"> Apertura:</span> {photo.exif_data?.camera || 'No proporcionado'}</p>
                                </div>
                                <div className="flex justify-start items-center">
                                    <p className="text-base flex gap-1 items-center"><img width="16" height="16" src="https://img.icons8.com/material-outlined/24/focal-length.png" alt="focal-length"/><span className="font-bold"> Distancia focal:</span> {photo.exif_data?.lens || 'No proporcionado'}</p>
                                </div>
                                <div className="flex justify-start items-center">
                                    <p className="text-base flex items-center"><span className="font-bold"><i className="fa-solid fa-gauge-high"></i> Velocidad de apertura: </span> {photo.exif_data?.camera || ' No proporcionado'}</p>
                                </div>
                                <div className="flex justify-start items-center">
                                    <p className="text-base flex gap-1 items-center"><img width="16" height="16" src="https://img.icons8.com/material/24/iso.png" alt="iso"/><span className="font-bold"> ISO:</span> {photo.exif_data?.lens || 'No proporcionado'}</p>
                                </div>
                            </div>
                        ) : (
                            <p>No se proporciono exif data</p>
                        )}
                        {photo?.tags_photo.length > 0 ? (
                            <div className="flex flex-wrap w-full h-auto gap-2">
                                {photo?.tags_photo.map((tag, index) => (
                                    <div key={index} className="flex justify-center items-center gap-2 p-2 w-auto h-auto rounded-md border-solid border-2 border-black">
                                        <span className="w-full">{tag.name}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div>No se proporciono tags a esta fotografia</div>
                        )}
                        <NewComment photoId={photo.id} />
                    </div>
                </>
            ) : (
                <div>Cargando datos del usuario...</div>
            )}
        </div>
    );
}