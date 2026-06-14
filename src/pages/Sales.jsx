import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import BottomBar from "../components/BottomBar";
import dashboardApi from "../api/dashboardApi";
import { format } from "date-fns";

export default function Sales() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dashboardApi.get("/sales/")
            .then(res => setSales(res.data))
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
                        <h1 className="text-2xl font-bold text-[#065F46] mb-4">Sales Records</h1>
                        {loading ? <p>Loading...</p> : sales.length === 0 ? <p>No sales data.</p> : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-[#A7F3D0]/20">
                                        <tr>
                                            <th className="p-3">Product</th>
                                            <th className="p-3">Location</th>
                                            <th className="p-3">Quantity</th>
                                            <th className="p-3">Revenue</th>
                                            <th className="p-3">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sales.map(sale => (
                                            <tr key={sale.id} className="border-b border-gray-100">
                                                <td className="p-3 font-medium">{sale.product_name}</td>
                                                <td className="p-3">{sale.location_name}</td>
                                                <td className="p-3">{sale.quantity}</td>
                                                <td className="p-3">${sale.revenue?.toLocaleString()}</td>
                                                <td className="p-3 text-gray-600">{format(new Date(sale.sale_date), "dd MMM yyyy")}</td>
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