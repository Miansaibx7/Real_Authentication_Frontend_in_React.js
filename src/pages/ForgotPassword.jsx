import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

import Loader from "../components/Loader";
import InputField from "../components/InputField";
import ErrorMessage from "../components/ErrorMessage";

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

            localStorage.setItem("reset_email", email);

            setSuccess("OTP sent successfully");

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

    return <div></div>;
}