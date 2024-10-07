import Input from "../../components/Input/Input"
import {useForm} from "react-hook-form"
import axiosApi from "../../services/axiosApi";

export default function Register() {
    const { 
        register,
        getValues,
        handleSubmit, 
        formState: {errors} 
    } = useForm();

    const onSubmit = async (data) => {
        console.log(data)
        try {
            const response = await axiosApi.post('users/register/',{
                username: data.username,
                email: data.email,
                password1: data.password1,
                password2: data.password2
            })
            if(response.status === 201){
                console.log('registro exitoso!!')
            }
        } catch (error) {
            console.log('sucedio un error durante el registro', error)
        }
    }
    
    return (
        <>
            <div>
                <form  className="flex flex-col gap-11 p-20 bg-indigo-300 rounded-xl" onSubmit={handleSubmit(onSubmit)}>
                <h1 className="text-center font-medium text-3xl">Registrarse</h1>
                    <Input
                        label="Nombre de usuario"
                        type="text"
                        name="username"
                        register={register}
                        errors={errors} 
                        required='Ingrese un nombre de usuario'
                    />
                    <Input
                        label="email"
                        name="email"
                        register={register}
                        errors={errors} 
                        required='Ingrese un email'
                        validationRules={{ 
                            pattern:{
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Formato de email incorrecto'
                            }
                        }}
                    />
                    <Input
                        label="Contraseña"
                        type="password"
                        name="password1"
                        register={register}
                        errors={errors}
                        required='Ingrese una contraseña'
                        validationRules={{ 
                            minLength:{
                                value: 8,
                                message:'La contraseña debe contener al menos 8 caracteres'
                            },
                            pattern:{
                                value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                                message: "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número"
                            }
                        }}
                    />
                    <Input
                        label="Repetir contraseña"
                        type="password"
                        name="password2"
                        register={register}
                        errors={errors}
                        required='Por favor, repita la contraseña'
                        validationRules={{ 
                            validate: value =>{
                                const password1 = getValues('password1')
                                return value === password1 || 'Las Contraseñas no coinciden'
                            }
                        }}
                    />
                    <button type="submit">Enviar</button>
                </form>
            </div>
        </>
    )
}
