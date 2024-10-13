import { Navigate } from "react-router-dom"
import PropTypes from 'prop-types';

const ProtectedRoute = ({Component}) =>{
    const isAuthenticated = () => !!localStorage.getItem('accessToken');
    return isAuthenticated() ? Component  : <Navigate to="/login" />;
}

export default ProtectedRoute

ProtectedRoute.PropTypes = {
    Component : PropTypes.elementType
}