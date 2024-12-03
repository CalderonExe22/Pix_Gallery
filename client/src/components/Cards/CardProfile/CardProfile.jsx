import PropTypes from "prop-types";
import ButtonFollower from "../../ButtonFollower/ButtonFollower";
import { useNavigate } from "react-router-dom";

export default function CardProfile({profile,gridRowEndOption}) {
    const id = localStorage.getItem('userId')
    const navigate = useNavigate()
    const showProfile = (idProfile) => {
        navigate('/perfil/'+idProfile)
        location.reload()
    }
    console.log(profile)
    return (
        <div onClick={() => showProfile(profile?.user.id)} className={`relative flex flex-col items-center group overflow-hidden rounded-xl shadow-xl cursor-pointer bg-gray-200 p-10`} style={{ gridRowEnd: gridRowEndOption ? `span ${Math.floor(Math.random() * 5) + 10}` : '' }} >
            <img className='rounded-full w-[100px] h-[100px]' src={profile?.user?.profile?.profile_photo} />
            <div className="flex flex-col justify-center items-center gap-3">
                {profile ? (
                    <>
                        <span className="font-semibold">@{profile?.user?.username}</span>
                        <span className="font-semibold">{profile?.user?.email}</span>
                        {/* Otros datos del usuario */}
                    </>
                ) : (
                    <div>Cargando datos del usuario...</div>
                )}
            </div>
            {profile?.user?.id === parseInt(id) ? (
                <div className="flex justify-center items-center rounded-sm">
                    <a className="bg-[#b5179e] text-white p-2 cursor-pointer w-32 text-center" href={"/manage-account/editar-perfil/"+profile?.user?.id}>Editar perfil</a>
                </div>
            ):(
                <ButtonFollower followedId={parseInt(id)} />
            )}
        </div>
    )
}

CardProfile.propTypes = {
    profile: PropTypes.object,
    gridRowEndOption : PropTypes.bool,
    idUser : PropTypes.number
}
