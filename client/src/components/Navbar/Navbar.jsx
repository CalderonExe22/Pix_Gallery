import { useEffect, useState } from "react";
import { Link} from "react-router-dom";
import axiosApi from "../../services/axiosApi";
import Search from '../Search/Search'
import style from './Navbar.module.css'

export default function Navbar() {

    const [userMenus, setUserMenus] = useState([])

    useEffect(()=>{
        const fetchMenu = async () => {
            try {
                const tokenAccess = localStorage.getItem('accessToken')
                if(tokenAccess){
                    const response = await axiosApi.get('menus/authenticated-menu/')
                    setUserMenus(response.data)
                }else{
                    const response = await axiosApi.get('menus/public-menu/ ')
                    setUserMenus(response.data)
                }
            } catch (error) {
                console.log('error al cargar el menu', error)
            }
        }
        fetchMenu()
    },[]) 
    
    return (
        <nav className={style.navbar}>
            <div className={style.logo}>
                <h1>
                    PixGallery
                </h1>
            </div>
            <Search />
            <ul className={style.itemsNav}>
                {userMenus.map((userMenu) => (
                    <li key={userMenu.name}><Link to={userMenu.url}>{userMenu.name}</Link></li>
                ))}
            </ul>
        </nav>
    )
}
