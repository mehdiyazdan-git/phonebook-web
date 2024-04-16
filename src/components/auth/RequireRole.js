import {Navigate, Outlet, useLocation} from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RequireRole = ({ roles }) => {
    const auth = useAuth();
    const location = useLocation();

    if (!auth?.role || !roles.includes(auth.role)) {
        return <Navigate to="admin/access-denied" state={{ from: location }} replace />;
    }
    return <Outlet />;
};
export default RequireRole;
