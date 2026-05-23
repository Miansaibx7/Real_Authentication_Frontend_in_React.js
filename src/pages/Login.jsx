import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import api from "../api/axios";
import Loader from "../components/Loader";
import AuthSlider from "../components/AuthSlider";

export default function Login() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        remember: false,
    });

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const response = await api.post("/login/", formData);

            localStorage.setItem("access", response.data.access);

            localStorage.setItem("refresh", response.data.refresh);

            navigate("/dashboard");

        } catch (error) {

            alert("Invalid Credentials");
        }

        setLoading(false);
    };

    return (

        <div className="min-h-screen flex bg-slate-950">

            <AuthSlider
                title="Welcome Back."
                subtitle="Login to continue your professional SaaS platform."
            />

            <div className="flex-1 flex justify-center items-center px-5">

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900 border border-slate-800 p-10 rounded-3xl shadow-2xl w-full max-w-md"
                >

                    <h2 className="text-4xl font-black text-white mb-2">
                        Login
                    </h2>

                    <p className="text-slate-400 mb-8">
                        Continue your journey.
                    </p>

                    <form onSubmit={handleSubmit}>

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={handleChange}
                            className="w-full p-4 rounded-xl bg-slate-800 text-white mb-4 outline-none"
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            className="w-full p-4 rounded-xl bg-slate-800 text-white mb-4 outline-none"
                        />

                        <div className="flex justify-between mb-6 text-white text-sm">

                            <label className="flex gap-2 items-center">
                                <input type="checkbox" name="remember" onChange={handleChange} />
                                Remember me
                            </label>

                            <Link to="/forgot-password" className="text-green-400">
                                Forgot Password?
                            </Link>

                        </div>

                        <button className="w-full bg-green-500 hover:bg-green-600 transition-all text-white p-4 rounded-xl font-bold">
                            {loading ? <Loader /> : "Login"}
                        </button>

                    </form>

                    <p className="text-slate-400 mt-6 text-center">

                        Don't have account?

                        <Link to="/register" className="text-green-400 ml-2">
                            Register
                        </Link>

                    </p>

                </motion.div>

            </div>

        </div>
    );
}