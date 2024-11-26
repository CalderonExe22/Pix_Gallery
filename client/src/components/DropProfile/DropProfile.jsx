import PropTypes from "prop-types";
import { useRef, useState, useEffect } from "react";
import Logout from '../Logout/Logout'
import { Link, useNavigate } from "react-router-dom";

export default function DropProfile({image_profile, idProfile}) {
    const [isOpen, setIsOpen ]= useState(false)
    const dropdownRef = useRef(null)
    const navigate = useNavigate()

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
        <div className="relative" ref={dropdownRef}>
            <div className="flex justify-center items-center gap-3 w-8 h-8">
                <img onClick={handleProfile} className="object-cover rounded-full cursor-pointer" src={image_profile} alt="foto de perfil" />
                <button onClick={() => toggleDropdown()}>
                    <i className={`fa-solid fa-chevron-up transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
                </button>
            </div>
            <div className={`absolute right-0 mt-2 w-[250px] bg-white border rounded-md shadow-lg z-10 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                <div className="flex flex-col gap-4 max-h-60 overflow-y-auto">
                    <ul className="flex flex-col gap-4 w-full">
                        <li className="w-full p-3 ">
                            <Link to="/manage-account/purchase-history/">Historial de Compras</Link>
                        </li>
                        <li className="w-full p-3 ">
                            <Link to="/manage-account/sale-history/">Historial de Ventas</Link>
                        </li>
                        <Logout />
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