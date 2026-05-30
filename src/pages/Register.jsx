import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import api from "../api/axios";

import Loader from "../components/Loader";
import AuthLayout from "../components/AuthLayout";
import InputField from "../components/InputField";
import ErrorMessage from "../components/ErrorMessage";

export default function Register() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirm_password: "",
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
        setSuccess("");

        try {

            await api.post(
                "/register/",
                formData
            );

            localStorage.setItem(
                "email",
                formData.email
            );

            setSuccess(
                "Registration successful. OTP sent to your email."
            );

            setTimeout(() => {
                navigate("/verify-otp");
            }, 2000);

        } catch (error) {

            setError(
                error.response?.data?.email?.[0] ||
                error.response?.data?.password?.[0] ||
                error.response?.data?.confirm_password?.[0] ||
                error.response?.data?.error ||
                error.response?.data?.non_field_errors?.[0] ||
                "Registration failed"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Create Account"
            subtitle="Secure modern SaaS authentication system with OTP verification."
        >

            <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-slate-900 border border-slate-800 p-10 rounded-3xl shadow-2xl w-full max-w-md"
            >

                <h2 className="text-4xl font-black text-white mb-2">
                    Register
                </h2>

                <p className="text-slate-400 mb-8">
                    Create your professional account.
                </p>

                <ErrorMessage message={error} />

                {success && (
                    <div className="bg-green-500/10 border border-green-500 text-green-400 p-4 rounded-xl mb-5 text-sm">
                        {success}
                    </div>
                )}

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

                    <InputField
                        type="password"
                        name="confirm_password"
                        placeholder="Confirm Password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-500 hover:bg-green-600 transition-all text-white p-4 rounded-xl font-bold flex justify-center items-center h-14"
                    >
                        {loading ? <Loader /> : "Register"}
                    </button>

                </form>

                <p className="text-slate-400 mt-6 text-center">
                    Already have an account?

                    <Link
                        to="/"
                        className="text-green-400 ml-2"
                    >
                        Login
                    </Link>
                </p>

            </motion.div>

        </AuthLayout>
    );
}