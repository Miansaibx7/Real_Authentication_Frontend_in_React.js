import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

import Loader from "../components/Loader";
import InputField from "../components/InputField";
import ErrorMessage from "../components/ErrorMessage";
import AuthLayout from "../components/AuthLayout";

export default function ResetPassword() {

    const navigate = useNavigate();

    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const email =
        localStorage.getItem("reset_email");

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        setError("");

        try {

            await api.post(
                "/reset-password/",
                {
                    email,
                    code,
                    new_password: password,
                }
            );

            setSuccess(
                "Password reset successful"
            );

            setTimeout(() => {

                localStorage.removeItem(
                    "reset_email"
                );

                navigate("/");

            }, 2000);

        } catch (error) {

            setError(
                error.response?.data?.error ||
                "Password reset failed"
            );

        } finally {

            setLoading(false);
        }
    };

    return (

        <AuthLayout
            title="Reset Password"
            subtitle="Enter OTP and create a new password."
        >

            <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">

                <h2 className="text-4xl font-black text-[#065F46] mb-2">
                    Reset Password
                </h2>

                <p className="text-gray-500 mb-8">
                    Enter OTP and new password.
                </p>

                <ErrorMessage message={error} />

                {success && (
                    <div className="bg-green-100 border border-green-500 text-green-700 p-4 rounded-xl mb-5">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <InputField
                        type="text"
                        placeholder="Enter OTP"
                        value={code}
                        onChange={(e) =>
                            setCode(e.target.value)
                        }
                    />

                    <InputField
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#065F46] hover:bg-[#047857] text-white p-4 rounded-xl font-bold flex justify-center items-center h-14"
                    >
                        {loading
                            ? <Loader />
                            : "Reset Password"}
                    </button>

                </form>

            </div>

        </AuthLayout>
    );
}