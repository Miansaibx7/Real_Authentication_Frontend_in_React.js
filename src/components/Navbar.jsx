import { Link } from "react-router-dom";

export default function Navbar() {

    return (
        <nav className="bg-slate-900 border-b border-slate-800 px-10 py-5 flex justify-between items-center">

            <h1 className="text-3xl font-black text-green-400">
                SaaSPro
            </h1>

            <div className="flex gap-6 text-white">

                <Link to="/dashboard">Dashboard</Link>

                <Link to="/">Logout</Link>

            </div>

        </nav>
    );
}