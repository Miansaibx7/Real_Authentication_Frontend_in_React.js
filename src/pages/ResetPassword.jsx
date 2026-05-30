import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

import Loader from "../components/Loader";
import InputField from "../components/InputField";
import ErrorMessage from "../components/ErrorMessage";

export default function ResetPassword() {

    const navigate = useNavigate();

    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const email = localStorage.getItem("reset_email");

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);
        setError("");

        try {

            await api.post("/reset-password/", {
                email,
                code,
                new_password: password,
            });

            setSuccess("Password reset successful");

            setTimeout(() => {
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

    return <div></div>;
}