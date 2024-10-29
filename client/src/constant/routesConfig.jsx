/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";

const Home = lazy(()=> import('../pages/Home/Home'))
const Login = lazy(()=> import('../pages/Login/Login'))
const Register = lazy(()=> import('../pages/Register/Register'))
const Create = lazy(()=> import('../pages/Create/Create'))
const CreatePortafolio = lazy(()=> import('../pages/CreatePortafolio/CreatePortafolio'))
const Portafolio = lazy(()=> import('../pages/Portafolio/Portafolio'))

const routes = [
    {
        path: '',
        element:<Home />,
        isProtected: false,
        label: 'Inicio'
    },
    {
        path: '/login',
        element:<Login />,
        isProtected: false,
        label: 'Iniciar secion'
    },
    {
        path: '/register',
        element: <Register />,
        isProtected: false,
        label: 'Registrarse'
    },
    {
        path: '/crear',
        element: <Create />,
        isProtected: true,
        label: 'Crear'
    },
    {
        path: '/create-portafolio',
        element: <CreatePortafolio />,
        isProtected: true,
        label: 'Portafolio'
    },
    {
        path: '/portafolio/:id',
        element: <Portafolio />,
        isProtected: true,
        label: 'Portafolio'
    },
]

export default routes