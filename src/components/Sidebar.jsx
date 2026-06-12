import { BarChart3, Package, Globe, ShoppingCart, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const navItems = [
    { name: "Dashboard", icon: BarChart3, href: "/dashboard" },
    { name: "Products", icon: Package, href: "/products" },
    { name: "Locations", icon: Globe, href: "/locations" },
    { name: "Sales", icon: ShoppingCart, href: "/sales" },
];

export default function Sidebar({ isOpen, onClose }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`
                fixed top-0 left-0 h-full w-72 bg-[#065F46] text-white z-50
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
                flex flex-col shadow-xl
            `}>
                <div className="p-6 border-b border-[#A7F3D0]/20">
                    <h1 className="text-2xl font-bold tracking-tight">
                        SaaS<span className="text-[#A7F3D0]">Dash</span>
                    </h1>
                    <p className="text-[#A7F3D0]/70 text-sm mt-1">Analytics Platform</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#A7F3D0]/10 transition-colors"
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.name}</span>
                        </a>
                    ))}
                </nav>

                <div className="p-4 border-t border-[#A7F3D0]/20">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-[#A7F3D0]/10 transition-colors"
                        aria-label="Logout"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}