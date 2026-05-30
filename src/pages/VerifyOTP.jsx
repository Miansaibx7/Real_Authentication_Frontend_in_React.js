import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

import Loader from "../components/Loader";
import InputField from "../components/InputField";
import ErrorMessage from "../components/ErrorMessage";

export default function VerifyOTP() {

    const navigate = useNavigate();

    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const email = localStorage.getItem("email");

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);
        setError("");

        try {

            await api.post("/verify-otp/", {
                email,
                code,
            });

            setSuccess("Account verified successfully");

            setTimeout(() => {
                navigate("/");
            }, 2000);

        } catch (error) {

            setError(
                error.response?.data?.error ||
                "Invalid OTP"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex justify-center items-center px-5">

            <div className="bg-slate-900 border border-slate-800 p-10 rounded-3xl w-full max-w-md">

                <h1 className="text-4xl text-white font-black mb-3">
                    Verify OTP
                </h1>

                <p className="text-slate-400 mb-6">
                    Enter OTP sent to your email.
                </p>

                <ErrorMessage message={error} />

                {success && (
                    <div className="bg-green-500/10 border border-green-500 text-green-400 p-4 rounded-xl mb-5 text-sm">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <InputField
                        type="text"
                        name="code"
                        placeholder="Enter OTP"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-500 hover:bg-green-600 transition-all text-white p-4 rounded-xl font-bold flex justify-center items-center h-14"
                    >
                        {loading ? <Loader /> : "Verify OTP"}
                    </button>

                </form>

            </div>

        </div>
    );
}