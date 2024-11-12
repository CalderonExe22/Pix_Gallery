import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
export default function CardPhoto({id,url, title, width = 300, height = 350}) {
    const navigate = useNavigate()
    const showPhoto = (idPhoto) => {
        navigate('/ver-foto/'+idPhoto)
        location.reload()
    }
    return (
        <div onClick={() => showPhoto(id)} className="relative group overflow-hidden rounded-xl shadow-lg cursor-pointer"
        style={{ width: `${width}px`, height: `${height}px` }}
        >
            <img className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-70" src={url} alt={title} />
            <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-full flex items-center justify-center gap-2 pb-4 transform translate-y-full transition-all duration-300 group-hover:translate-y-0">
                <span className="text-xs">{title}</span>
                <button><i className="fa-solid fa-heart"></i></button>
            </div>
        </div>
    )
}

CardPhoto.propTypes = {
    id:PropTypes.number,
    url: PropTypes.string,
    title: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number
}
