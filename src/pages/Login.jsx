import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import api from "../api/axios";

import Loader from "../components/Loader";
import AuthLayout from "../components/AuthLayout";
import InputField from "../components/InputField";
import ErrorMessage from "../components/ErrorMessage";

export default function Login() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);
        setError("");

        try {

            const response = await api.post(
                "/login/",
                formData
            );

            localStorage.setItem(
                "access",
                response.data.access
            );

            localStorage.setItem(
                "refresh",
                response.data.refresh
            );

            navigate("/dashboard");

        } catch (error) {

            setError(
                error.response?.data?.detail ||
                error.response?.data?.error ||
                "Invalid email or password"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Professional authentication system with secure login and JWT authentication."
        >

            <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-slate-900 border border-slate-800 p-10 rounded-3xl shadow-2xl w-full max-w-md"
            >

                <h2 className="text-4xl font-black text-white mb-2">
                    Login
                </h2>

                <p className="text-slate-400 mb-8">
                    Continue your journey.
                </p>

                <ErrorMessage message={error} />

                <form onSubmit={handleSubmit}>

                    <InputField
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <InputField
                        type="password"
                        name="password"
                        placeholder="Enter Password"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    <Link
                        to="/forgot-password"
                        className="text-green-400 text-sm"
                    >
                        Forgot Password?
                    </Link>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 bg-green-500 hover:bg-green-600 transition-all text-white p-4 rounded-xl font-bold flex justify-center items-center h-14"
                    >
                        {loading ? <Loader /> : "Login"}
                    </button>

                </form>

                <p className="text-slate-400 mt-6 text-center">
                    Don't have an account?

                    <Link
                        to="/register"
                        className="text-green-400 ml-2"
                    >
                        Register
                    </Link>
                </p>

            </motion.div>

        </AuthLayout>
    );
}