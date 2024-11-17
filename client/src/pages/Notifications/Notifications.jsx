import { useEffect, useState } from "react"
import axiosApi from '../../services/axiosApi'
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
    return (
        <div>
            <ul className="notification-list">
                {notifications.map(notification => (
                <li
                    key={notification.id}
                    className={`notification-item ${notification.is_read ? 'read' : 'unread'}`}
                >
                    {notification.message}
                </li>
                ))}
            </ul>
        </div>
    )
}
