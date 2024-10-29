import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import routes from '../constant/routesConfig'; 
import { Suspense } from "react";
import PrivateRoute from './PrivateRoute';

const router = createBrowserRouter([
    {
        path: '/', 
        element: <App />,
        children: [
          ...routes.map(route => ({
            path: route.path,
            element: route.isProtected ? (
              <PrivateRoute element={<Suspense fallback={<div>Loading...</div>}>{route.element}</Suspense>} />
            ) : (
              <Suspense fallback={<div>Loading...</div>}>{route.element}</Suspense>
            ),
          }))
        ]
    },
])

export default router;