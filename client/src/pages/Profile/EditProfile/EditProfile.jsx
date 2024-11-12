import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axiosApi from "../../../services/axiosApi";
import { useNavigate, useParams } from "react-router-dom";

export default function Profile() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [countries, setCountries] = useState([])
    const [profileData, setProfileData] = useState({})
    const [selectedCountry, setSelectedCountry] = useState("")
    const { register, handleSubmit, setValue } = useForm()
    const [error, setError] = useState(false)

    const fetchProfile = async () => {
        try {
            const response = await axiosApi.get("users/api-user/"+id);
            if (response) {
                setProfileData(response.data);
                setSelectedCountry(response.data.profile.country || "")
                setValue("name", response.data.profile.name || "")
                setValue("last_name", response.data.profile.last_name || "")
                setValue("bio", response.data.profile.bio || "")
            }
        } catch (error) {
            console.error(error)
        }
    };

    const fetchCountries = async () => {
        try {
            const response = await axiosApi.get("/countries/");
            const data = response.data 
            if (data.length > 0) {
                setCountries(data)
            }else{
                setCountries(data)
                setError(true)
            }
        } catch (error) {
            console.error(error)
            setError(error)
        }
    };
    
    const onSubmit = async (data) => {
        data.country = selectedCountry; // Añadir el país seleccionado al perfil
        try {
            const response = await axiosApi.patch(`profile/profile/${id}/`, data);
            if (response.status === 200) {
                navigate('/perfil/'+id)
            }
        } catch (error) {
            console.error(error)
        }
    };

    useEffect(() => {
        fetchProfile()
        fetchCountries()
    }, []);
    
    console.log(profileData)
    return (
        <div className="flex justify-center items-center h-full">
            <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
                <h1>EDITAR PERFIL</h1>
                <input
                    placeholder="Nombre"
                    name="name"
                    type="text"
                    defaultValue={profileData.name || ""}
                    {...register("name")}
                    className="border border-gray-300 rounded-md p-2 mb-2"
                />
                <input
                    placeholder="Apellido"
                    name="last_name"
                    type="text"
                    defaultValue={profileData.last_name || ""}
                    {...register("last_name")}
                    className="border border-gray-300 rounded-md p-2 mb-2"
                />
                <textarea
                    placeholder="biografia"
                    name="bio"
                    defaultValue={profileData.bio || ""}
                    {...register("bio")}
                    className="border border-gray-300 rounded-md p-2 mb-2"
                />
                <div>
                    <label htmlFor="country">País de Origen:</label>
                    {error ? (
                        <p className="text-red-500">Error al cargar la lista de países. Por favor, intenta nuevamente más tarde.</p>
                    ) : (
                        <select
                            name="country"
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            className="border border-gray-300 rounded-md p-2"
                        >
                            <option value="">Selecciona un país</option>
                            {countries.map((country) => (
                                <option key={country.codigo} value={country.codigo}>
                                    {country.nombre}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
                <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded">
                    Guardar cambios
                </button>
            </form>
        </div>
    );
}