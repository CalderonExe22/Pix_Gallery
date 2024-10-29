import { createContext, useContext, useEffect, useState } from "react";
import axiosApi from "../services/axiosApi";
import { useNavigate } from "react-router-dom";
import { PropTypes } from "prop-types";

const AuthContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState([])
    const navigate = useNavigate()
    useEffect(()=>{
        const accessToken = localStorage.getItem('accessToken')
        const refreshToken = localStorage.getItem('refreshToken')
        if(accessToken && refreshToken){
            setIsAuthenticated(true)
        }
    },[])

    const login = async (data) => {
        try {
            const response = await axiosApi.post('users/login/',{
                email: data.email,
                password: data.password
            }) 
            console.log(response)
            if(response.status === 200){
                setIsAuthenticated(true)
                setUser(response.data)
                localStorage.setItem('accessToken', response.data.tokens.access)
                localStorage.setItem('refreshToken', response.data.tokens.refresh)
                navigate('/')
            }
        } catch (error) {
            console.error('error en el login', error)
            return false
        }
        return true
    }
    const logout = async ()=>{
        try{
            const response = await axiosApi.post('users/logout/', {
                refresh: localStorage.getItem('refreshToken') // Si es necesario enviar el refreshToken
            })
            if(response.status === 205){
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                window.location.reload()
            }
        }catch(error){
            console.log('failed logout',error)
        }
    }
    return(
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

AuthProvider.propTypes={
    children : PropTypes.element.isRequired,
}

