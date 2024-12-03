import { useFieldArray, useForm } from "react-hook-form";
import Input from "../Input/Input";
import FormPhoto from "../FormPhoto/FormPhoto";
import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import axiosApi from "../../services/axiosApi";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { Spinner } from "flowbite-react"

export default function FormCollection({ getData ,images = [], indexPhoto = 0 }) {
    const [photosData, setPhotosData] = useState([])
    const navigate = useNavigate()
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const { register, handleSubmit, control, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            description: '',
            photos: []
        }
    });

    const { fields: photoFields, append, update, remove } = useFieldArray({
        control,
        name: 'photos'
    });

    useEffect(() => {
        if (images.length > photoFields.length) {
            // Agregar nuevas fotos
            const newPhotosData = images.slice(photoFields.length).map(image => ({
                title: image?.name || '',
                description: '',
                category: '',
                image: image,
                precio: 0,
                tags:[],
                is_free: true,
                is_public: true,
                camera : '',
                lens: '',
                focal_length: 0,
                shutter_speed: 0,
                aperture: 0,
                iso: 0,
            }));
            
            setPhotosData(prevData => [...prevData, ...newPhotosData]);
            newPhotosData.forEach(photoData => append(photoData));
        } else if (images.length < photoFields.length) {
            const updatedPhotosData = photosData.slice(0, images.length);
            setPhotosData(updatedPhotosData);
            for (let i = photoFields.length - 1; i >= images.length; i--) {
                remove(i);
            }
        }
    }, [images, photoFields.length, append, remove])

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
        setIsLoading(true)
        const photosIncomplete = data.photos.some(photo => (
            !photo.title ||
            !photo.description ||
            !photo.category ||
            !photo.image
        ));

        if (getData) {
            getData(data)
        } else {
            try {
                const formData = new FormData();
                formData.append('name', data.name);
                formData.append('description', data.description);
                formData.append('category', data.category);
                const photoUploadPromises  = data.photos.map(async photo => {
                    const dataPhoto = new FormData();
                    dataPhoto.append('title', photo.title);
                    dataPhoto.append('description', photo.description);
                    dataPhoto.append('category', photo.category)
                    dataPhoto.append('image', photo.image);
                    dataPhoto.append('precio', photo.precio); 
                    dataPhoto.append('is_free', photo.is_free); 
                    dataPhoto.append('is_public', photo.is_public); 
                    dataPhoto.append('can_notification', false)
                    
                    photo.tags.forEach((tag) => {
                        dataPhoto.append('tags', tag)
                    });
            
                    dataPhoto.append('camera', photo.camera || '')
                    dataPhoto.append('lens', photo.lens || '')
                    dataPhoto.append('focal_length', photo.focal_length || '')
                    dataPhoto.append('shutter_speed', photo.shutter_speed || '')
                    dataPhoto.append('aperture', photo.aperture || '')
                    dataPhoto.append('iso', photo.iso || '')
                    console.log(dataPhoto)
                    
                    const response = await axiosApi.post('photos/photography/', dataPhoto,{
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    })
                    return response.data
                });

                const createdPhotos = await Promise.all(photoUploadPromises )
                
                const collectionData = {
                    name: data.name,
                    description: data.description,
                    category: data.category,
                    photos_input: createdPhotos.map(photo => photo.id)  // Solo manda los IDs
                };
                
                const collectionResponse = await axiosApi.post('photos/collections/', collectionData);
                if(collectionResponse.status === 201){
                    navigate(`/ver-coleccion/${collectionResponse.data.id}`)
                    toast.success(`Coleccion creada correctamente.`, {
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
    };
    console.log(photosData)
    return (
        <div className="flex flex-col w-[400px]">
            <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit(onSubmit)}>
                <h1 className="text-4xl mb-5">Sube tu coleccion</h1>
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
                        required
                        >
                        <option value="">Selecciona una categoría</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </div>
                {/* Renderiza el formulario para la imagen indicada por `indexPhoto` */}
                {photosData.length > indexPhoto && (
                    <>
                        <h1 className="text-xl font-medium">Informacion de cada fotografia</h1>
                        <FormPhoto
                            updatePhotoData={updatePhotoData}
                            selectedPhoto={photosData[indexPhoto]}
                        />
                    </>
                )}
                <button type="submit" 
                    className={`p-2 bg-[#b5179e] text-white w-32 font-bold flex justify-center items-center ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={isLoading}>
                        {isLoading ? (
                            <Spinner color="purple" size="sm" /> // Mostrar el spinner de Flowbite
                        ) : (
                            'Subir coleccion'
                        )}
                </button>
            </form>

            
        </div>
    );
}

FormCollection.propTypes = {
    images: PropTypes.arrayOf(PropTypes.instanceOf(File)),
    indexPhoto: PropTypes.number,
    getData: PropTypes.func
};
