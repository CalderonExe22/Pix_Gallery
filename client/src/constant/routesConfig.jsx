/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import EditProfile from '../pages/Profile/EditProfile/EditProfile'
import Profile from "../pages/Profile/Profile";
import Upload from "../pages/Photos/Upload";
import ShowPhoto from "../pages/Photos/showPhoto/showPhoto";
import UploadPortafolio from "../pages/Portafolio/uploadPortafolio";
import ShowCollection from "../pages/Photos/ShowCollections/ShowCollection";
import Notifications from "../pages/notifications/Notifications";
import SearchResults from "../pages/SearchResults/SearchResults";
import ManageAcount from "../pages/Profile/ManageAcount";
import Explore from "../pages/Explore/Explore";
import ExploreCategoryPage from "../components/ExploreResults/ExploreCategoryPage";
const Home = lazy(()=> import('../pages/Home/Home'))
const Login = lazy(()=> import('../pages/Login/Login'))
const Register = lazy(()=> import('../pages/Register/Register'))
const Create = lazy(()=> import('../pages/Create/Create'))
const Portafolio = lazy(()=> import('../pages/Portafolio/Portafolio'))

const accountRoutes = [
    {
        path: 'manage-account',
        element: <ManageAcount />,
        isProtected: true,
        children: [{
                path: 'editar-perfil/:id', 
                element: <EditProfile />, 
                isProtected: true 
            },
        ]
    }
]


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
    {
        path: '/search',
        element: <SearchResults />,
        isProtected: false,
    },
    {
        path: '/explore',
        element: <Explore />,
        isProtected: false,
    },
    {
        path: '/explore/fotosMasLikeadas',
        element: <ExploreCategoryPage 
            endpoint="photos/explore/most_liked"
            title="Fotos más likeadas"
            layoutStyle="grid"
            type={'photos'}
        />,
        isProtected: false,
    },
    {
        path: '/explore/fotosMasVistas',
        element: <ExploreCategoryPage 
            endpoint="photos/explore/most_viewed"
            title="Fotos más vistas"
            layoutStyle="grid"
            type={'photos'}
        />,
        isProtected: false,
    },
    {
        path: '/explore/coleccionesConMasVisitas',
        element: <ExploreCategoryPage 
            endpoint="photos/explore/collections/most-viewed/"
            title="Colecciones con más visitas"
            layoutStyle="grid"
            type={'collections'}
        />,
        isProtected: false,
    },
    {
        path: '/explore/coleccionesConMasLikes',
        element: <ExploreCategoryPage 
            endpoint="photos/explore/collections/most-liked/"
            title="Colecciones con más likes"
            layoutStyle="grid"
            type={'collections'}
        />,
        isProtected: false,
    },
    ...accountRoutes,
]

export default routes