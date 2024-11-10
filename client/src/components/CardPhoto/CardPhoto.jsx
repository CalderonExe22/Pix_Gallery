import style from "./CardPhoto.module.css";
import PropTypes from "prop-types";
import PaymentButton from '../PaymentButton/PaymentButton';
import { useNavigate } from "react-router-dom";

export default function CardPhoto({ url, photo, isLarge }) {

    const navigate = useNavigate();

    const handleMoreInfo = () => {
        navigate(`/ver-foto/${photo.id}`);
    }

    return (
        <div className={`${style.containerPhoto} ${isLarge ? style.large : style.small}`}>
            <img src={url} alt={photo.title} className={style.image} />
            {/*<div className={style.icons}>
                <i className="fa-regular fa-heart"></i>
                <i className="fa-solid fa-plus"></i>
                <i className="fa-solid fa-comment"></i>
            </div>*/}
            <div className={style.moreInfo}>
                <button onClick={handleMoreInfo} className="text-white py-2 px-4 rounded bg-blue-500">Más Info</button>
            </div>
            <div className={style.payment}>
                <PaymentButton onPayment={photo} />
            </div>
        </div>
    )
}

CardPhoto.propTypes = {
    url: PropTypes.string,
    title: PropTypes.string,
    isLarge: PropTypes.bool,
    photo: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string,
        image: PropTypes.string.isRequired,
        price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }).isRequired,
}