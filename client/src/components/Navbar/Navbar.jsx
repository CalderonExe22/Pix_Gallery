import { Link } from "react-router-dom";
import Search from '../Search/Search'
import style from './Navbar.module.css'
import { useSelector } from "react-redux";
import { privateRoutes } from "../../constant/privateRoutes";
import { publicRoutes } from "../../constant/publicRoutes";
import Logout from "../Logout/Logout";
import { useEffect, useState } from "react";
import axiosApi from "../../services/axiosApi";

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
                            <Link>
                                <i className="fa-solid fa-bell text-xl"></i>
                            </Link>
                        </li>
                        <li>
                            <Link>
                                <i className="fa-solid fa-heart text-xl"></i>
                            </Link>
                        </li>
                        <li>
                            <Link to={'/perfil/'+user?.id}>
                                <i className="fa-solid fa-user text-xl"></i>
                            </Link>
                        </li>
                        <Logout style={style.links} />
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