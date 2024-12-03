import { Link, useLocation } from 'react-router-dom'
import logo from '../../assets/PG_N°1.svg'
import { useSelector } from 'react-redux'
import { privateRoutes } from "../../constant/privateRoutes";
import { publicRoutes } from "../../constant/publicRoutes";
import style from './Footer.module.css'

export default function Footer() {
    const location = useLocation()
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
    const renderRoutes = (isProtected) => (
        isProtected ? (
            privateRoutes.map((privateRoute) => (
                <div key={privateRoute.name}>
                    <Link className={`${style.links} ${location.pathname === privateRoute.path ? style.active : ''}`} to={privateRoute.path}>{privateRoute.name}</Link>
                </div>
            ))
        ) : (
            publicRoutes.map((publicRoute) => (
                <div key={publicRoute.name}>
                    <Link className={`${style.links} ${location.pathname === publicRoute.path ? style.active : ''}`} to={publicRoute.path}>{publicRoute.name}</Link>
                </div>
            ))
        )
    )
    return (
        <footer className="flex flex-col justify-center items-center w-full gap-10 p-10 mt-48 py-5 bg-[#3a0ca3] text-white">
            <div className='flex flex-col w-24 h-24'>
                <img src={logo} alt="logo-PixGallery" />
            </div>
            <div className='flex flex-col w-1/2 h-auto text-center font-medium'>
                <p>
                    Nuestro sitio PixGallery está enfocado principalmente en ofrecer a los usuarios una plataforma donde puedan subir, explorar, 
                    promocionar y vender trabajos fotográficos de manera fácil e intuitiva.
                </p>
            </div>
            <div className='flex justify-center gap-10 w-full h-auto'>
                <i className="fa-brands fa-facebook text-4xl"></i>
                <i className="fa-brands fa-square-instagram text-4xl"></i>
                <i className="fa-brands fa-youtube text-4xl"></i>
                <i className="fa-brands fa-x-twitter text-4xl"></i>
            </div>
            <div className='flex justify-center gap-10 w-full h-auto'>
                {isAuthenticated ? renderRoutes(true) : renderRoutes(false)}    
            </div>
            <div className='flex justify-center items-center w-full font-medium bg-white text-[#3a0ca3] p-3'>
                <p className='font-semibold text-lg'>Design by - Exequiel Calderon Fai-4432 || Jonathan Alveal Fai-3581</p>
            </div>
        </footer>
    )
}
