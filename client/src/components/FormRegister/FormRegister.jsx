import { useForm } from 'react-hook-form'
import Input from "../../components/Input/Input"
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../features/auth/authThunk";
import { useNavigate } from "react-router-dom";
import style from './FormRegister.module.css'
import {PropTypes} from 'prop-types'
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function FormRegister({active,hide,show}) {
    const {loading, errorRegister} = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { 
        register,
        getValues,
        handleSubmit, 
        formState: {errors} 
    } = useForm();

    const onSubmit = async (data) => {
        const response = await dispatch(registerUser(data))
        if(registerUser.fulfilled.match(response)){
            toast.success("Registro exitoso, redirigiendo...")
            navigate('/')
            window.location.reload()
        }
    }

    return (
        <div className={style.register_section}>
            <h1 className={`${active ? 'opacity-1' : 'opacity-70'} text-center font-semibold text-3xl cursor-pointer`} onClick={hide}>Registrarse</h1>
            {errorRegister && <p className="text-red-500 text-center my-4">{errorRegister}</p>}
            <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                    placeholder='Nombre de usuario'
                    type="text"
                    name="username"
                    register={register}
                    errors={errors} 
                    required='Ingrese un nombre de usuario'
                />
                <Input
                    placeholder='Correo electronico'
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
                    placeholder='Contraseña'
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
                    placeholder='Repetir contraseña'
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
                <button disabled={loading} className={style.butonRegister} type="submit">{loading ? 'Iniciando...' : 'Registrarse'}</button>
            </form>
            <div className='mt-5'>
                <h1>¿Ya eres miembro? <span onClick={show} className='cursor-pointer font-bold'>Iniciar sesión</span></h1>
            </div>
        </div>
    )
}

FormRegister.propTypes = {
    hide: PropTypes.func,
    show: PropTypes.func,
    active: PropTypes.bool
}