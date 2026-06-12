import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, Search, MapPin, DollarSign, ShoppingCart } from "lucide-react";
import Select from "react-select";
import debounce from "lodash.debounce";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import BottomBar from "../components/BottomBar";
import dashboardApi from "../api/dashboardApi";

export default function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [stats, setStats] = useState({ total_revenue: 0, total_quantity: 0, daily_sales: [] });
    const [trending, setTrending] = useState([]);
    const [productSearch, setProductSearch] = useState("");
    const [productResult, setProductResult] = useState(null);
    const [loading, setLoading] = useState({ stats: false, trending: false, search: false, location: false });

    // Fetch city suggestions from OpenStreetMap
    const fetchCities = useCallback(async (inputValue) => {
        if (!inputValue || inputValue.length < 2) return [];
        setLoading(prev => ({ ...prev, location: true }));
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
                    inputValue
                )}&format=json&addressdetails=1&limit=10&featureclass=city`
            );
            const data = await response.json();
            return data.map((item) => ({
                value: item.display_name.split(",")[0].trim(), // city name only
                label: `${item.display_name.split(",")[0]} (${item.address?.country || "Unknown"})`,
                fullName: item.display_name,
            }));
        } catch (error) {
            console.error("Location search error", error);
            return [];
        } finally {
            setLoading(prev => ({ ...prev, location: false }));
        }
    }, []);

    const loadOptions = useCallback(
        debounce((inputValue, callback) => {
            fetchCities(inputValue).then(options => callback(options));
        }, 500),
        [fetchCities]
    );

    // When location changes, load stats and trending
    useEffect(() => {
        if (selectedLocation) {
            loadStats();
            loadTrending();
        }
    }, [selectedLocation]);

    const loadStats = async () => {
        if (!selectedLocation) return;
        setLoading(prev => ({ ...prev, stats: true }));
        try {
            const res = await dashboardApi.get("/stats/", {
                params: { location: selectedLocation.value, days: 30 }
            });
            setStats(res.data);
        } catch (err) {
            console.error("Stats error", err);
        } finally {
            setLoading(prev => ({ ...prev, stats: false }));
        }
    };

    const loadTrending = async () => {
        if (!selectedLocation) return;
        setLoading(prev => ({ ...prev, trending: true }));
        try {
            const res = await dashboardApi.get("/trending/", {
                params: { location: selectedLocation.value, compare_days: 7, threshold: 1.15 }
            });
            setTrending(res.data.trending_products || []);
        } catch (err) {
            console.error("Trending error", err);
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
                params: { q: productSearch, location: selectedLocation.value }
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
                        // Initial location selection screen
                        <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-[#A7F3D0]/30">
                            <MapPin className="w-16 h-16 text-[#065F46] mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-[#065F46]">Select a location</h2>
                            <p className="text-gray-600 mt-2">Search for any city worldwide to see live trends</p>
                            <div className="mt-6 max-w-md mx-auto">
                                <label htmlFor="location-search-initial" className="sr-only">Search location</label>
                                <Select
                                    id="location-search-initial"
                                    placeholder="Type a city name (e.g., Peshawar, New York)..."
                                    loadOptions={loadOptions}
                                    onChange={(selected) => setSelectedLocation(selected)}
                                    isLoading={loading.location}
                                    isClearable
                                    noOptionsMessage={() => "Type at least 2 characters"}
                                    className="text-left"
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Top bar with location selector + product search */}
                            <div className="flex flex-col md:flex-row gap-4 mb-8">
                                <div className="w-full md:w-72">
                                    <label htmlFor="location-search-main" className="sr-only">Change location</label>
                                    <Select
                                        id="location-search-main"
                                        value={selectedLocation}
                                        placeholder="Change location..."
                                        loadOptions={loadOptions}
                                        onChange={(selected) => setSelectedLocation(selected)}
                                        isLoading={loading.location}
                                        isClearable
                                        noOptionsMessage={() => "Type at least 2 characters"}
                                        className="text-left"
                                    />
                                </div>

                                <form onSubmit={handleProductSearch} className="flex-1 flex gap-2">
                                    <div className="flex-1 flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-[#A7F3D0]/30">
                                        <Search className="w-5 h-5 text-[#065F46]" aria-hidden="true" />
                                        <label htmlFor="product-search" className="sr-only">Search products</label>
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
                                        Trending in {selectedLocation.label}
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