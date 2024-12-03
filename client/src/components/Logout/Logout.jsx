import { useDispatch } from "react-redux"
import { logoutUser } from "../../features/auth/authThunk"
import { useNavigate } from "react-router-dom"
import { PropTypes } from "prop-types";

export default function Logout({style}) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleLogout = async () => {
        const response = await dispatch(logoutUser())
        if(response){
            navigate('/')
            window.location.reload();
        }
    }
    return (
        <li className="p-3">
            <button onClick={handleLogout} className={style}>Cerrar sesion</button>
        </li>
    )
}

Logout.propTypes = {
    style : PropTypes.string
}