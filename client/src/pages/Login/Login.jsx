import { useForm } from "react-hook-form";
import axiosApi from "../../services/axiosApi";
import Input from "../../components/Input/Input";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm()

    const navigate = useNavigate()

    const onSubmit = async (data) => {
        try {
            const response = await axiosApi.post('users/login/',{
                email: data.email,
                password: data.password
            }) 
            if(response.status === 200){
                localStorage.setItem('accessToken', response.data.tokens.access)
                localStorage.setItem('refreshToken', response.data.tokens.refresh)
                navigate('/')
                window.location.reload()
                console.log('login exitoso!!')
            }
        } catch (error) {
            console.log('error en el login', error)
        }
    }
    return (    
        <form className="flex flex-col gap-11 p-20 bg-indigo-300 rounded-xl" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-center font-medium text-3xl">Iniciar secion</h1>
            <Input
                label="Email"
                type="email"
                name="email"
                register={register}
                errors={errors} 
                required='Este campo es obligatorio'
                validationRules={{
                    parent:{
                        value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                        message: 'Formato de email incorrecto'
                    }
                }}
            />
            <Input
                label="Contraseña"
                type="password"
                name="password"
                register={register}
                errors={errors}
                required='Este campo es obligatorio'
                validationRules={{ 
                    minLength:{
                        value: 8,
                        message: 'La contraseña debe ser mayor a 8 caracteres'
                    }
                }}
            />
            <button type="submit">Enviar</button>
        </form>
    )
}
