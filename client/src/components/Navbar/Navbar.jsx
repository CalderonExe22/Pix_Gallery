import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosApi from "../../services/axiosApi";
import Search from '../Search/Search'
import style from './Navbar.module.css'

export default function Navbar() {
    const [userMenus, setUserMenus] = useState([])
    const [IsAutenticated, setIsAutenticated] = useState(false)
    const [user, setUser] = useState([])
    
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

    const userInfo = async () => {
        try {
            const response = await axiosApi.get('users/user/')
            setUser(response.data)
        } catch (error) {
            console.error(error)
        }
    }
    
    useEffect(()=>{
        const fetchMenu = async () => {
            try {
                const tokenAccess = localStorage.getItem('accessToken')
                if(tokenAccess){
                    const response = await axiosApi.get('menus/authenticated-menu/')
                    setUserMenus(response.data)
                    setIsAutenticated(true)
                }else{
                    const response = await axiosApi.get('menus/public-menu/ ')
                    setUserMenus(response.data)
                }
            } catch (error) {
                console.log('error al cargar el menu', error)
            }
        }
        fetchMenu()
        userInfo()
    },[]) 
    console.log(user)
    return (
        <nav className={style.navbar}> 
            <ul className={style.itemsNav}>
                <li className={style.logo}>
                    <h1>PG</h1>
                </li>
                {userMenus.map((menu) => (
                    <li key={menu.name}><Link className={style.links} to={menu.url}>{menu.name}</Link></li>
                ))}
                {user.has_portafolio ? (
                    <li>
                        <Link className={style.links} to={`/portafolio/${user.portafolio_id}`} >Portafolio</Link>
                    </li>
                ):(
                    <li>
                        <Link className={style.links} to='/create-portafolio' >Portafolio</Link>
                    </li>
                )}
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
                        <Link>
                            <i className="fa-solid fa-heart text-2xl"></i>
                        </Link>
                    </li>
                    <li>
                        <Link>
                            <i className="fa-solid fa-user text-2xl"></i>
                        </Link>
                    </li>
                    <li>
                        <button onClick={handleLogout}>Logout</button>
                    </li>
                    </>
                ):(
                    <>
                    <li>
                        <Link to='/login'>Sing in</Link>
                    </li>
                    <li>
                        <Link to='/register'>Sing up</Link>
                    </li>
                    </>
                )}
            </ul>
        </nav>
    )
}
