import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import Input from "../../components/Input/Input";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../features/auth/authThunk";

export default function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm()

    const onSubmit = async (data) => {
        const response = await dispatch(loginUser(data))
        if (loginUser.fulfilled.match(response)) {  
            navigate('/');
            window.location.reload()
        } else {
            console.error('Error en el login:', response.error?.message || 'Error desconocido');
        }
    }

    return (   
        <div className="flex justify-center items-center h-full">
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
        </div> 
    )
}
