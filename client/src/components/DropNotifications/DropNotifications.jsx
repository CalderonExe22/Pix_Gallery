import { useEffect, useRef, useState } from "react";
import axiosApi from "../../services/axiosApi";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { Tooltip } from "flowbite-react";

export default function DropNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null)
    const navigate = useNavigate()
    
    const toggleDropdown = () => setIsOpen(!isOpen);

    const fetchNotificationsUser = async () => {
        try {
            const response = await axiosApi.get('notifications/notifications/');
            if (response.data) {
                setNotifications(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Marcar una notificación como leída
    const markAsRead = async (id) => {
        try {
            await axiosApi.post(`notifications/notifications/${id}/mark_as_read/`);
            // Actualizamos la lista de notificaciones para reflejar el cambio
            setNotifications((prevNotifications) =>
                prevNotifications.map((notification) =>
                    notification.id === id
                        ? { ...notification, is_read: true }
                        : notification
                )
            );
        } catch (error) {
            console.log(error);
        }
    };

    // Marcar todas las notificaciones como leídas
    const markAllAsRead = async () => {
        try {
            await axiosApi.post('notifications/notifications/mark_all_as_read/');
            setNotifications((prevNotifications) =>
                prevNotifications.map((notification) => ({
                    ...notification,
                    is_read: true
                }))
            );
        } catch (error) {
            console.log(error);
        }
    }

    const handleNotificationsClick = (notification) => {
        markAsRead(notification?.id)
        if(notification.collection !== null){
            navigate('/ver-coleccion/'+notification.collection?.id)
        }else{
            navigate('/ver-foto/'+notification.photography?.id)
        }
    }

    const handleClickOutside = (e) => {
        if(dropdownRef.current && !dropdownRef.current.contains(e.target)){
            setIsOpen(false)
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [])

    useEffect(() => {
        fetchNotificationsUser()
    }, [])

    console.log(notifications)

    return (
        <div className="relative w-auto" ref={dropdownRef}>
            <Tooltip style="dark" placement="bottom" content='Notificaciones'>
                <button className="w-10 h-10 rounded-full transition-colors duration-300 text-white hover:text-[#3a0ca3] hover:bg-[#fff]" onClick={toggleDropdown}>
                    <i className="fa-solid fa-bell text-2xl"></i>
                    {notifications.filter((notification) => !notification.is_read).length > 0 && (
                        <span className="absolute top-0 right-0 text-sm bg-[#3a0ca3] text-white rounded-full px-1">
                            {notifications.filter((notification) => !notification.is_read).length}
                        </span>
                    )}
                </button>
            </Tooltip>
            <div className={`absolute flex flex-col gap-5 px-10 right-0 mt-2 w-auto bg-white border rounded-md shadow-lg z-10 py-2 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                <div className="flex flex-col gap-10 max-h-60 w-full overflow-y-auto">
                    {notifications.map((notification) => (
                        <div onClick={() => handleNotificationsClick(notification)} className="flex justify-between items-center h-full w-full gap-5 p-2 cursor-pointer transition-colors hover:bg-gray-300" key={notification.id}>
                            <div className="w-16 h-20">
                                {notification.collection !== null ? (
                                    <img className="object-cover w-full h-full" src={notification.collection.photos[0]?.image_url} alt={notification.collection?.name}/>
                                ):(
                                    <img className="object-cover w-full h-full" src={notification.photography?.image_url} alt={notification.photography?.name}/>
                                )}
                            </div>
                            <div className="flex flex-col gap-2 w-[250px]">
                                {notification.is_read ? (
                                    <>
                                        <span className="font-normal">{notification.message}</span>
                                        <span className="text-sm w-full">
                                            {formatDistanceToNow(new Date(notification.created_at), {
                                                addSuffix: true,
                                                locale: es, // Para español
                                            })}
                                        </span>
                                    </>
                                ):(
                                    <>
                                        <span className="font-bold">{notification.message}</span>
                                        <span className="text-sm w-full">
                                            {formatDistanceToNow(new Date(notification.created_at), {
                                                addSuffix: true,
                                                locale: es, 
                                            })}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={markAllAsRead} className="w-full py-2 border-solid border-black border-t-2 text-center rounded-b-md transition-colors duration-300 hover:bg-[#3a0ca3] hover:text-white">
                    Marcar todo como leído
                </button>
            </div>
        </div>
    );
}