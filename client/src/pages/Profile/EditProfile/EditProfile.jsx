import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axiosApi from "../../../services/axiosApi";
import { useNavigate, useParams } from "react-router-dom";
import { Tooltip } from "flowbite-react";
import { Spinner } from "flowbite-react"
import { Bounce, toast } from "react-toastify";

export default function Profile() {
    const { id } = useParams()
    const userId = localStorage.getItem('userId')
    const navigate = useNavigate()
    const [countries, setCountries] = useState([])
    const [profileData, setProfileData] = useState({})
    const [selectedCountry, setSelectedCountry] = useState("")
    const { register, handleSubmit, setValue } = useForm()
    const [error, setError] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)
    const [previewImage, setPreviewImage] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    if(userId !== id){
        toast.warn('No puedes modificar el perfil de otro usuario', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        })
        navigate('/')
    }

    const fetchProfile = async () => {
        try {
            const response = await axiosApi.get("users/api-user/"+id);
            if (response) {
                setProfileData(response.data);
                setSelectedCountry(response.data.profile.country || "")
                setValue("name", response.data.profile.name || "")
                setValue("last_name", response.data.profile.last_name || "")
                setValue("bio", response.data.profile.bio || "")
                setPreviewImage(response.data.profile.profile_image_url)
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
        setIsLoading(true)
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("last_name", data.last_name);
        formData.append("bio", data.bio);
        formData.append("country", selectedCountry);
        if (selectedImage) {
            formData.append("profile_photo", selectedImage);
        }
        try {
            const response = await axiosApi.patch(`/profile/profile/${id}/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (response.status === 200) {
                navigate(`/perfil/${id}`);
                toast.success(`Perfil actualizado correctamente.`, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                })
            }
        } catch (error) {
            if(error?.response.status){
                toast.error('Ocurrió un error al intentar realizar la acción ('+error?.response.status+')', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
            }
        }finally{
            setIsLoading(false)
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setSelectedImage(file)
            setPreviewImage(URL.createObjectURL(file))
        }
    }

    useEffect(() => {
        document.title = 'Administrar cuenta - Editar perfil'
        fetchProfile()
        fetchCountries()
    }, [id]);
    
    console.log(profileData)
    return (
        <div className="flex justify-center items-center h-full">
            <form className="flex flex-col gap-10" onSubmit={handleSubmit(onSubmit)}>
                
                <h1 className="font-semibold text-xl">EDITAR PERFIL</h1>
                
                <div className="relative  w-48 h-48 flex flex-col">   
                    <img src={previewImage}
                        alt="Preview"
                        className="mt-4 rounded-full w-48 h-48 object-cover"
                    />
                    <label className="absolute top-0 right-0 z-10 cursor-pointer" htmlFor="profile_photo">
                        <Tooltip content='Editar foto de perfil' style="dark" placement="top">
                            <i className="fa-solid fa-pen-to-square text-3xl"></i>
                        </Tooltip>
                    </label>
                    <input
                        id="profile_photo"
                        name="profile_photo"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                </div>
                <div className="flex flex-col w-full gap-2">
                    <label htmlFor="name">Nombre del perfil:</label>
                    <input
                        id="name"
                        placeholder="Nombre"
                        name="name"
                        type="text"
                        defaultValue={profileData?.name || ""}
                        {...register("name")}
                        className=" h-11 w-full p-1 rounded-xl duration-300 outline-none hover:border-[#3a0ca3] focus:border-[#3a0ca3]"
                    />
                </div>

                <div className="flex flex-col w-full gap-2">
                    <label htmlFor="last_name">Apellido del perfil:</label>
                    <input
                        id="last_name"
                        placeholder="Apellido"
                        name="last_name"
                        type="text"
                        defaultValue={profileData?.last_name || ""}
                        {...register("last_name")}
                        className=" h-11 w-full p-1 rounded-xl duration-300 outline-none hover:border-[#3a0ca3] focus:border-[#3a0ca3]"
                    />
                </div>

                <div className="flex flex-col w-full gap-2">
                    <label htmlFor="last_name">Biografia del perfil:</label>
                    <textarea
                        placeholder="biografia"
                        name="bio"
                        defaultValue={profileData?.bio || ""}
                        {...register("bio")}
                        className=" h-11 w-full p-1 rounded-xl duration-300 outline-none hover:border-[#3a0ca3] focus:border-[#3a0ca3]"
                    />
                </div>

                <div className="flex flex-col w-full gap-2">
                    <label htmlFor="country">País de Origen:</label>
                    {error ? (
                        <p className="text-red-500">Error al cargar la lista de países. Por favor, intenta nuevamente más tarde.</p>
                    ) : (
                        <select
                            name="country"
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            className=" h-11 w-full p-1 rounded-xl duration-300 outline-none hover:border-[#3a0ca3] focus:border-[#3a0ca3]"
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
                <button type="submit" 
                    className={`p-2 w-48 bg-[#b5179e] rounded-xl text-white font-bold flex justify-center items-center ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={isLoading}>
                        {isLoading ? (
                            <Spinner color="purple" size="sm" /> // Mostrar el spinner de Flowbite
                        ) : (
                            'Guardar cambios'
                        )}
                </button>
            </form>
        </div>
    );
}