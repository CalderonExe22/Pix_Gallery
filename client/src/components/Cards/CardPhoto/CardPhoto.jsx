import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import LikeButton from "../../Likes/LikeButton";
import NewWishList from "../../Wishlist/NewWishList";
import DeleteButton from "../../DeleteButton/DeleteButton";
import PrivacyButton from "../../PrivacyButton/PrivacyButton";
import EditPhoto from "../../EditPhoto/EditPhoto";

export default function CardPhoto({data,show,gridRowEndOption, idUser}) {

    const navigate = useNavigate()

    const showPhoto = (idPhoto) => {
        navigate('/ver-foto/'+idPhoto)
        location.reload()
    }

    return (
        <div className={`relative group overflow-hidden rounded-xl shadow-lg cursor-pointer w-full h-full z-40`} style={{ gridRowEnd: gridRowEndOption ? `span ${Math.floor(Math.random() * 5) + 10}` : '' }} >
            <div className="absolute z-10 top-0 left-0 w-full flex items-center justify-start gap-2 px-5 pt-4">
                <div className="flex items-center gap-5 text-white ">
                    {data?.isPublic ===  false && (
                        <i className="fa-solid fa-lock"></i>
                    )}
                </div>
            </div>
            {show && (
                <div className="absolute z-10 top-0 left-0 w-full flex items-center justify-end gap-2 px-5 pt-4 transform -translate-y-full transition-all duration-300 group-hover:-translate-y-0">
                    
                    <div className="flex items-center gap-5 text-white ">
                        {data?.user?.id === idUser && (
                            <>
                                <EditPhoto photoData={data} />
                                <DeleteButton id={data?.id} />
                                <PrivacyButton id={data?.id} isPublic={data?.is_public} type={'photo'} />
                            </>
                        )}
                    </div>
                
                </div> 
            )}
            <div onClick={() => showPhoto(data?.id)} className="w-full h-full">
                <img className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-70" src={data?.image_url} alt={data?.title} />
                <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-50"></div>
            </div>
            <div className="absolute bottom-0 left-0 w-full flex items-center justify-between gap-2 px-5 pb-4 transform translate-y-full transition-all duration-300 group-hover:translate-y-0">
                <div className="flex justify-center items-center gap-3">
                    <img className="object-cover rounded-full cursor-pointer w-8 h-8" src={data?.user.profile?.profile_photo} alt="foto de perfil" />
                    <span className="text-sm font-semibold text-white">{data?.user?.username}</span>
                </div>
                <div className="flex items-center gap-5 text-white ">
                    <NewWishList id={data?.id} type="photo" />
                    <LikeButton id={data?.id} type="photo" />
                </div>
            </div>
        </div>
    )
}

CardPhoto.propTypes = {
    data: PropTypes.object,
    show: PropTypes.bool,
    gridRowEndOption : PropTypes.bool,
    idUser : PropTypes.number
}
