import { createBrowserRouter } from 'react-router-dom';
import App from '../App';  // Ajusta el path según tu estructura
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';

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
            }
        ]
    },
])

export default router;