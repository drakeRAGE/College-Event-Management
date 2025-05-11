import { useSelector } from "react-redux"
import { Outlet, Navigate, useLocation } from "react-router-dom"

export default function PrivateRoute() {
    const { currentUser } = useSelector((state) => state.user)
    const location = useLocation();
    
    const isAdmin = currentUser &&
      currentUser.email === import.meta.env.VITE_ADMIN_EMAIL &&
      currentUser.username === import.meta.env.VITE_ADMIN_USERNAME &&
      currentUser._id === import.meta.env.VITE_ADMIN_ID;

    const isProfileRoute = location.pathname.startsWith('/profile');

    if (!currentUser) return <Navigate to='/sign-in' />;
    
    if (!isAdmin && !isProfileRoute) {
      return <Navigate to='/profile' />;
    }

    return <Outlet />;
}
