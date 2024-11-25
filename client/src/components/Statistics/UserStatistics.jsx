import { useEffect, useState } from "react"
import axiosApi from "../../services/axiosApi"
import PropTypes from 'prop-types'

export default function UserStatistics({ userId }) {
    const [statistics, setStatistics] = useState(null)
    const [error, setError] = useState(false)

    const fetchStatistics = async (userId) => {
        try {
            // Limpia el estado para evitar mostrar datos anteriores
            setStatistics(null)
            setError(false)

            const response = await axiosApi.get(`statistics/statistics/user/${userId}/`)
            if (response.status === 200) {
                setStatistics(response.data)
            } else {
                setError(true)
            }
        } catch (error) {
            console.log(error)
            setError(true)
        }
    }

    useEffect(() => {
        if (userId) {
            fetchStatistics(userId)
        }
    }, [userId]) // Llama a fetchStatistics cada vez que userId cambia

    return (
        <div className="flex justify-evenly gap-4">
            {error ? (
                <p>No se encontraron estadísticas de este usuario</p>
            ) : (
                <>
                    <p>Likes: {statistics?.likes_count}</p>
                    <p>comentarios: {statistics?.comments_count}</p>
                    <p>Visitas: {statistics?.views_count}</p>
                    <p>Visitas fotos: {statistics?.photos_views_count}</p>
                    <p>Visitas colecciones: {statistics?.collections_views_count}</p>
                    <p>seguidores: {statistics?.followers_count}</p>
                    <p>siguiendo: {statistics?.following_count}</p>
                </>
            )}
        </div>
    )
}

UserStatistics.propTypes = {
    userId: PropTypes.number.isRequired
}