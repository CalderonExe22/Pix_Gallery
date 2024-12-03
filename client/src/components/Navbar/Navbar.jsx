import { Link, useLocation } from "react-router-dom";
import Search from '../Search/Search'
import style from './Navbar.module.css'
import { useSelector } from "react-redux";
import { privateRoutes } from "../../constant/privateRoutes";
import { publicRoutes } from "../../constant/publicRoutes";
import { useEffect, useState } from "react";
import axiosApi from "../../services/axiosApi";
import DropNotifications from "../DropNotifications/DropNotifications";
import DropProfile from "../DropProfile/DropProfile";
import logo from '../../assets/PG_N°1.svg'

export default function Navbar() {
    const location = useLocation()
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
    const [user, setUser] = useState(null) 
    const fetchUser = async () => {
        if(isAuthenticated){
            try {
                const response = await axiosApi.get('users/user/')
                if(response.data){
                    setUser(response.data)
                }
            } catch (error) {
                console.log(error)
            }
        }
    }
    useEffect(() => {
        fetchUser()
    },[isAuthenticated])
    const renderRoutes = (isProtected) => (
        isProtected ? (
            privateRoutes.map((privateRoute) => (
                <li key={privateRoute.name}>
                    <Link className={`${style.links} ${location.pathname === privateRoute.path ? style.active : ''}`} to={privateRoute.path}>{privateRoute.name}</Link>
                </li>
            ))
        ) : (
            publicRoutes.map((publicRoute) => (
                <li key={publicRoute.name}>
                    <Link className={`${style.links} ${location.pathname === publicRoute.path ? style.active : ''}`} to={publicRoute.path}>{publicRoute.name}</Link>
                </li>
            ))
        )
    );
    return (
        <nav className={style.navbar}> 
            <ul className={style.itemsNav}>
                <Link to={'/'} className={style.logo}>
                    <img src={logo} alt="logo-PixGallery" />
                </Link>
                {isAuthenticated ? renderRoutes(true) : renderRoutes(false)}
            </ul>
            <ul className={style.itemsNav}>
                <li>
                    <Search />
                </li>
                {isAuthenticated ? (
                    <>
                        <li>
                            <DropNotifications />
                        </li>
                        <li>
                            <Link  className={`${style.links_icons} ${location.pathname === '/wishlist' ? style.active : ''}`} to={'/wishlist'}>
                                <i aria-label="wishlist" className="fa-solid fa-star text-2xl"></i>
                            </Link>
                        </li>
                        <li>
                            <DropProfile image_profile={user?.profile?.profile_photo} idProfile={user?.id}/>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link className={`${style.links} ${location.pathname === '/auth/login' ? style.active : ''}`} to='/auth/login'>Login</Link>
                        </li>
                        <li>
                            <Link to='/auth/register' className={`${style.links} ${location.pathname === '/auth/register' ? style.active : ''}`}>Register</Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    )
}