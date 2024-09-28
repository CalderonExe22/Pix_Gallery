import { useEffect } from 'react'
import { useState } from 'react'
import axiosApi from '../../services/axiosApi'
export default function Home() {
    const [username, setUserName] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(()=>{
        const checkLoggedInUser = async () =>{
            try{
                const token = localStorage.getItem('accessToken')
                if(token) {
                    const response = await axiosApi.get('users/user/')
                    setIsLoggedIn(true)
                    setUserName(response.data.username)
                }else{
                    setIsLoggedIn(false)
                    setUserName('')
                }
            }catch(error){
                setIsLoggedIn(false)
                setUserName('')
                console.log(error)
            }
        }
        checkLoggedInUser()
    },[])

    const handleLogout = async ()=>{
        try{
            const response = await axiosApi.post('users/logout/', {
                refresh: localStorage.getItem('refreshToken') // Si es necesario enviar el refreshToken
            })
            console.log(response.status)
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            console.log('Logout exitoso')
            setIsLoggedIn(false)
            setUserName('')
            window.location.reload()
        }catch(error){
            console.log('failed logout',error)
        }
    }

    return (
        <div>
        {isLoggedIn ? (
        <>
        <h1>Hola, {username}. Gracias por logearte</h1>
        <button onClick={handleLogout}>Logout</button>
        </>
        ):(
        <h1>Hola, logeate primero</h1>
        )}
        </div>
    )
}
