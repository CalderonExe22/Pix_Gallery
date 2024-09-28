import axios from 'axios'
import dayjs from 'dayjs'
import { jwtDecode } from "jwt-decode"

const axiosApi = axios.create({
    baseURL : 'http://127.0.0.1:8000/api/',
    timeout: 5000, // Tiempo máximo de espera para una solicitud
    headers: {
    'Content-Type': 'application/json',  // Tipo de contenido predeterminado
    }
})

const refreshToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken')
        if(refreshToken){
            const response = await axios.post('http://127.0.0.1:8000/api/users/token/refresh/',{
                refresh : refreshToken
            })
            localStorage.setItem('accessToken',response.data.access)
            return response.data.access
        }
    } catch (error) {
        console.log('Error al refrescar el token:',error)
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        location.href = '/login'
    }
}

const getAccessToken = async () => {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) return null
    const accessTokenDecoded = jwtDecode(accessToken)
    const IsExpired = dayjs.unix(accessTokenDecoded.exp).diff(dayjs()) < 1
    if(IsExpired){
        try {
            const newTokenAccess = await refreshToken()
            return newTokenAccess ? newTokenAccess : null
        } catch (error) {
            console.log('error al actualizar token de acceso:', error)
        }
    }
    return accessToken
}

axiosApi.interceptors.request.use(
    async config => {
        const accessToken = await getAccessToken()
        if(accessToken){
            config.headers.Authorization = `Bearer ${accessToken}` 
        }
        return config
    },
    error => Promise.reject(error)
)

export default axiosApi