import { useNavigate } from "react-router-dom";

export default function Navbar() {

    const navigate = useNavigate();

    const handleLogout = () => {

        localStorage.clear();
        navigate("/");
    };

    return (
        <nav className="bg-slate-900 border-b border-slate-800 px-8 py-5 flex justify-between items-center">

            <h1 className="text-3xl font-black text-green-400">
                SaaSPro
            </h1>

            <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 transition-all px-5 py-2 rounded-xl text-white font-semibold"
            >
                Logout
            </button>

        </nav>
    );
}