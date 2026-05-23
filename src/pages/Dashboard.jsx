import Navbar from "../components/Navbar";

export default function Dashboard() {

    return (

        <div className="min-h-screen bg-slate-950">

            <Navbar />

            <div className="p-10">

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10">

                    <h1 className="text-5xl text-white font-black">
                        Welcome To SaaS Dashboard 🚀
                    </h1>

                    <p className="text-slate-400 mt-4 text-lg">
                        Your authentication system is working successfully.
                    </p>

                </div>

            </div>

        </div>
    );
}