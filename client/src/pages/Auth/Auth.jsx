import { useEffect, useState } from 'react';
import style from './Auth.module.css';
import FormRegister from '../../components/FormRegister/FormRegister';
import FormLogin from '../../components/FormLogin/FormLogin';
import { useParams } from 'react-router-dom';

export default function Auth() {
    const { mode } = useParams()
    const [isActive, setIsActive] = useState( mode === 'login' )

    const showFormLogin = () => setIsActive(true)
    const hideFormLogin = () => setIsActive(false)

    useEffect(() => {
        document.title = 'Registro || inicio sesión'
        setIsActive(mode === 'login')
    },[mode])
    
    return (
        <div className={style.container}>
            <FormRegister show={showFormLogin} active={!isActive} hide={hideFormLogin} />
            <FormLogin active={isActive} show={showFormLogin} hide={hideFormLogin}/>
        </div>
    )
}