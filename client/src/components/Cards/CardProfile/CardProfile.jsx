import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export default function CardProfile({profile,gridRowEndOption}) {
    const navigate = useNavigate()
    const showProfile = (idProfile) => {
        navigate('/perfil/'+idProfile)
        location.reload()
    }
    return (
        <div onClick={() => showProfile(profile?.user.id)} className={`relative flex flex-col items-center group overflow-hidden rounded-xl shadow-xl cursor-pointer bg-gray-200 p-10 gap-5`} style={{ gridRowEnd: gridRowEndOption ? `span ${Math.floor(Math.random() * 5) + 10}` : '' }} >
            <img className='rounded-full w-[100px] h-[100px]' src={profile?.user?.profile?.profile_image_url} />
            <div className="flex flex-col justify-center items-center gap-10">
                {profile ? (
                    <>
                        <span className="font-semibold">@{profile?.user?.username}</span>
                        {/* Otros datos del usuario */}
                    </>
                ) : (
                    <div>Cargando datos del usuario...</div>
                )}
            </div>
        </div>
    )
}

CardProfile.propTypes = {
    profile: PropTypes.object,
    gridRowEndOption : PropTypes.bool,
    idUser : PropTypes.number
}
