import { createBrowserRouter } from 'react-router-dom';
import App from '../App';  // Ajusta el path según tu estructura
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Create from '../pages/Create/Create';
import CreatePortafolio from '../pages/CreatePortafolio/CreatePortafolio';
import Portafolio from '../pages/Portafolio/Portafolio';
import Profile from '../pages/Profile/Profile';
import EditProfile from '../pages/Profile/EditProfile/EditProfile';
import Payments from '../pages/Payment/Payments';

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
                element: <CreatePortafolio />
            },
            {
                path: '/portafolio/:id',
                element: <Portafolio />
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
            {
                path: '/payments',
                element: <Payments />
            },
        ]
    },
])

export default router;