import Navbar from "../components/Navbar";

export default function Dashboard() {

    return (
        <div className="min-h-screen bg-slate-950">

            <Navbar />

            <div className="max-w-7xl mx-auto p-10">

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 shadow-xl">

                    <h1 className="text-5xl text-white font-black">
                        Welcome To SaaS Dashboard 🚀
                    </h1>

                    <p className="text-slate-400 mt-5 text-lg">
                        Your authentication system is fully working.
                    </p>

                </div>

                <div className="grid md:grid-cols-3 gap-6 mt-8">

                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
                        <h2 className="text-2xl font-bold text-white mb-3">
                            JWT Authentication
                        </h2>
                        <p className="text-slate-400">
                            Secure token based authentication system.
                        </p>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
                        <h2 className="text-2xl font-bold text-white mb-3">
                            OTP Verification
                        </h2>
                        <p className="text-slate-400">
                            Email verification and password reset system.
                        </p>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
                        <h2 className="text-2xl font-bold text-white mb-3">
                            Protected Routes
                        </h2>
                        <p className="text-slate-400">
                            Professional route protection implementation.
                        </p>
                    </div>

                </div>

            </div>

        </div>
    );
}