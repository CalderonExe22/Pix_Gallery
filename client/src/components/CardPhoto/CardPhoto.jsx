import style from "./CardPhoto.module.css";
import PropTypes from "prop-types";

export default function CardPhoto({url,title,isLarge}) {
    return (
        <div className={`${style.containerPhoto} ${isLarge ? style.large : style.small}`}>
            <img src={url} alt={title} className={style.image} />
            {/*<div className={style.icons}>
                <i className="fa-regular fa-heart"></i>
                <i className="fa-solid fa-plus"></i>
                <i className="fa-solid fa-comment"></i>
            </div>*/}
        </div>
    )
}

CardPhoto.propTypes = {
    url: PropTypes.string,
    title: PropTypes.string,
    isLarge:PropTypes.bool
}