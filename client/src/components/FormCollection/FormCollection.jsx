import { useFieldArray, useForm } from "react-hook-form";
import Input from "../Input/Input";
import FormPhoto from "../FormPhoto/FormPhoto";
import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import axiosApi from "../../services/axiosApi";
import { useNavigate } from "react-router-dom";

export default function FormCollection({ getData ,images = [], indexPhoto = 0 }) {
    const [photosData, setPhotosData] = useState([]);
    const navigate = useNavigate()
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
                is_free: true,
                is_public: true
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
                [field]: value
            };

            // Actualiza el campo en `useFieldArray`
            update(indexPhoto, newData[indexPhoto]);
            return newData;
        });
    };

    const onSubmit = async (data) => {
        /* const photosIncomplete = data.photos.some(photo => (
            !photo.title ||
            !photo.description ||
            !photo.category ||
            !photo.image
        )); */

        if (getData) {
            getData(data)
        } else {
            try {
                const formData = new FormData();
                formData.append('name', data.name);
                formData.append('description', data.description);
                const photoUploadPromises  = data.photos.map(async photo => {
                    const dataPhoto = new FormData();
                    dataPhoto.append('title', photo.title);
                    dataPhoto.append('description', photo.description);
                    dataPhoto.append('category', photo.category)
                    dataPhoto.append('image', photo.image);
                    dataPhoto.append('precio', photo.precio); 
                    dataPhoto.append('is_free', photo.is_free); 
                    dataPhoto.append('is_public', photo.is_public); 
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
                    photos_input: createdPhotos.map(photo => photo.id)  // Solo manda los IDs
                };
                
                const collectionResponse = await axiosApi.post('photos/collections/', collectionData);
                console.log(collectionData)
                if (collectionResponse.status === 201) {
                    console.log('Colección creada correctamente');
                    navigate('/ver-coleccion/'+collectionResponse.data.id)
                }
            } catch (error) {
                console.log(error)
            }
        }
    };
    //console.log(photosData)
    return (
        <div className="flex flex-col w-[400px]">
            <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit(onSubmit)}>
                <h1 className="text-xl font-medium">Sube tu coleccion</h1>
                <Input 
                    type="text"
                    name='name'
                    label='Titulo de la colección'
                    placeholder='Ingrese título de la colección'
                    required={true}
                    register={register}
                    errors={errors}
                />
                <Input 
                    type="text"
                    name='description'
                    label='Descripción de la colección'
                    placeholder='Ingrese descripción de la colección'
                    required={true}
                    register={register}
                    errors={errors}
                />
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
                <button type="submit">Guardar Colección</button>
            </form>

            
        </div>
    );
}

FormCollection.propTypes = {
    images: PropTypes.arrayOf(PropTypes.instanceOf(File)),
    indexPhoto: PropTypes.number,
    getData: PropTypes.func
};
