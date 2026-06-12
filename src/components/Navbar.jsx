import { Menu } from "lucide-react";

export default function Navbar({ onMenuClick }) {
    return (
        <nav className="bg-white/80 backdrop-blur-sm border-b border-[#A7F3D0]/30 px-6 py-4 flex justify-between items-center sticky top-0 z-30">
            <button
                onClick={onMenuClick}
                className="lg:hidden p-2 rounded-lg hover:bg-[#A7F3D0]/20 transition"
                aria-label="Open menu"          // ✅ add this
                title="Open menu"               // optional tooltip
            >
                <Menu className="w-6 h-6 text-[#065F46]" />
            </button>

            <div className="flex items-center gap-4 ml-auto">
                <div className="w-10 h-10 rounded-full bg-[#065F46] text-[#FFF8E7] flex items-center justify-center font-bold shadow-md">
                    JD
                </div>
            </div>
        </nav>
    );
}