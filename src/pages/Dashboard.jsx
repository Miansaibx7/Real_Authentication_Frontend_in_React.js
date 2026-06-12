import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, Search, MapPin, DollarSign, ShoppingCart } from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import BottomBar from "../components/BottomBar";
import dashboardApi from "../api/dashboardApi";

export default function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [stats, setStats] = useState({ total_revenue: 0, total_quantity: 0, daily_sales: [] });
    const [trending, setTrending] = useState([]);
    const [productSearch, setProductSearch] = useState("");
    const [productResult, setProductResult] = useState(null);
    const [loading, setLoading] = useState({ stats: false, trending: false, search: false });

    // Fetch available locations on mount
    useEffect(() => {
        dashboardApi.get("/locations/")
            .then(res => setLocations(res.data))
            .catch(err => console.error("Locations error", err));
    }, []);

    // When location changes, load stats and trending
    useEffect(() => {
        if (!selectedLocation) return;
        loadStats();
        loadTrending();
    }, [selectedLocation]);

    const loadStats = async () => {
        setLoading(prev => ({ ...prev, stats: true }));
        try {
            const res = await dashboardApi.get("/stats/", {
                params: { location: selectedLocation, days: 30 }
            });
            setStats(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(prev => ({ ...prev, stats: false }));
        }
    };

    const loadTrending = async () => {
        setLoading(prev => ({ ...prev, trending: true }));
        try {
            const locName = locations.find(l => l.id == selectedLocation)?.name;
            const res = await dashboardApi.get("/trending/", {
                params: { location: locName, compare_days: 7, threshold: 1.15 }
            });
            setTrending(res.data.trending_products || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(prev => ({ ...prev, trending: false }));
        }
    };

    const handleProductSearch = async (e) => {
        e.preventDefault();
        if (!productSearch.trim()) return;
        setLoading(prev => ({ ...prev, search: true }));
        try {
            const locName = locations.find(l => l.id == selectedLocation)?.name;
            const res = await dashboardApi.get("/search/", {
                params: { q: productSearch, location: locName }
            });
            setProductResult(res.data);
        } catch (err) {
            setProductResult({ error: "Product not found" });
        } finally {
            setLoading(prev => ({ ...prev, search: false }));
        }
    };

    const chartData = stats.daily_sales.map(item => ({
        date: format(new Date(item.date), "dd/MM"),
        revenue: parseFloat(item.revenue),
        quantity: item.quantity,
    }));

    return (
        <div className="min-h-screen bg-[#FFF8E7] flex flex-col">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 flex flex-col lg:ml-72">
                <Navbar onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 p-6 lg:p-10">
                    {!selectedLocation ? (
                        <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-[#A7F3D0]/30">
                            <MapPin className="w-16 h-16 text-[#065F46] mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-[#065F46]">Select a location</h2>
                            <p className="text-gray-600 mt-2">Choose from the dropdown below</p>
                            <div className="mt-6 max-w-xs mx-auto">
                                {/* Hidden label for accessibility */}
                                <label htmlFor="location-initial" className="sr-only">
                                    Choose a location to view analytics
                                </label>
                                <select
                                    id="location-initial"
                                    name="location"
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                    className="w-full px-4 py-2 border border-[#A7F3D0]/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#065F46]"
                                    title="Select location"
                                >
                                    <option value="">-- Select location --</option>
                                    {locations.map(loc => (
                                        <option key={loc.id} value={loc.id}>{loc.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Location selector & product search bar */}
                            <div className="flex flex-col md:flex-row gap-4 mb-8">
                                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-[#A7F3D0]/30 shadow-sm">
                                    <MapPin className="w-5 h-5 text-[#065F46]" aria-hidden="true" />
                                    <label htmlFor="location-main" className="sr-only">
                                        Change location
                                    </label>
                                    <select
                                        id="location-main"
                                        name="location"
                                        value={selectedLocation}
                                        onChange={(e) => setSelectedLocation(e.target.value)}
                                        className="bg-transparent text-[#065F46] font-medium focus:outline-none py-2"
                                        title="Select location to filter data"
                                    >
                                        {locations.map(loc => (
                                            <option key={loc.id} value={loc.id}>{loc.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <form onSubmit={handleProductSearch} className="flex-1 flex gap-2">
                                    <div className="flex-1 flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-[#A7F3D0]/30">
                                        <Search className="w-5 h-5 text-[#065F46]" aria-hidden="true" />
                                        <label htmlFor="product-search" className="sr-only">
                                            Search products
                                        </label>
                                        <input
                                            id="product-search"
                                            name="productSearch"
                                            type="text"
                                            value={productSearch}
                                            onChange={(e) => setProductSearch(e.target.value)}
                                            placeholder="Search product by name..."
                                            className="flex-1 bg-transparent outline-none text-gray-800"
                                            aria-label="Product search"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-[#065F46] text-white rounded-xl hover:bg-[#065F46]/90 transition"
                                        title="Search product"
                                        aria-label="Search product"
                                    >
                                        Search
                                    </button>
                                </form>
                            </div>

                            {/* Stats cards */}
                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#A7F3D0]/30">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-500 text-sm">Total Revenue (30 days)</p>
                                            <p className="text-3xl font-bold text-[#065F46] mt-1">
                                                ${loading.stats ? "..." : stats.total_revenue.toLocaleString()}
                                            </p>
                                        </div>
                                        <DollarSign className="w-10 h-10 text-[#A7F3D0]" aria-hidden="true" />
                                    </div>
                                </div>
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#A7F3D0]/30">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-500 text-sm">Total Quantity Sold</p>
                                            <p className="text-3xl font-bold text-[#065F46] mt-1">
                                                {loading.stats ? "..." : stats.total_quantity.toLocaleString()}
                                            </p>
                                        </div>
                                        <ShoppingCart className="w-10 h-10 text-[#A7F3D0]" aria-hidden="true" />
                                    </div>
                                </div>
                            </div>

                            {/* Daily sales chart */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#A7F3D0]/30 mb-8">
                                <h3 className="text-xl font-bold text-[#065F46] mb-4">Daily Sales Trend</h3>
                                {loading.stats ? (
                                    <div className="h-64 flex items-center justify-center">Loading chart...</div>
                                ) : (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                            <XAxis dataKey="date" />
                                            <YAxis yAxisId="left" />
                                            <YAxis yAxisId="right" orientation="right" />
                                            <Tooltip />
                                            <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#065F46" strokeWidth={2} name="Revenue ($)" />
                                            <Line yAxisId="right" type="monotone" dataKey="quantity" stroke="#A7F3D0" strokeWidth={2} name="Quantity" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                )}
                            </div>

                            {/* Two column layout: Trending products + Search result */}
                            <div className="grid lg:grid-cols-2 gap-8">
                                {/* Trending products */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#A7F3D0]/30">
                                    <h3 className="text-xl font-bold text-[#065F46] mb-4 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5" aria-hidden="true" />
                                        Trending in {locations.find(l => l.id == selectedLocation)?.name}
                                    </h3>
                                    {loading.trending ? (
                                        <p className="text-gray-500">Loading trending...</p>
                                    ) : trending.length === 0 ? (
                                        <p className="text-gray-500">No trending products in last 7 days.</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {trending.slice(0, 5).map(product => (
                                                <div key={product.product_id} className="flex items-center justify-between p-3 rounded-xl bg-[#A7F3D0]/10">
                                                    <div>
                                                        <p className="font-medium text-[#065F46]">{product.product_name}</p>
                                                        <p className="text-sm text-gray-500">+{product.trend_percentage}% growth</p>
                                                    </div>
                                                    {product.is_trending ? (
                                                        <TrendingUp className="w-5 h-5 text-green-600" aria-label="Trending up" />
                                                    ) : (
                                                        <TrendingDown className="w-5 h-5 text-red-500" aria-label="Trending down" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Product search result */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#A7F3D0]/30">
                                    <h3 className="text-xl font-bold text-[#065F46] mb-4 flex items-center gap-2">
                                        <Search className="w-5 h-5" aria-hidden="true" />
                                        Product Insight
                                    </h3>
                                    {loading.search && <p className="text-gray-500">Searching...</p>}
                                    {productResult && !loading.search && (
                                        <div className={`p-4 rounded-xl ${productResult.error ? "bg-red-50" : "bg-[#A7F3D0]/10"}`}>
                                            {productResult.error ? (
                                                <p className="text-red-600">{productResult.error}</p>
                                            ) : (
                                                <>
                                                    <p className="font-bold text-[#065F46] text-lg">{productResult.product_name}</p>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        Location: {productResult.location} | Period: {productResult.period_days} days
                                                    </p>
                                                    <div className="mt-3 flex items-center gap-4">
                                                        <span className="text-2xl font-bold text-[#065F46]">
                                                            ${productResult.current_revenue.toLocaleString()}
                                                        </span>
                                                        <span className={`flex items-center gap-1 ${productResult.trend_direction === "up" ? "text-green-600" : "text-red-600"}`}>
                                                            {productResult.trend_direction === "up" ? <TrendingUp className="w-4 h-4" aria-hidden="true" /> : <TrendingDown className="w-4 h-4" aria-hidden="true" />}
                                                            {productResult.trend_percentage > 0 ? "+" : ""}{productResult.trend_percentage}%
                                                        </span>
                                                    </div>
                                                    <p className="text-sm mt-2">
                                                        {productResult.is_trending ? "🔥 This product is trending!" : "📉 Not trending at the moment."}
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </main>
                <BottomBar />
            </div>
        </div>
    );
}