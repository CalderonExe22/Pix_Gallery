import { createBrowserRouter } from 'react-router-dom';
import App from '../App';  // Ajusta el path según tu estructura
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Create from '../pages/Create/Create';
import CreatePortafolio from '../pages/CreatePortafolio/CreatePortafolio';
import Portafolio from '../pages/Portafolio/Portafolio'

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
                path: '/portafolio',
                element: <Portafolio />
            },
        ]
    },
])

export default router;