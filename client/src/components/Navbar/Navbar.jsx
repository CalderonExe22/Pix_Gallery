import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosApi from '../../services/axiosApi';
import Search from '../Search/Search';
import style from './Navbar.module.css';

export default function Navbar() {

    const [IsAutenticated, setIsAutenticated] = useState(false);

    const [user, setUser] = useState([]);

    useEffect(() => {
        
        const userInfo = async () => {
            try {
                const response = await axiosApi.get('users/user/')
                setUser(response.data)
            } catch (error) {
                console.error(error)
            }
        }
        const accessToken = localStorage.getItem('accessToken');
        accessToken ? setIsAutenticated(true) : setIsAutenticated(false);
        accessToken && userInfo();
    }, [IsAutenticated])

    const menuPublic = [
        {name: 'Home', url: '/'},
    ]

    const menuAutenticated = [
        {name: 'Home', url: '/'},
        {name: 'Create', url: '/subir_photo'},
        (user.has_portafolio ? {name: 'Portafolio', url: '/portafolio/' + user.portafolio_id} : {name: 'Portafolio', url: '/create-portafolio'}),
    ]

    const handleLogout = async ()=>{
        try{
            const response = await axiosApi.post('users/logout/', {
                refresh: localStorage.getItem('refreshToken') // Si es necesario enviar el refreshToken
            })
            console.log(response.status)
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            console.log('Logout exitoso')
            window.location.reload()
        }catch(error){
            console.log('failed logout',error)
        }
    }

    return (
        <nav className={style.navbar}> 
            <ul className={style.itemsNav}>
                <li className={style.logo}>
                    <h1>PG</h1>
                </li>
                {(IsAutenticated ? menuAutenticated : menuPublic).map((menu) => (
                    <li key={menu.name}><Link className={style.links} to={menu.url}>{menu.name}</Link></li>
                ))}
            </ul>
            <ul className={style.itemsNav}>
                <li>
                    <Search className={style.links} />
                </li>
                {IsAutenticated ? (
                    <>
                        <li>
                            <Link>
                                <i className="fa-solid fa-bell text-2xl"></i>
                            </Link>
                        </li>
                        <li>
                            <Link to="/wishlist">
                                <i className="fa-solid fa-heart text-2xl"></i>
                            </Link>
                        </li>
                        <li>
                            <Link to="/Perfil">
                                <i className="fa-solid fa-user text-2xl"></i>
                            </Link>
                        </li>
                        <li>
                            <button onClick={handleLogout} className={style.links}>Logout</button>
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