import { useEffect, useState } from "react"; 
import axiosApi from "../../services/axiosApi";
import { useForm, useFieldArray} from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function CreatePortafolio() {
    const [isPublic, setIsPublic] = useState(false);
    const [collections, setCollections] = useState([])
    const [photos, setPhotos] = useState([])
    const navigate = useNavigate()
    const {
        register,
        handleSubmit, 
        control, 
    } = useForm({
        defaultValues: {
            name: '',
            description: '',
            is_public: false,
            existing_photos: [],
            existing_colections: [],
            collections: [],
            photos: [],
        },
    })

    const { fields: collectionsFields, append: appendCollection, remove: removeCollection } = useFieldArray({
        control,
        name: 'collections',
    });

    const { fields: photoFields, append: appendPhoto, remove: removePhoto } = useFieldArray({
        control,
        name: 'photos',
    });

    const fechCollections = async () => {
        const response = await axiosApi.get('photos/collections/')
        setCollections(response.data)
    }

    const fechPhotos = async () => {
        const response = await axiosApi.get('photos/photography/')
        setPhotos(response.data)
    }

    useEffect(()=>{
        fechPhotos()
        fechCollections()
    }, [])

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('description', data.description);
            formData.append('is_public', isPublic);
    
            // Asociar colecciones existentes
            if (data.existing_colections.length > 0) {
                data.existing_colections.forEach((collectionId) => {
                    formData.append('existing_collections', collectionId);
                });
            }
    
            // Asociar fotos existentes
            if (data.existing_photos.length > 0) {
                data.existing_photos.forEach((photoId) => {
                    formData.append('existing_photos', photoId);
                });
            }
    
            // Añadir nuevas colecciones
            if (data.collections.length > 0) {
                const collectionsData = data.collections.map((collection) => ({
                    name: collection.name,
                    description: collection.description,
                }))
                formData.append('collections', JSON.stringify(collectionsData));
            }
    
            // Añadir fotos nuevas
            const photosData = data.photos.map((photo) => {
                return {
                    title: photo.title,
                    description: photo.description,
                    is_free: photo.is_free,
                    is_public: photo.is_public,
                    precio: photo.precio,
                };
            });
            // Agregar las fotos como JSON en FormData
            formData.append('photos', JSON.stringify(photosData));

            data.photos.forEach((photo, index) => {
                formData.append(`photos[${index}][image]`, photo.image[0]);
            });

            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }
                
            const response = await axiosApi.post('portafolio/portafolios/', formData);
            if (response.status === 200) {
                navigate('/portafolio');
            }
        } catch (error) {
            console.error("Error:", error.response.data);
        }
    }

    return (
        <div className="flex justify-center items-center w-full h-auto p-28 gap-10">
            <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                <h2>Create Portafolio</h2>
                <div>
                    <label>Portafolio Name:</label>
                    <input
                        type="text"
                        name="name"
                        {...register("name", { required: true })}
                    />
                </div>

                <div>
                    <label>Portafolio Description:</label>
                    <input
                        type="text"
                        name="description"
                        {...register("description", { required: true })}
                    />
                </div>

                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                        />
                        Is Public?
                    </label>
                </div>
                    <div className="flex flex-col">
                        {collectionsFields.map((field, index) => (
                            <div className="flex flex-col gap-5" key={field.id}>
                                <input
                                    {...register(`collections.${index}.name`)}
                                    placeholder="Nombre de la nueva colección"
                                />
                                <textarea
                                    {...register(`collections.${index}.description`)}
                                    placeholder="Descripción de la nueva colección"
                                ></textarea>
                                <div className="flex flex-col gap-3">
                                    <label>Existing Photos:</label>
                                    <select {...register('existing_photos')} multiple>
                                        { photos.map(photo => (
                                            <option key={photo.id} value={photo.id}>{photo.title}</option>
                                        )) }
                                    </select>
                                </div>
                                {photoFields.map((field, index) => (
                                    <div key={field.id} className="grid grid-col-4 gap-2">
                                        <div className="flex flex-col">
                                            <h1>Subir Imagen</h1>
                                            <input 
                                                type="text" 
                                                id="title" 
                                                name="title"
                                                placeholder="Título"
                                                {...register(`photos.${index}.title`, { required: true })}                                        
                                            />
                                            <input 
                                                type="text" 
                                                id="description" 
                                                name="description" 
                                                placeholder="Descripción"
                                                {...register(`photos.${index}.description`, { required: true })} 
                                            />
                                            <input 
                                                type="number" 
                                                id="precio" 
                                                name="precio"
                                                placeholder="Precio"
                                                {...register(`photos.${index}.precio`, { required: true })}
                                            />
                                            <label>
                                            <input 
                                                type="checkbox" 
                                                id="is_free" 
                                                name="is_free"
                                                {...register(`photos.${index}.is_free`, { required: true })}
                                            />
                                            Gratis
                                            </label>
                                            <label>
                                            <input 
                                                type="checkbox" 
                                                id="is_public" 
                                                name="is_public"
                                                {...register(`photos.${index}.is_public`, { required: true })}
                                            />
                                            Pública
                                            </label>
                                            <input
                                                type="file"
                                                name="image"
                                                {...register(`photos.${index}.image`, { required: true })}
                                                multiple
                                            />
                                            <button type="button" onClick={() => removePhoto(index)}>
                                                Eliminar Foto
                                            </button>
                                        </div>
                                    </div>
                                    ))}
                                    <button type="button" onClick={() => appendPhoto({ image: '',title: '' ,description: '', is_public: '', is_free: '', precio:'' })}>
                                        Añadir nueva foto
                                    </button>
                                <button type="button" onClick={() => removeCollection(index)}>
                                    Eliminar Coleccion
                                </button>
                            </div>
                        ))}
                        {collectionsFields.length === 0 && (
                            <button type="button" onClick={() => appendCollection({ name: '', description: '' })}>
                                Añadir colección
                            </button>
                        )}
                    </div>
                    <div className="flex flex-col gap-3">
                        <label>Añadir Coleccion existente:</label>
                        <select multiple {...register('existing_colections')}>
                            { collections.map(collection => (
                                    <option key={collection.id} value={collection.id}>{collection.name}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit"> Subir portafolio </button>
            </form>
        </div>
    );
};