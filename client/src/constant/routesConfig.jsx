/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import EditProfile from '../pages/Profile/EditProfile/EditProfile'
import Profile from "../pages/Profile/Profile";

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
    },
    {
        path: '/login',
        element:<Login />,
        isProtected: false,
    },
    {
        path: '/register',
        element: <Register />,
        isProtected: false,
    },
    {
        path: '/crear',
        element: <Create />,
        isProtected: true,
    },
    {
        path: '/create-portafolio',
        element: <CreatePortafolio />,
        isProtected: true,
    },
    {
        path: '/portafolio/:id',
        element: <Portafolio />,
        isProtected: true,
    },
    {
        path: '/Perfil',
        element: <Profile />,
        isProtected: true,
    },
    {
        path: '/editar-perfil',
        element: <EditProfile />,
        isProtected: true,
    },
]

export default routes