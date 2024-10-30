import { useEffect, useState } from "react"
import axiosApi from '../../services/axiosApi'

export default function ListsCountries() {
    const [countries, setCountries] = useState([])
    const [selectCountry, setSelectCountry] = useState('')
    const feachCountries = async () => {
        try {
            const response = await axiosApi.get('countries/')
            if(response){
                setCountries(response.data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(()=>{
        feachCountries()
    },[])

    const handleChange = (e) => {
        setSelectCountry(e.target.value);
    };

    return (
        
    )
}
