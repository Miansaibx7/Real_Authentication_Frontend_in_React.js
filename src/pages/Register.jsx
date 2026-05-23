import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import api from "../api/axios";
import AuthSlider from "../components/AuthSlider";

export default function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
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

        try {

            await api.post("/register/", formData);

            localStorage.setItem("email", formData.email);

            navigate("/verify-otp");

        } catch (error) {

            alert("Registration Failed");
        }
    };

    return (

        <div className="min-h-screen flex bg-slate-950">

            <AuthSlider
                title="Create Account."
                subtitle="Build your next professional SaaS experience."
            />

            <div className="flex-1 flex justify-center items-center px-5">

                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-slate-900 border border-slate-800 p-10 rounded-3xl shadow-2xl w-full max-w-md"
                >

                    <h2 className="text-4xl font-black text-white mb-8">
                        Register
                    </h2>

                    <form onSubmit={handleSubmit}>

                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            onChange={handleChange}
                            className="w-full p-4 rounded-xl bg-slate-800 text-white mb-4"
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={handleChange}
                            className="w-full p-4 rounded-xl bg-slate-800 text-white mb-4"
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            className="w-full p-4 rounded-xl bg-slate-800 text-white mb-4"
                        />

                        <input
                            type="password"
                            name="confirm_password"
                            placeholder="Confirm Password"
                            onChange={handleChange}
                            className="w-full p-4 rounded-xl bg-slate-800 text-white mb-6"
                        />

                        <button className="w-full bg-green-500 hover:bg-green-600 p-4 rounded-xl text-white font-bold">
                            Register
                        </button>

                    </form>

                    <p className="text-slate-400 mt-6 text-center">

                        Already have account?

                        <Link to="/" className="text-green-400 ml-2">
                            Login
                        </Link>

                    </p>

                </motion.div>

            </div>

        </div>
    );
}