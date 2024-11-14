import { useEffect, useState } from "react"
import axiosApi from "../../services/axiosApi"
import Input from "../Input/Input"
import { useForm } from "react-hook-form";
import CardCollectionFolden from "../Cards/CardCollection/CardCollectionFolden";
import { useNavigate } from "react-router-dom";
export default function FormPortafolio() {
    const [collections, setCollections] = useState([])
    const [photos, setPhotos] = useState([])
    const [addCollections,setAddCollections] = useState(false)
    const navigate = useNavigate()
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
            photos_input: selectedPhoto.photos_input,
        };
    
        const response = await axiosApi.post('photos/collections/', collectionData);
        return response.data.id;  // Retorna el ID de la colección creada
    };

    const onSubmit = async (data) => {
        try {
            const newCollectionId = await createCollection()
            if (newCollectionId) {
                data.existing_collections = [...selectedCollections, newCollectionId];
            } else {
                data.existing_collections = selectedCollections;
            }
            const response = await axiosApi.post('portafolio/portafolios/',data)
            if(response.data){
                console.log('portafolio creados')
                console.log(response.data)
                navigate('/perfil/'+response.data.user)
            }
        } catch (error) {
            console.error(error)
        }
        
    }

    return (
        <div className="grid grid-cols-3 items-center w-full h-full">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-start gap-5">
                <h1 className="text-4xl">Sube tu portafolio</h1>
                <Input className={'w-1/2'} label='nombre del portafolio' type={'text'} name={'name'} register={register} errors={errors} required={true} clas />
                <Input className={'w-1/2'} label='Descripcion del portafolio' type={'text'} name={'description'} register={register} errors={errors} required={true} />
                <button onClick={handleAddCollections} disabled={!addCollections} className="w-full p-6 flex"><i className="fa-solid fa-plus"></i><h1>Añade tus fotografias</h1></button>
                <button onClick={handleAddCollections} disabled={addCollections} className="w-full p-6 flex"><i className="fa-solid fa-plus"></i><h1>Añade tus colección</h1></button>
                <button className="w-[250px]" type='submit'>Subir portafolio</button>
            </form>
            <div className="flex flex-col h-full w-full col-span-2 ">
                <div className={`grid grid-cols-3 justify-center items-center ${addCollections?'h-[600px] overflow-y-auto':'h-0 overflow-hidden'} gap-10 transition-all duration-300`}>
                    {collections.map((collection) => (
                        <div onClick={() => handleSelectedCollection(collection.id)} key={collection.id} className={`flex ${selectedCollections.includes(collection.id) ? 'border-2 border-blue-600' : 'opacity-70'} cursor-pointer`}>
                            <CardCollectionFolden photos={collection.photos} title={collection.name} />
                        </div>
                    ))}
                </div>
                <div className={`relative grid grid-cols-3 justify-center items-center w-full ${addCollections?'h-0 overflow-hidden':'h-[600px] overflow-y-auto'} gap-10 transition-all duration-300`}>
                    {/*<div className="sticky flex flex-col gap-4 w-full col-span-3 top-0 z-10 bg-white p-5">
                        <h1 className="text-xl font-semibold">Coleccion mejores fotografias</h1>
                        <input className="w-1/2" placeholder="Nombre por defecto: Mejores fotografias" type="text" />
                        <input className="w-1/2" placeholder="Descripcion por defecto: Las mejores fotografias del usuario" type="text" />
                    </div>*/}
                    {photos.map((photo) => (
                        <div onClick={() => handleSelectedPhoto(photo.id)} key={photo.id} className={`flex gap-4 w-[300px] h-[350px] ${selectedPhoto.photos_input.includes(photo.id) ? 'border-2 border-blue-600' : 'cursor-pointer opacity-70'}`}>
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
