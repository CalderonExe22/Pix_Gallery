import PropTypes from "prop-types";
import { useRef, useState, useEffect } from "react";
import Logout from '../Logout/Logout'
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Tooltip } from "flowbite-react";

export default function DropProfile({image_profile, idProfile}) {
    const [isOpen, setIsOpen ]= useState(false)
    const dropdownRef = useRef(null)
    const navigate = useNavigate()
    const location = useLocation()
    console.log(location.pathname === '/perfil/'+idProfile+'')
    const toggleDropdown = () => setIsOpen(!isOpen)

    const handleClickOutside = (e) => {
        if(dropdownRef.current && !dropdownRef.current.contains(e.target)){
            setIsOpen(false)
        }
    }
    const handleProfile = () => {
        navigate('/perfil/'+idProfile)
    }
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])
    return (
        <div className="relative p-2" ref={dropdownRef}>
            <Tooltip content='Perfil' style="dark" placement="bottom">
                <div className="flex justify-center items-center gap-3 ">
                    <img onClick={handleProfile} className={`object-cover w-9 h-9 rounded-full cursor-pointer transform transition-all duration-100 ${location.pathname === '/perfil/'+idProfile+'' ? 'border-solid border-2 p-1 border-[#fff]' : '' }`} src={image_profile} alt="foto de perfil" />
                    <button className="p-2 rounded-full transition-colors duration-300 text-white hover:text-[#3a0ca3] hover:bg-white" onClick={() => toggleDropdown()}>
                        <i className={`fa-solid fa-chevron-up transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
                    </button>
                </div>
            </Tooltip>
            <div className={`absolute right-0 mt-2 w-[250px] bg-white border rounded-md shadow-lg z-10 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                <div className="flex flex-col gap-4 max-h-60 overflow-y-auto">
                    <ul className="flex flex-col justify-center items-center text-center gap-4 w-full p-5">
                        <li className="w-full p-3 transition-colors hover:text-white hover:bg-[#3a0ca3]">
                            <Link to={"/manage-account/editar-perfil/"+idProfile}>Editar perfil</Link>
                        </li>
                        <li className="w-full p-3 transition-colors hover:text-white hover:bg-[#3a0ca3]">
                            <Link to="/manage-account/purchase-history/">Historial de Compras</Link>
                        </li>
                        <li className="w-full p-3 transition-colors hover:text-white hover:bg-[#3a0ca3]">
                            <Link to="/manage-account/sale-history/">Historial de Ventas</Link>
                        </li>
                        <Logout style={'w-full p-3 transition-colors hover:text-white hover:bg-[#3a0ca3]'}/>
                    </ul>
                </div>
            </div>
        </div>
    )
}

DropProfile.propTypes = {
    image_profile:PropTypes.string,
    idProfile: PropTypes.number
}