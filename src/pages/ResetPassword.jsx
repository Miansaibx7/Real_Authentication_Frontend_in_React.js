import { useState } from "react";
import api from "../api/axios";

export default function ResetPassword() {

    const [code, setCode] = useState("");

    const [password, setPassword] = useState("");

    const email = localStorage.getItem("reset_email");

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await api.post("/reset-password/", {
                email,
                code,
                new_password: password,
            });

            alert("Password Reset Successful");

        } catch (error) {

            alert("Error");
        }
    };

    return (

        <div className="min-h-screen flex justify-center items-center bg-slate-950">

            <div className="bg-slate-900 p-10 rounded-3xl w-[450px]">

                <h1 className="text-4xl text-white font-black mb-6">
                    Reset Password
                </h1>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        placeholder="OTP"
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full p-4 rounded-xl bg-slate-800 text-white mb-4"
                    />

                    <input
                        type="password"
                        placeholder="New Password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-4 rounded-xl bg-slate-800 text-white mb-6"
                    />

                    <button className="w-full bg-green-500 p-4 rounded-xl text-white font-bold">
                        Reset Password
                    </button>

                </form>

            </div>

        </div>
    );
}