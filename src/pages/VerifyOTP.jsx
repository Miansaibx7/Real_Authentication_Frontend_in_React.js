import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

export default function VerifyOTP() {

    const navigate = useNavigate();

    const [code, setCode] = useState("");

    const email = localStorage.getItem("email");

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await api.post("/verify-otp/", {
                email,
                code,
            });

            navigate("/");

        } catch (error) {

            alert("Invalid OTP");
        }
    };

    return (

        <div className="min-h-screen flex justify-center items-center bg-slate-950">

            <div className="bg-slate-900 p-10 rounded-3xl w-[450px]">

                <h1 className="text-4xl text-white font-black mb-6">
                    Verify OTP
                </h1>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full p-4 rounded-xl bg-slate-800 text-white mb-6"
                    />

                    <button className="w-full bg-green-500 p-4 rounded-xl text-white font-bold">
                        Verify
                    </button>

                </form>

            </div>

        </div>
    );
}