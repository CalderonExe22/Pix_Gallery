import { useEffect, useState } from "react"
import axiosApi from '../../services/axiosApi'
import { Link } from "react-router-dom"
export default function Notifications() {
    const [notifications, setNotifications] = useState([])
    //const [readCount, setReadCount] = useState(0)
    const fetchNotificationsUser = async () => {
        try {
            const response = await axiosApi.get('notifications/notifications/')
            if(response.data){
                setNotifications(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
        fetchNotificationsUser()
    },[])
    console.log(notifications)
    return (
        <div>
            <ul className="notification-list">
                {notifications.map(notification => (
                <li key={notification.id} className={`notification-item ${notification.is_read ? 'read' : 'unread'}`}>
                    {notification.collection !== null ? (
                        <Link to={'/ver-collecion/'+notification.collection.id}>{notification.message}</Link>
                    ):(
                        <Link to={'/ver-foto/'+notification.collection.id}>{notification.message}</Link>
                    )}
                </li>
                ))}
            </ul>
        </div>
    )
}
