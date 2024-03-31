import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const RequireAuth = () => {
    const auth = useAuth();
    const location = useLocation();

    if (!auth?.accessToken) {
        // Not logged in, redirect to login
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    // Authorized, render the child components
    return <Outlet />;
};

export default RequireAuth;

