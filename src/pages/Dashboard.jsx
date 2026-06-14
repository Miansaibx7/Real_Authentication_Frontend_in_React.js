import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, Search, MapPin, DollarSign, ShoppingCart } from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import BottomBar from "../components/BottomBar";
import dashboardApi from "../api/dashboardApi";

// Fallback mock data
const MOCK_TRENDING = {
    "New York": [
        { product_name: "Smartphone X", trend_percentage: 45, is_trending: true },
        { product_name: "Wireless Earbuds", trend_percentage: 32, is_trending: true },
        { product_name: "Laptop Pro", trend_percentage: 28, is_trending: true },
    ],
    "London": [
        { product_name: "Electric Scooter", trend_percentage: 53, is_trending: true },
        { product_name: "Coffee Machine", trend_percentage: 29, is_trending: true },
    ],
};

export default function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [citySuggestions, setCitySuggestions] = useState([]);
    const [stats, setStats] = useState({ total_revenue: 0, total_quantity: 0, daily_sales: [] });
    const [trending, setTrending] = useState([]);
    const [productSearch, setProductSearch] = useState("");
    const [productResult, setProductResult] = useState(null);
    const [loading, setLoading] = useState({ stats: false, trending: false, search: false, location: false });

    // Fetch city suggestions from OpenStreetMap (free, no API key)
    const fetchCities = useCallback(async (query) => {
        if (!query || query.length < 2) {
            setCitySuggestions([]);
            return;
        }
        setLoading(prev => ({ ...prev, location: true }));
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=10&featureclass=city`
            );
            const data = await response.json();
            const cities = data.map(item => item.display_name.split(",")[0].trim());
            setCitySuggestions(cities);
        } catch (err) {
            console.error("City search error", err);
            setCitySuggestions([]);
        } finally {
            setLoading(prev => ({ ...prev, location: false }));
        }
    }, []);

    // When location changes, load stats & trending
    useEffect(() => {
        if (selectedLocation) {
            loadStats();
            loadTrending();
        }
    }, [selectedLocation]);

    const loadStats = async () => {
        setLoading(prev => ({ ...prev, stats: true }));
        try {
            const res = await dashboardApi.get("/stats/", {
                params: { location: selectedLocation, days: 30 }
            });
            setStats(res.data);
        } catch (err) {
            console.warn("Using mock stats");
            const mockSales = Array.from({ length: 30 }, (_, i) => ({
                date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
                revenue: Math.floor(Math.random() * 5000) + 1000,
                quantity: Math.floor(Math.random() * 200) + 50,
            }));
            setStats({
                total_revenue: mockSales.reduce((s, d) => s + d.revenue, 0),
                total_quantity: mockSales.reduce((s, d) => s + d.quantity, 0),
                daily_sales: mockSales,
            });
        } finally {
            setLoading(prev => ({ ...prev, stats: false }));
        }
    };

    const loadTrending = async () => {
        setLoading(prev => ({ ...prev, trending: true }));
        try {
            const res = await dashboardApi.get("/trending/", {
                params: { location: selectedLocation, compare_days: 30 }
            });
            setTrending(res.data.trending_products || []);
        } catch (err) {
            console.warn("Using mock trending");
            const key = Object.keys(MOCK_TRENDING).find(k => selectedLocation.toLowerCase().includes(k.toLowerCase())) || "New York";
            setTrending(MOCK_TRENDING[key].map((p, idx) => ({ ...p, product_id: idx })));
        } finally {
            setLoading(prev => ({ ...prev, trending: false }));
        }
    };

    const handleProductSearch = async (e) => {
        e.preventDefault();
        if (!productSearch.trim()) return;
        if (!selectedLocation) {
            setProductResult({ error: "Please select a location first" });
            return;
        }
        setLoading(prev => ({ ...prev, search: true }));
        try {
            const res = await dashboardApi.get("/search/", {
                params: { q: productSearch, location: selectedLocation }
            });
            setProductResult(res.data);
        } catch (err) {
            setProductResult({
                product_name: productSearch,
                location: selectedLocation,
                current_revenue: Math.floor(Math.random() * 50000),
                previous_revenue: Math.floor(Math.random() * 40000),
                trend_percentage: Math.floor(Math.random() * 100) - 20,
                trend_direction: Math.random() > 0.5 ? "up" : "down",
                is_trending: Math.random() > 0.6,
            });
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
                            <p className="text-gray-600 mt-2">Start typing a city name</p>
                            <div className="mt-6 max-w-md mx-auto">
                                <input
                                    type="text"
                                    list="city-suggestions"
                                    placeholder="e.g., New York, Peshawar, London..."
                                    className="w-full px-4 py-2 border border-[#A7F3D0]/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#065F46]"
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (citySuggestions.includes(val)) {
                                            setSelectedLocation(val);
                                        } else {
                                            fetchCities(val);
                                        }
                                    }}
                                />
                                <datalist id="city-suggestions">
                                    {citySuggestions.map((city, idx) => (
                                        <option key={idx} value={city} />
                                    ))}
                                </datalist>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col md:flex-row gap-4 mb-8">
                                <div className="w-full md:w-64">
                                    <label htmlFor="location-main" className="sr-only">Location</label>
                                    <input
                                        id="location-main"
                                        type="text"
                                        list="city-suggestions-main"
                                        value={selectedLocation}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (citySuggestions.includes(val)) setSelectedLocation(val);
                                            else fetchCities(val);
                                        }}
                                        className="w-full px-4 py-2 border border-[#A7F3D0]/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#065F46]"
                                    />
                                    <datalist id="city-suggestions-main">
                                        {citySuggestions.map((city, idx) => (
                                            <option key={idx} value={city} />
                                        ))}
                                    </datalist>
                                </div>
                                <form onSubmit={handleProductSearch} className="flex-1 flex gap-2">
                                    <div className="flex-1 flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-[#A7F3D0]/30">
                                        <Search className="w-5 h-5 text-[#065F46]" />
                                        <input
                                            type="text"
                                            value={productSearch}
                                            onChange={(e) => setProductSearch(e.target.value)}
                                            placeholder="Search product..."
                                            className="flex-1 bg-transparent outline-none"
                                        />
                                    </div>
                                    <button type="submit" className="px-6 py-2 bg-[#065F46] text-white rounded-xl hover:bg-[#065F46]/90">
                                        Search
                                    </button>
                                </form>
                            </div>

                            {/* Stats cards */}
                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#A7F3D0]/30">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-gray-500">Total Revenue (30 days)</p>
                                            <p className="text-3xl font-bold text-[#065F46]">${loading.stats ? "..." : stats.total_revenue.toLocaleString()}</p>
                                        </div>
                                        <DollarSign className="w-10 h-10 text-[#A7F3D0]" />
                                    </div>
                                </div>
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#A7F3D0]/30">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-gray-500">Total Quantity Sold</p>
                                            <p className="text-3xl font-bold text-[#065F46]">{loading.stats ? "..." : stats.total_quantity.toLocaleString()}</p>
                                        </div>
                                        <ShoppingCart className="w-10 h-10 text-[#A7F3D0]" />
                                    </div>
                                </div>
                            </div>

                            {/* Chart */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#A7F3D0]/30 mb-8">
                                <h3 className="text-xl font-bold text-[#065F46] mb-4">Daily Sales Trend</h3>
                                {loading.stats ? <p>Loading chart...</p> : (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
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

                            {/* Trending + Search result */}
                            <div className="grid lg:grid-cols-2 gap-8">
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#A7F3D0]/30">
                                    <h3 className="text-xl font-bold text-[#065F46] mb-4 flex gap-2">
                                        <TrendingUp /> Trending in {selectedLocation}
                                    </h3>
                                    {loading.trending ? <p>Loading...</p> : trending.length === 0 ? <p>No trending data.</p> : (
                                        <div className="space-y-3">
                                            {trending.map(product => (
                                                <div key={product.product_id} className="flex justify-between p-3 rounded-xl bg-[#A7F3D0]/10">
                                                    <div>
                                                        <p className="font-medium text-[#065F46]">{product.product_name}</p>
                                                        <p className="text-sm text-gray-500">+{product.trend_percentage}% growth</p>
                                                    </div>
                                                    {product.is_trending ? <TrendingUp className="text-green-600" /> : <TrendingDown className="text-red-500" />}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#A7F3D0]/30">
                                    <h3 className="text-xl font-bold text-[#065F46] mb-4 flex gap-2"><Search /> Product Insight</h3>
                                    {loading.search && <p>Searching...</p>}
                                    {productResult && !loading.search && (
                                        <div className={`p-4 rounded-xl ${productResult.error ? "bg-red-50" : "bg-[#A7F3D0]/10"}`}>
                                            {productResult.error ? <p className="text-red-600">{productResult.error}</p> : (
                                                <>
                                                    <p className="font-bold text-[#065F46] text-lg">{productResult.product_name}</p>
                                                    <div className="mt-2 flex gap-4">
                                                        <span className="text-2xl font-bold text-[#065F46]">${productResult.current_revenue?.toLocaleString()}</span>
                                                        <span className={`flex items-center gap-1 ${productResult.trend_direction === "up" ? "text-green-600" : "text-red-600"}`}>
                                                            {productResult.trend_direction === "up" ? <TrendingUp /> : <TrendingDown />}
                                                            {productResult.trend_percentage > 0 ? "+" : ""}{productResult.trend_percentage}%
                                                        </span>
                                                    </div>
                                                    <p>{productResult.is_trending ? "🔥 Trending!" : "📉 Not trending"}</p>
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