import { useState } from "react";
import api from "../api/axios";

export default function ForgotPassword() {

    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await api.post("/forgot-password/", { email });

            localStorage.setItem("reset_email", email);

            alert("OTP Sent");

        } catch (error) {

            alert("Error");
        }
    };

    return (

        <div className="min-h-screen flex justify-center items-center bg-slate-950">

            <div className="bg-slate-900 p-10 rounded-3xl w-[450px]">

                <h1 className="text-4xl text-white font-black mb-6">
                    Forgot Password
                </h1>

                <form onSubmit={handleSubmit}>

                    <input
                        type="email"
                        placeholder="Enter Email"
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-4 rounded-xl bg-slate-800 text-white mb-6"
                    />

                    <button className="w-full bg-green-500 p-4 rounded-xl text-white font-bold">
                        Send OTP
                    </button>

                </form>

            </div>

        </div>
    );
}