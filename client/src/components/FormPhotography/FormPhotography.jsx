import { useForm } from "react-hook-form";
import Input from "../Input/Input";
import style from './FormPhotography.module.css'
import axiosApi from "../../services/axiosApi";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PropTypes from 'prop-types' 
export default function FormPhotography({image}) {
    const navigate = useNavigate()
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([])
    const getTags = async () => {
        try {
            const data = new FormData();
            data.append("image", image)
            const response = await axiosApi.post('imagga/tags/',data)
            if (response.status === 200){
                const filteredTags = response.data.tags.filter(tag => tag.confianza >= 30);
                const finalTags = filteredTags.map(tag => tag.etiqueta);
                setTags(finalTags)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleAddTag = (tag) => {
        if (tag && !tags.includes(tag)) { 
            setTags([...tags, tag])
        }
    }

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
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
        if(image){
            getTags() 
        }
    }, [image])

    const {
        register,
        handleSubmit,
        formState:{errors},
        watch
    } = useForm({
        defaultValues:{
            title:'',
            description:'',
            category:'',
            is_free : true,
            is_public:true,
            image:null,
            precio:0
        }
    })
    const isFree = watch('is_free', true)

    const onSubmit = async (data) => {
        console.log(data)
        data.image = image

        const dataPhoto = new FormData()
        dataPhoto.append('title', data.title)
        dataPhoto.append('description', data.description)
        dataPhoto.append('category', data.category)
        dataPhoto.append('image', data.image)
        dataPhoto.append('precio', data.precio)
        dataPhoto.append('is_free', data.is_free)
        dataPhoto.append('is_public', data.is_public)
        dataPhoto.append('can_notification', true)

        tags.forEach((tag) => {
            dataPhoto.append('tags', tag)
        });

        dataPhoto.append('camera', data.camera || '')
        dataPhoto.append('lens', data.lens || '')
        dataPhoto.append('focal_length', data.focal_length || '')
        dataPhoto.append('shutter_speed', data.shutter_speed || '')
        dataPhoto.append('aperture', data.aperture || '')
        dataPhoto.append('iso', data.iso || '')

        console.log(dataPhoto)
        try {
            const response = await axiosApi.post('photos/photography/', dataPhoto,{
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
            console.log('La fotografía se subió correctamente', response);
            navigate(`/ver-foto/${response.data.id}`)
        } catch (error) {
            console.log('Error al subir la fotografía', error.response ? error.response.data : error.message);
        }
    }
    console.log(tags)
    return (
        <form className="flex flex-col gap-5 w-2/3 ms-20 me-20 text-lg" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-4xl">Subir fotografia</h1>
            <Input type="text" name='title' label='Titulo de la fotografia' placeholder='Ingrese titulo de su foto'required={true}
                register={register}
                errors={errors}
                classNameStyle={style.inputs}
            />
            <Input 
                type="text"name='description'label='Descripción de la fotografia'placeholder='Ingrese titulo de su foto'required={true}
                register={register}
                errors={errors}
                classNameStyle={style.inputs}
            />
            <div className="flex flex-col gap-3">
                <label id="category" htmlFor="category">Seleccione una categoria</label>
                <select 
                    id="category" name="category" {...register('category',{required:true})}
                    required
                    >
                    <option value="">Selecciona una categoría</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
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
                            <span className="w-full">{tag}</span>
                            <button type="button" className="h-auto w-auto"
                                onClick={() => handleRemoveTag(tag)}
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
                <p>(No es obligatoria)</p>
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
                    classNameStyle={style.inputs}
                    validationRules={{
                        parent:{
                            min: { value: 0, message: "El precio no puede ser negativo" },
                            message: 'Formato de email incorrecto'
                        }
                    }}
                /> 
            )}
            <button type="submit" className="p-2 bg-[#b5179e] text-white w-32 font-bold">Subir foto</button>
        </form>
    )
}

FormPhotography.propTypes = {
    image: PropTypes.instanceOf(File),
}