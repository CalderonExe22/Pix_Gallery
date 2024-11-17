/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import EditProfile from '../pages/Profile/EditProfile/EditProfile'
import Profile from "../pages/Profile/Profile";
import Upload from "../pages/Photos/Upload";
import ShowPhoto from "../pages/Photos/showPhoto/showPhoto";
import UploadPortafolio from "../pages/Portafolio/uploadPortafolio";
import ShowCollection from "../pages/Photos/ShowCollections/ShowCollection";
import Notifications from "../pages/notifications/Notifications";
const Home = lazy(()=> import('../pages/Home/Home'))
const Login = lazy(()=> import('../pages/Login/Login'))
const Register = lazy(()=> import('../pages/Register/Register'))
const Create = lazy(()=> import('../pages/Create/Create'))
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
        element: <UploadPortafolio />,
        isProtected: true,
    },
    {
        path: '/portafolio/:id',
        element: <Portafolio />,
        isProtected: true,
    },
    {
        path: '/perfil/:id',
        element: <Profile />,
        isProtected: true,
    },
    {
        path: '/editar-perfil/:id',
        element: <EditProfile />,
        isProtected: true,
    },
    {
        path: '/subir-foto',
        element: <Upload />,
        isProtected: true,
    },
    {
        path: '/ver-foto/:id',
        element: <ShowPhoto />,
        isProtected: true,
    },
    {
        path: '/ver-coleccion/:id',
        element: <ShowCollection />,
        isProtected: true,
    },
    {
        path: '/notificaciones',
        element: <Notifications />,
        isProtected: true,
    },
]

export default routes