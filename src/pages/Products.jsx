import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import BottomBar from "../components/BottomBar";
import dashboardApi from "../api/dashboardApi";

export default function Products() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dashboardApi.get("/products/")
            .then(res => setProducts(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-[#FFF8E7] flex flex-col">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 flex flex-col lg:ml-72">
                <Navbar onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 p-6 lg:p-10">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#A7F3D0]/30">
                        <h1 className="text-2xl font-bold text-[#065F46] mb-4">Products</h1>
                        {loading ? <p>Loading...</p> : products.length === 0 ? <p>No products found.</p> : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-[#A7F3D0]/20">
                                        <tr>
                                            <th className="p-3">ID</th>
                                            <th className="p-3">Name</th>
                                            <th className="p-3">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map(p => (
                                            <tr key={p.id} className="border-b border-gray-100">
                                                <td className="p-3">{p.id}</td>
                                                <td className="p-3 font-medium">{p.name}</td>
                                                <td className="p-3 text-gray-600">{p.description || "—"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </main>
                <BottomBar />
            </div>
        </div>
    );
}