import { Link } from "react-router-dom";
import Search from '../Search/Search'
import style from './Navbar.module.css'
import { useSelector } from "react-redux";
import { privateRoutes } from "../../constant/privateRoutes";
import { publicRoutes } from "../../constant/publicRoutes";
import { useEffect, useState } from "react";
import axiosApi from "../../services/axiosApi";
import DropNotifications from "../DropNotifications/DropNotifications";
import DropProfile from "../DropProfile/DropProfile";

export default function Navbar() {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
    const [user, setUser] = useState(null) 
    const fetchUser = async () => {
        try {
            const response = await axiosApi.get('users/user/')
            if(response.data){
                setUser(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchUser()
    },[])
    const renderRoutes = (isProtected) => (
        isProtected ? (
            privateRoutes.map((privateRoute) => (
                <li key={privateRoute.name}>
                    <Link className={style.links} to={privateRoute.path}>{privateRoute.name}</Link>
                </li>
            ))
        ) : (
            publicRoutes.map((publicRoute) => (
                <li key={publicRoute.name}>
                    <Link className={style.links} to={publicRoute.path}>{publicRoute.name}</Link>
                </li>
            ))
        )
    );
    return (
        <nav className={style.navbar}> 
            <ul className={style.itemsNav}>
                <li className={style.logo}>
                    <h1>PG</h1>
                </li>
                {isAuthenticated ? renderRoutes(true) : renderRoutes(false)}
            </ul>
            <ul className={style.itemsNav}>
                <li>
                    <Search className={style.links} />
                </li>
                {isAuthenticated ? (
                    <>
                        <li>
                            <DropNotifications />
                        </li>
                        <li>
                            <Link to={'/wishlist'}>
                                <i className="fa-solid fa-star text-2xl"></i>
                            </Link>
                        </li>
                        <li>
                            <DropProfile image_profile={user?.profile?.profile_photo} idProfile={user?.id}/>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link to='/login' className={style.links}>Login</Link>
                        </li>
                        <li>
                            <Link to='/register' className={style.links}>Register</Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    )
}