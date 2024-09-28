import { useEffect, useState } from "react";
import { Link} from "react-router-dom";
import axiosApi from "../../services/axiosApi";
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
        <nav>
            <ul className="flex gap-12">
                {userMenus.map((userMenu) => (
                    <li key={userMenu.name}><Link to={userMenu.url}>{userMenu.name}</Link></li>
                ))}
            </ul>
        </nav>
    )
}
