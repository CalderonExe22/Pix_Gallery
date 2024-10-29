import { Link } from "react-router-dom";
import Search from '../Search/Search'
import style from './Navbar.module.css'
import { useSelector } from "react-redux";
import { privateRoutes } from "../../constant/privateRoutes";
import { publicRoutes } from "../../constant/publicRoutes";
import Logout from "../Logout/Logout";

export default function Navbar() {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
    const user = 75

    const renderRoutes = (isProtected) => (
        isProtected ? (
            privateRoutes.filter(isProtected ? privateRoute => privateRoute.path !== '/create-portafolio' : privateRoute => privateRoute.path !== '/portafolio').map((privateRoute) => (
                <li key={privateRoute.name}>
                    <Link className={style.links} to={privateRoute.path === '/Portafolio' ? privateRoute.path+`/${user}` : privateRoute.path}>{privateRoute.name}</Link>
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
                                <i className="fa-solid fa-bell text-2xl"></i>
                            </Link>
                        </li>
                        <li>
                            <Link>
                                <i className="fa-solid fa-heart text-2xl"></i>
                            </Link>
                        </li>
                        <li>
                            <Link>
                                <i className="fa-solid fa-user text-2xl"></i>
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