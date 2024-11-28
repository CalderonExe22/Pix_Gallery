import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from "react-redux";
import Input from "../../components/Input/Input";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../features/auth/authThunk";
import { toast, ToastContainer, Zoom } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

import style from './FormLogin.module.css'
import {PropTypes} from 'prop-types'
export default function FormLogin({active,hide, show}) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {loading, errorLogin} = useSelector((state) => state.auth)

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm()

    const onSubmit = async (data) => {
        const response = await dispatch(loginUser(data))
        if (loginUser.fulfilled.match(response)) {  
            toast.success("Inicio sesion exitoso, redirigiendo...",{
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Zoom
            })
            setTimeout(() => {
                navigate('/');
                window.location.reload() 
            }, 2000)
        } else {
            console.error('Error en el login:', response.error?.message || 'Error desconocido');
        }
    }

    return (
        <>
        <ToastContainer />
        <div className={`${style.login_section} ${active ? style.active : ''}`}>
            <h1 className={`${active ? 'opacity-1' : 'opacity-70'} text-center font-semibold text-3xl cursor-pointer`} onClick={show}>Iniciar sesion</h1>
            {errorLogin && <p className="text-red-500 text-center mt-10">{errorLogin}</p>}
            <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                    placeholder='Correo electronico'
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
                    placeholder='Contraseña'
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
                <button disabled={loading} className={style.butonLogin} type="submit">{loading ? 'Iniciando...' : 'Iniciar sesión'}</button>
                <div className='mt-5'>
                    <h1>¿Aún no estás en PixGallery? <span onClick={hide} className='font-bold cursor-pointer'>Registrate</span></h1>
                </div>
            </form>
        </div>
        </>
    )
}

FormLogin.propTypes = {
    active: PropTypes.bool,
    show: PropTypes.func,
    hide: PropTypes.func,
}