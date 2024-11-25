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
            children: route.children ?
            route.children.map(child =>  ({
              path: child.path,
              element: child.isProtected ? (
                <PrivateRoute element={<Suspense fallback={<div>Loading...</div>}>{child.element}</Suspense>} />
              ) : (
                <Suspense fallback={<div>Loading...</div>}>{child.element}</Suspense>
              ),
            }))
          : undefined,
          }))
        ]
    },
])

export default router;