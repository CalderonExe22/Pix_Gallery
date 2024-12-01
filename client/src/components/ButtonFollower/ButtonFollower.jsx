import { useEffect, useState } from "react"
import axiosApi from "../../services/axiosApi"
import PropTypes from 'prop-types'

export default function ButtonFollower({followedId}) {
    const [isFollowing, setIsFollowing] = useState(false)
    const checkFollowingStatus = async (id) => {
        try {
            const response = await axiosApi.get(`followers/followers/check/${id}/`)
            setIsFollowing(response.data.isFollowing)
        } catch (error) {
            console.log(error)
        }
    }
    const handleFollow = async () => {
        try {
            if(isFollowing){
                await axiosApi.delete(`followers/followers/${followedId}/`)
            }else{
                await axiosApi.post('followers/followers/', { followed: followedId })
            }
            setIsFollowing(!isFollowing)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
        checkFollowingStatus(followedId)
    },[followedId])
    return (
        <button className="p-2 bg-[#b5179e] text-white rounded-md" onClick={handleFollow}>
            {isFollowing ? "Siguiendo" : "Seguir"}
        </button>
    )
}
ButtonFollower.propTypes = {
    followedId: PropTypes.number.isRequired
}