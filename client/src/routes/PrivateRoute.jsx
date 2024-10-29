import { Navigate } from "react-router-dom";
import { PropTypes } from "prop-types";
import { useSelector } from "react-redux";

export default function PrivateRoute({ element }) {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
    return isAuthenticated ? element : <Navigate to="/login" replace />;
}

PrivateRoute.propTypes={
    element : PropTypes.element.isRequired,
}
