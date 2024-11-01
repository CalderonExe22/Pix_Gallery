import { useForm } from "react-hook-form";
import Input from "../Input/Input";
import style from './FormPhotography.module.css'
import axiosApi from "../../services/axiosApi";
import { useNavigate } from "react-router-dom";
export default function FormPhotography({image}) {
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState:{errors},
        watch
    } = useForm({
        defaultValues:{
            title:'',
            description:'',
            is_free : true,
            is_public:true,
            image:null,
            precio:0
        }
    })

    const isFree = watch('is_free', true)

    const onSubmit = async (data) => {
        data.image = image

        const dataPhoto = new FormData();
        dataPhoto.append('title', data.title);
        dataPhoto.append('description', data.description);
        dataPhoto.append('image', data.image);
        dataPhoto.append('precio', data.precio); 
        dataPhoto.append('is_free', data.is_free); 
        dataPhoto.append('is_public', data.is_public); 
        
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

    return (
        <form className="flex flex-col gap-5 w-2/3 ms-20 me-20 text-lg" onSubmit={handleSubmit(onSubmit)}>
            <Input 
                type="text"
                name='title'
                label='Titulo de la fotografia'
                placeholder='Ingrese titulo de su foto'
                required={true}
                register={register}
                errors={errors}
                classNameStyle={style.inputs}
            />
            <Input 
                type="text"
                name='description'
                label='Descripción de la fotografia'
                placeholder='Ingrese titulo de su foto'
                required={true}
                register={register}
                errors={errors}
                classNameStyle={style.inputs}
            />
            <Input 
                label='Es gratis?'
                type="checkbox"
                name='is_free'
                isChecked={isFree}
                required={true}
                register={register}
                errors={errors}
            />
            {isFree === false && (
                <Input 
                    type="number"
                    name='precio'
                    label='Precio de la fotografia'
                    placeholder='Ingrese precio de su foto'
                    required={true}
                    register={register}
                    errors={errors}
                    classNameStyle={style.inputs}
                /> 
            )}
            <button className="p-2 bg-[#b5179e] text-white w-32 font-bold">Subir foto</button>
        </form>
    )
}

