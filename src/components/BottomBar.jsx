export default function BottomBar() {
    return (
        <footer className="bg-white/80 border-t border-[#A7F3D0]/30 py-4 text-center text-sm text-gray-600 mt-auto">
            © {new Date().getFullYear()} SaaS Dashboard — All rights reserved.
        </footer>
    );
}