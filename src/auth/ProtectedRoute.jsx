import { Navigate } from "react-router-dom";

// a component to protect routes that require authentication
export default function ProtectedRoute({ children }) {

    const token = localStorage.getItem("access");

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return children;
}