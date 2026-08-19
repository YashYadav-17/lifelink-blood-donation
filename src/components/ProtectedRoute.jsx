import{Navigate,useLocation}from'react-router-dom';import{isAdmin}from'../utils/storage'
export default function ProtectedRoute({children}){const location=useLocation();return isAdmin()?children:<Navigate to="/login" replace state={{from:location.pathname}}/>}
