import { useEffect, useState } from "react"
import axiosApi from "../../services/axiosApi"
import Input from "../Input/Input"
import { useForm } from "react-hook-form";
import CardCollectionFolden from "../Cards/CardCollection/CardCollectionFolden";
import { useNavigate } from "react-router-dom";
import { Spinner } from "flowbite-react"
import { Bounce, toast } from "react-toastify";

export default function FormPortafolio() {
    const has_portafolio = localStorage.getItem('has_portafolio') === 'true'
    const [collections, setCollections] = useState([])
    const [photos, setPhotos] = useState([])
    const navigate = useNavigate()
    const id = localStorage.getItem('userId')
    const [activeTab, setActiveTab] = useState("photos")
    const [addCollections,setAddCollections] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    if(has_portafolio){
        toast.warn('El usuario ya tiene creado un portafolio', {
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
        navigate('/perfil/'+id)
    }

    const [selectedPhoto, setSelectPhotos] = useState({
        name: 'Mejores fotografia',
        description: 'Las mejores fotografias del usuario',
        photos_input: []
    })
    const [selectedCollections, setSelectedCollections] = useState([])
    const {
        register,
        handleSubmit, 
        formState:{errors},
    } = useForm({
        defaultValues: {
            name: '',
            description: '',
            is_public: true,
            existing_photos: [],
            existing_collections: [],
        },
    })

    const handleAddCollections = () =>{
        setAddCollections(!addCollections)
        if(activeTab === 'photos'){
            setActiveTab('collections')
        }else{
            setActiveTab('photos')
        }
    }

    const fechCollections = async () => {
        const response = await axiosApi.get('photos/collections/user_collections/')
        setCollections(response.data)
    }

    const fechPhotos = async () => {
        const response = await axiosApi.get('photos/photography/get_user_photographies/')
        setPhotos(response.data)
    }

    useEffect(()=>{
        fechPhotos()
        fechCollections()
    }, [])

    const handleSelectedPhoto = (photoId) => {
        setSelectPhotos((prevPhotos) => {
            const isAlreadySelected = prevPhotos.photos_input.includes(photoId)
            return{
                ...prevPhotos,
                photos_input: isAlreadySelected ? 
                prevPhotos.photos_input.filter(id => id !== photoId) : 
                [...prevPhotos.photos_input, photoId]
            }
        })
    }   

    const handleSelectedCollection = (collectionId) => {
        setSelectedCollections(prevCollection => {
            if(prevCollection.includes(collectionId)){
                return prevCollection.filter(id => id !== collectionId)
            }else{
                return [...prevCollection, collectionId]
            }
        })
    }

    const createCollection = async () => {
        const collectionData = {
            name: selectedPhoto.name,
            description: selectedPhoto.description,
            category: 12,
            is_public : true,
            photos_input: selectedPhoto.photos_input,
        };
    
        const response = await axiosApi.post('photos/collections/', collectionData);
        return response.data.id;  // Retorna el ID de la colección creada
    };

    const onSubmit = async (data) => {
        setIsLoading(true)
        try {
            const newCollectionId = await createCollection()
            if (newCollectionId) {
                data.existing_collections = [...selectedCollections, newCollectionId];
            } else {
                data.existing_collections = selectedCollections;
            }
            const response = await axiosApi.post('portafolio/portafolios/',data)
            if(response.data){
                navigate('/perfil/'+parseInt(id))
                toast.success(`Portafolio creado correctamente.`, {
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

    return (
        <div className="grid grid-cols-3 justify-center items-center w-full h-full">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col col-span-1 items-start px-20 gap-10">
                <h1 className="text-4xl">Sube tu portafolio</h1>
                <Input label='nombre del portafolio' type={'text'} name={'name'} register={register} errors={errors} required={true} classNameStyle="h-11 w-2/3 p-1 rounded-xl duration-300 outline-none hover:border-[#3a0ca3] focus:border-[#3a0ca3]"/>
                <Input label='Descripcion del portafolio' type={'text'} name={'description'} register={register} errors={errors} classNameStyle="h-11 w-2/3 p-1 rounded-xl duration-300 outline-none hover:border-[#3a0ca3] focus:border-[#3a0ca3]" required={true} />
                <button onClick={handleAddCollections} disabled={!addCollections} className={`w-[300px] p-6 flex transition-colors duration-300 ${activeTab === "photos" ? "bg-[#b5179e] text-white" : "hover:text-white hover:bg-[#b5179e]"}`}><i className="fa-solid fa-plus"></i><h1>Añade tus fotografias</h1></button>
                <button onClick={handleAddCollections} disabled={addCollections} className={`w-[300px] p-6 flex transition-colors duration-300 ${activeTab === "collections" ? "bg-[#b5179e] text-white" : "hover:text-white hover:bg-[#b5179e]"}`}><i className="fa-solid fa-plus"></i><h1>Añade tus colección</h1></button>
                <button type="submit" 
                    className={`p-2 w-48 bg-[#b5179e] rounded-xl text-white font-bold flex justify-center items-center ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={isLoading}>
                        {isLoading ? (
                            <Spinner color="purple" size="sm" /> // Mostrar el spinner de Flowbite
                        ) : (
                            'Crear portafolio'
                        )}
                </button>
            </form>
            <div className="flex flex-col justify-center items-center h-full w-full col-span-2 ">
                <div className={`relative grid grid-cols-[250px_250px_250px_250px] w-full gap-5 justify-center items-center ${addCollections?'h-[600px] overflow-y-auto':'h-0 overflow-hidden'} gap-10 transition-all duration-300 z-50`}>
                    {collections.map((collection) => (
                        <div onClick={() => handleSelectedCollection(collection.id)} key={collection.id} className={`flex h-[300px] ${selectedCollections.includes(collection.id) ? 'border-2 border-[#3a0ca3]' : 'opacity-70'} cursor-pointer`}>
                            <CardCollectionFolden collection={collection} rowSpan={false} show={false}/>
                        </div>
                    ))}
                </div>
                <div className={`relative grid grid-cols-[250px_250px_250px_250px] gap-5 justify-center items-center w-full ${addCollections?'h-0 overflow-hidden':'h-[600px] overflow-y-auto'} gap-10 transition-all duration-300`}>
                    {photos.map((photo) => (
                        <div onClick={() => handleSelectedPhoto(photo.id)} key={photo.id} className={`flex gap-4 h-[300px] ${selectedPhoto.photos_input.includes(photo.id) ? 'border-2 border-[#3a0ca3]' : 'cursor-pointer opacity-70'}`}>
                            <div className="flex h-full w-full">
                                <img className="object-cover h-full w-full" src={photo.image_url} alt={photo.title} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
