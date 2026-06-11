import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

import Loader from "../components/Loader";
import InputField from "../components/InputField";
import ErrorMessage from "../components/ErrorMessage";
import AuthLayout from "../components/AuthLayout";

export default function ForgotPassword() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);
        setError("");

        try {

            await api.post("/forgot-password/", {
                email,
            });

            localStorage.setItem(
                "reset_email",
                email
            );

            setSuccess(
                "OTP sent successfully"
            );

            setTimeout(() => {
                navigate("/reset-password");
            }, 2000);

        } catch (error) {

            setError(
                error.response?.data?.error ||
                "Failed to send OTP"
            );

        } finally {

            setLoading(false);
        }
    };

    return (

        <AuthLayout
            title="Forgot Password"
            subtitle="Receive a secure OTP to reset your password."
        >

            <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">

                <h2 className="text-4xl font-black text-[#065F46] mb-2">
                    Forgot Password
                </h2>

                <p className="text-gray-500 mb-8">
                    Enter your email address.
                </p>

                <ErrorMessage message={error} />

                {success && (
                    <div className="bg-green-100 border border-green-500 text-green-700 p-4 rounded-xl mb-5">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <InputField
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#065F46] hover:bg-[#047857] text-white p-4 rounded-xl font-bold flex justify-center items-center h-14"
                    >
                        {loading
                            ? <Loader />
                            : "Send OTP"}
                    </button>

                </form>

            </div>

        </AuthLayout>
    );
}