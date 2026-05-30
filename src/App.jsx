import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import VerifyOTP from "./pages/VerifyOTP";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import ProtectedRoute from "./auth/ProtectedRoute";

export default function App() {

    return (
        <Routes>

            <Route path="/" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route path="/verify-otp" element={<VerifyOTP />} />

            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/reset-password" element={<ResetPassword />} />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

        </Routes>
    );
}