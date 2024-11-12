import { createBrowserRouter } from 'react-router-dom';
import App from '../App';  // Ajusta el path según tu estructura
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Create from '../pages/Create/Create';
import Portafolio from '../pages/Portafolio/Portafolio';
import Profile from '../pages/Profile/Profile';
import EditProfile from '../pages/Profile/EditProfile/EditProfile';
import PaymentsHistorial from '../pages/Payment/PaymentsHistorial';
import PaymentSuccess from '../pages/Payment/PaymentSuccess';
import PaymentFailure from '../pages/Payment/PaymentFailure';
import PaymentPending from '../pages/Payment/PaymentPending';
import Upload from '../pages/Photos/Upload';
import ShowPhoto from '../pages/Photos/ShowPhoto/ShowPhoto';
import WishList from '../pages/WishList/WishList';
import UploadPortafolio from '../pages/Portafolio/UploadPortafolio';
import ShowCollection from '../pages/Photos/ShowCollections/ShowCollection';

const router = createBrowserRouter([
    {
        path: '/', 
        element: <App />,
        children : [
            {
                index: true,
                element:<Home />
            },
            {
                path: '/login',
                element:<Login />
            },
            {
                path: '/register',
                element: <Register />
            },
            {
                path: '/crear',
                element: <Create />
            },
            {
                path: '/create-portafolio',
                element: <UploadPortafolio />
            },
            {
                path: '/portafolio/:id',
                element: <Portafolio />
            },
            {
                path:'/payments/success/',
                element: <PaymentSuccess />
            },
            {
                path:'/payments/failure/',
                element: <PaymentFailure />
            },
            {
                path:'/payments/pending/',
                element: <PaymentPending />
            },
            {
                path: '/payments/historial',
                element: <PaymentsHistorial />
            },
            {
                path: '/subir_photo',
                element: <Upload />
            },
            {
                path: '/ver-foto/:id',
                element: <ShowPhoto />
            },
            {
                path: '/wishlist',
                element: <WishList />
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
                path: '/ver-coleccion/:id',
                element: <ShowCollection />
            }
        ]
    },
])

export default router;