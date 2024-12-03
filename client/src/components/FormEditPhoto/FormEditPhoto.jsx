import { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import axiosApi from '../../services/axiosApi';
import { useForm } from 'react-hook-form';
import Input from '../Input/Input';
import { Bounce, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "flowbite-react"

export default function FormEditPhoto({photoData}) {
    const navigate = useNavigate()
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState(photoData?.tags_photo || [])
    const [isLoading, setIsLoading] = useState(false)
    console.log(tags)
    const handleAddTag = (tagName) => {
        if (tagName && !tags.some(tag => tag.name === tagName)) { 
            setTags([...tags, { name: tagName }])
        }
    }

    const handleRemoveTag = (tagName) => {
        setTags(tags.filter(tag => tag.name !== tagName));
    }

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

    const {
        register,
        handleSubmit,
        formState:{errors},
        watch
    } = useForm({
        defaultValues:{
            title: photoData?.title || '',
            description: photoData?.description || '',
            category: photoData?.category || '',
            is_free : photoData?.is_free || true,
            is_public: photoData?.is_public || true,
            precio: photoData?.precio || 0,
            camera: photoData.exif_data?.camera || '',
            lens:  photoData.exif_data?.lens || '',
            focal_length:  photoData.exif_data?.focal_length || '',
            shutter_speed:  photoData.exif_data?.shutter_speed || '',
            aperture:  photoData.exif_data?.aperture || '',
            iso:  photoData.exif_data?.iso || '',
        }
    })
    const isFree = watch('is_free', true)

    const onSubmit = async (data) => {
        setIsLoading(true)
        const dataPhoto = {
            title: data.title,
            description: data.description,
            category: data.category,
            precio: data.precio,
            is_free: data.is_free,
            is_public: data.is_public,
            tags: tags.map(tag => tag.name),
            camera: data.camera || '',
            lens: data.lens || '',
            focal_length: data.focal_length || '', 
            shutter_speed: data.shutter_speed || '', 
            aperture: data.aperture || '', 
            iso: data.iso || '', 
        };
    
        console.log('Data para enviar:', dataPhoto);
        try {
            const response = await axiosApi.patch(`photos/photography/${photoData.id}/`, dataPhoto)
            navigate(`/ver-foto/${photoData.id}`)
            console.log(response)
            toast.success(`Fotografía actualizada correctamente.`, {
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
                    theme: "light",
                    transition: Bounce,
                    });
            }else{
                toast.error('Ocurrió un error al intentar realizar la acción.', {
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
        <>
        <form className="flex flex-col gap-5 w-2/3 ms-20 me-20 text-lg" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-4xl">Editar fotografia</h1>
            <Input type="text" name='title' label='Titulo de la fotografia' placeholder='Ingrese titulo de su foto'required={true}
                register={register}
                errors={errors}
            />
            <Input 
                type="text"name='description'label='Descripción de la fotografia'placeholder='Ingrese titulo de su foto'required={true}
                register={register}
                errors={errors}
            />
            <div className="flex flex-col gap-3">
                <label id="category" htmlFor="category">Seleccione una categoria</label>
                <select 
                    id="category" 
                    name="category" 
                    {...register('category', { required: true })}
                    defaultValue={photoData.category || ''} // Usamos photoData.category como valor predeterminado
                    required
                >
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex flex-col gap-3">
                <label id="tags" htmlFor="tags">Tags</label>
                <input id="tags" type="text" name='tags' placeholder="Ingrese tags adicionales"
                    onKeyDown={(e) => {
                        if(e.key === 'Enter'){
                            e.preventDefault()
                            handleAddTag(e.target.value)
                            e.target.value = ''
                        }
                    } }
                />
            </div>
            {tags ? (
                <div className="flex flex-wrap w-full h-auto gap-2">
                    {tags.map((tag, index) => (    
                        <div  key={index} className="flex justify-center items-center gap-2 p-2 w-auto h-auto rounded-md border-solid border-2 border-[#b5179e] text-[#b5179e]">
                            <span className="w-full">{tag.name}</span>
                            <button type="button" className="h-auto w-auto"
                                onClick={() => handleRemoveTag(tag.name)}
                            >
                                <i className="fa-solid fa-x text-sm"></i>
                            </button>
                            
                        </div>
                    ))}
                </div>
            ) : (
                <div>...cargando</div>
            )}
            <div className="grid grid-cols-2 w-full h-auto gap-4">
                <h1 className="text-2xl col-span-2 w-full">Informacio EXIF</h1>
                <div className="w-full col-span-2">
                    <Input type="text" name='camera' placeholder="Camara" register={register} errors={errors} classNameStyle="w-full"/>
                </div>
                <div className="w-full col-span-2">
                    <Input type="text" name='lens' placeholder="lente" register={register} errors={errors} classNameStyle="w-full"/>
                </div>
                <div className="w-full">
                    <Input type="number" name='focal_length' placeholder="Distancia focal" register={register} errors={errors} classNameStyle="w-full"/>
                </div>
                <div className="w-full">
                    <Input type="number" name='shutter_speed' placeholder="velocidad de abturacion" register={register} errors={errors} classNameStyle="w-full" />
                </div>
                <div className="w-full">
                    <Input type="number" name='aperture' placeholder="Apertura" register={register} errors={errors} classNameStyle="w-full" />
                </div>
                <div className="w-full ">
                    <Input type="number" name='iso' placeholder="ISO" register={register} errors={errors} classNameStyle="w-full" />
                </div>
            </div>      
            <Input label='Es gratis?' type="checkbox" name='is_free' isChecked={isFree}
                register={register}
                errors={errors}
            />
            {isFree === false && (
                <Input type="number" name='precio' label='Precio de la fotografia' placeholder='Ingrese precio de su foto'
                    register={register}
                    errors={errors}
                    validationRules={{
                        parent:{
                            min: { value: 0, message: "El precio no puede ser negativo" },
                            message: 'Formato de email incorrecto'
                        }
                    }}
                /> 
            )}
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
        </>
    )
}
FormEditPhoto.propTypes = {
    photoData: PropTypes.object.isRequired, // Requiere los datos actuales de la fotografía
}