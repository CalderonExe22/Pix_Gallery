import { useFieldArray, useForm } from "react-hook-form";
import Input from "../Input/Input";
import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import axiosApi from "../../services/axiosApi";
import { useNavigate } from "react-router-dom";
import FormEditPhotoCollection from "./FormEditPhotoCollection";
import { Bounce, toast } from "react-toastify";
import { Spinner } from "flowbite-react"

export default function FormEditCollection({ collection , indexPhoto = 0 }) {
    const [photosData, setPhotosData] = useState(collection?.photos || [])
    const navigate = useNavigate()
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const { register, handleSubmit, control, formState: { errors } } = useForm({
        defaultValues: {
            name: collection?.name || '',
            description: collection?.description || '',
            category: collection?.category || '',
            photos: collection?.photos || []
        }
    })

    const { fields: photoFields, append, update, remove } = useFieldArray({
        control,
        name: 'photos'
    });

    useEffect(() => {
        if (collection?.photos.length > photoFields.length) {
            const newPhotosData = collection?.photos.slice(photoFields.length).map(image => ({
                title: image.title || '',
                description: image.description || '',
                category: image.category || '',
                precio: parseFloat(image.precio) || 0, // Convierte el precio a número
                is_free: image.is_free ?? true, // Asegura valores booleanos
                is_public: image.is_public ?? true,
                camera: image.exif_data?.camera || '',
                lens: image.exif_data?.lens || '',
                focal_length: image.exif_data?.focal_length || '',
                shutter_speed: image.exif_data?.shutter_speed || '',
                aperture: image.exif_data?.aperture || '',
                iso: image.exif_data?.iso || '',
            }));
            console.log(newPhotosData)
            setPhotosData(prevData => [...prevData, ...newPhotosData]);
            newPhotosData.forEach(photoData => {
                console.log('Appending photo data:', photoData); // Depura cada inserción
                append(photoData);
            })
        } else if (collection?.photos.length < photoFields.length) {
            const updatedPhotosData = photosData.slice(0, collection?.photos.length);
            setPhotosData(updatedPhotosData);
            for (let i = photoFields.length - 1; i >= collection?.photos.length; i--) {
                remove(i);
            }
        }
    }, [collection?.photos, photoFields.length, append, remove])

    const updatePhotoData = (field, value) => {
        setPhotosData(prevData => {
            const newData = [...prevData];
            newData[indexPhoto] = {
                ...newData[indexPhoto],
                [field]: field === 'focal_length' || field === 'shutter_speed' || field === 'iso' || field === 'aperture' ? Number(value) : value,
            };

            // Actualiza el campo en `useFieldArray`
            update(indexPhoto, newData[indexPhoto]);
            console.log(newData)
            return newData;
        });
    };

    const getCategories = async () => {
        try {
        const response = await axiosApi.get('photos/category/');
        setCategories(response.data);
        } catch (error) {
        console.log('Error al obtener las categorías:', error);
        }
    }

    useEffect(() => {
        getCategories()
    }, [])

    const onSubmit = async (data) => {
        try {
            setIsLoading(true)
            // Asegúrate de procesar las fotos en paralelo y esperar su finalización
            const updatedPhotos = await Promise.all(
                data.photos.map(async (photo) => {
                    const dataPhoto = {
                        id: photo.id,
                        title: photo.title,
                        description: photo.description,
                        category: photo.category,
                        precio: photo.precio,
                        is_free: photo.is_free,
                        is_public: photo.is_public,
                        tags: Array.isArray(photo?.tags_photo)
                        ? photo?.tags_photo.map(tag =>
                            typeof tag === 'string' ? tag : tag.name // Maneja tanto strings como objetos
                        )
                        : [], // Validar `tags_photo` como arreglo
                        camera: photo.exif_data?.camera || '',
                        lens: photo.exif_data?.lens || '',
                        focal_length: photo.exif_data?.focal_length || '',
                        shutter_speed: photo.exif_data?.shutter_speed || '',
                        aperture: photo.exif_data?.aperture || '',
                        iso: photo.exif_data?.iso || '',
                    };
    
                    const response = await axiosApi.patch(`photos/photography/${dataPhoto.id}/`, dataPhoto);
                    return response.data;
                })
            );
    
            // Ahora actualiza la colección usando los datos procesados
            const collectionData = {
                name: data.name,
                description: data.description,
                category: data.category,
                photos_input: updatedPhotos.map(photo => photo.id), // Incluye los IDs de las fotos actualizadas
            };
    
            const collectionResponse = await axiosApi.patch(`photos/collections/${collection.id}/`, collectionData);
    
            if (collectionResponse.status === 200) {
                
                toast.success(`La colección se actualizo correctamente.`, {
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
                navigate(`/ver-coleccion/${collectionResponse.data.id}`);
            }
        } catch (error) {
            if(error?.response.status === 403){
                toast.error('Usuario no autorizado', {
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
            }else{
                toast.error('Ocurrió un error al intentar realizar la acción.', {
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
        }finally{
            setIsLoading(false)
        }
    }
    const formattedPhoto = {
        ...photosData[indexPhoto],
        tags_photo: Array.isArray(photosData[indexPhoto]?.tags_photo)
        ? photosData[indexPhoto].tags_photo.map(tag =>
            typeof tag === 'string' ? tag : tag.name // Maneja tanto strings como objetos
        )
        : [], // Asegúrate de que sea un arreglo de strings
    }
    console.log(photosData)
    console.log(categories)
    return (
        <div className="flex flex-col w-[400px]">
            <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit(onSubmit)}>
                <h1 className="text-xl font-medium">Editar coleccion</h1>
                <Input 
                    type="text"
                    name='name'
                    label='Titulo de la colección'
                    placeholder='Ingrese título de la colección'
                    required={true}
                    register={register}
                    errors={errors}
                    classNameStyle="h-11 w-full p-1 rounded-xl duration-300 outline-none hover:border-[#3a0ca3] focus:border-[#3a0ca3]"
                />
                <Input 
                    type="text"
                    name='description'
                    label='Descripción de la colección'
                    placeholder='Ingrese descripción de la colección'
                    required={true}
                    register={register}
                    errors={errors}
                    classNameStyle="h-11 w-full p-1 rounded-xl duration-300 outline-none hover:border-[#3a0ca3] focus:border-[#3a0ca3]"
                />
                <div className="flex flex-col gap-3">
                    <label id="category" htmlFor="category">Seleccione una categoria</label>
                    <select 
                        className="h-11 w-full p-1 rounded-xl duration-300 outline-none hover:border-[#3a0ca3] focus:border-[#3a0ca3]"
                        id="category" name="category" {...register('category',{required:true})}
                        defaultValue={photosData?.category || ''}
                        required
                        >
                        {categories.map(category => (
                            <option key={category?.id} value={category?.id}>{category?.name}</option>
                        ))}
                    </select>
                </div>
                {/* Renderiza el formulario para la imagen indicada por `indexPhoto` */}
                {photosData.length > indexPhoto && (
                    <>
                        <h1 className="text-xl font-medium">Informacion de cada fotografia</h1>
                        <FormEditPhotoCollection
                            updatePhotoData={updatePhotoData}
                            selectedPhoto={formattedPhoto}
                        />
                    </>
                )}
                <button type="submit" 
                className={`p-2 bg-[#b5179e] text-white w-48 font-bold flex justify-center items-center ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isLoading}>
                    {isLoading ? (
                        <Spinner color="purple" size="sm" /> // Mostrar el spinner de Flowbite
                    ) : (
                        'Editar coleccion'
                    )}
            </button>
            </form> 
        </div>
    );
}

FormEditCollection.propTypes = {
    indexPhoto: PropTypes.number,
    collection: PropTypes.object
};
