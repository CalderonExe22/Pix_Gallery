import { useState } from "react"
import axios from "axios"
import PropTypes from 'prop-types';

export default function InputLocations({setSelectedLocation}) {
    const [locations, setLocations] = useState([])
    const [query, setQuery] = useState('')
    const handleInputChange = async (e) => {
        const input = e.target.value
        setQuery(input)
        if(input.length > 2){
            try {
                const response = await axios.get(
                    "http://api.geonames.org/searchJSON",
                    {
                        params: {
                            q: input,
                            maxRows: 10, // Número máximo de resultados
                            username: "exequiel", // Reemplaza con tu nombre de usuario de GeoNames
                            lang: "es", // Idioma de los resultados
                        },
                    }
                )
                setLocations(response.data.geonames)
            } catch (error) {
                console.error(error)
            }
        }else{
            setLocations([])
        }
    }
    const handleSelectLocation = (location) => {
        setSelectedLocation(location);
        setQuery(`${location.name}, ${location.adminName1}, ${location.countryName}`)
        setLocations([])
    }
    return (
        <div className="w-full">
            <input className="w-full" type="text" value={query} onChange={handleInputChange} placeholder="Locacion"/>
            <ul>
                {locations?.map((location) => (
                    <li key={location.geonameId} onClick={()=>handleSelectLocation(location)} className="cursor-pointer">
                        {location.name}, {location.adminName1}, {location.countryName}
                    </li>
                ))}
            </ul>
        </div>
    )
}

InputLocations.propTypes = {
    setSelectedLocation: PropTypes.func,
}