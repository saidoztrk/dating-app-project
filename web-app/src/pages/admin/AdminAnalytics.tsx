import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

interface AnalyticsData {
    overview: {
        totalUsers: number;
        activeUsers: number;
        premiumUsers: number;
        totalMatches: number;
        totalMessages: number;
        totalRevenue: number;
    };
    userGrowth: { date: string; users: number }[];
    genderDistribution: { name: string; value: number }[];
    premiumStats: { tier: string; count: number; revenue: number }[];
    matchStats: { date: string; matches: number; messages: number }[];
    ageDistribution: { range: string; count: number }[];
}

const COLORS = ['#3B82F6', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'];

export default function AdminAnalytics() {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('7days');
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    useEffect(() => {
        fetchAnalytics();
    }, [timeRange]);

    // Auto-refresh every 30 seconds
    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(() => {
            fetchAnalytics();
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, [autoRefresh, timeRange]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`http://localhost:5000/api/admin/analytics?range=${timeRange}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAnalytics(response.data);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const exportToCSV = () => {
        if (!analytics) return;

        const csvData = [
            ['Metric', 'Value'],
            ['Total Users', analytics.overview.totalUsers],
            ['Active Users', analytics.overview.activeUsers],
            ['Premium Users', analytics.overview.premiumUsers],
            ['Total Matches', analytics.overview.totalMatches],
            ['Total Messages', analytics.overview.totalMessages],
            ['Total Revenue', analytics.overview.totalRevenue]
        ];

        const csv = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const formatTimeAgo = (date: Date) => {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        return `${hours}h ago`;
    };

    if (loading && !analytics) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-pink-500 mx-auto"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                    </div>
                    <p className="mt-6 text-gray-600 font-medium">Loading analytics...</p>
                    <p className="mt-2 text-gray-400 text-sm">Crunching the numbers</p>
                </div>
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center bg-white rounded-xl shadow-lg p-8 max-w-md">
                    <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Failed to Load Analytics</h3>
                    <p className="text-gray-600 mb-6">We couldn't fetch the analytics data. Please try again.</p>
                    <button
                        onClick={fetchAnalytics}
                        className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition font-medium"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY'
        }).format(amount);
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('tr-TR').format(num);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Header with Controls */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
                            <p className="text-gray-600 mt-1">Real-time insights and metrics</p>
                            <p className="text-sm text-gray-400 mt-1">
                                Last updated: {formatTimeAgo(lastUpdated)}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            {/* Auto Refresh Toggle */}
                            <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-pink-300 transition">
                                <input
                                    type="checkbox"
                                    checked={autoRefresh}
                                    onChange={(e) => setAutoRefresh(e.target.checked)}
                                    className="w-4 h-4 text-pink-500 rounded focus:ring-pink-500"
                                />
                                <span className="text-sm font-medium text-gray-700">Auto-refresh</span>
                            </label>

                            {/* Time Range Selector */}
                            <select
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}
                                className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-700 font-medium"
                            >
                                <option value="7days">Last 7 Days</option>
                                <option value="30days">Last 30 Days</option>
                                <option value="90days">Last 90 Days</option>
                                <option value="all">All Time</option>
                            </select>

                            {/* Refresh Button */}
                            <button
                                onClick={fetchAnalytics}
                                disabled={loading}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2 disabled:opacity-50"
                            >
                                <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span className="hidden sm:inline">Refresh</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Total Users Card */}
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition transform hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-gray-500 text-sm font-medium">Total Users</p>
                                    <div className="group relative">
                                        <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                            All registered users
                                        </div>
                                    </div>
                                </div>
                                <p className="text-3xl font-bold text-gray-800">
                                    {formatNumber(analytics.overview.totalUsers)}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-sm text-green-600 font-medium">
                                        {formatNumber(analytics.overview.activeUsers)} active
                                    </span>
                                </div>
                            </div>
                            <div className="bg-blue-100 rounded-full p-4">
                                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Total Matches Card */}
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-pink-500 hover:shadow-lg transition transform hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="text-gray-500 text-sm font-medium mb-1">Total Matches</p>
                                <p className="text-3xl font-bold text-gray-800">
                                    {formatNumber(analytics.overview.totalMatches)}
                                </p>
                                <p className="text-sm text-gray-600 mt-2">
                                    {formatNumber(analytics.overview.totalMessages)} messages
                                </p>
                            </div>
                            <div className="bg-pink-100 rounded-full p-4">
                                <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Premium Users Card */}
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition transform hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="text-gray-500 text-sm font-medium mb-1">Premium Users</p>
                                <p className="text-3xl font-bold text-gray-800">
                                    {formatNumber(analytics.overview.premiumUsers)}
                                </p>
                                <p className="text-sm text-purple-600 font-medium mt-2">
                                    {formatCurrency(analytics.overview.totalRevenue)} revenue
                                </p>
                            </div>
                            <div className="bg-purple-100 rounded-full p-4">
                                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* User Growth Chart */}
                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-800">User Growth</h2>
                            <div className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                                Trend
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={analytics.userGrowth}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="date"
                                    stroke="#888"
                                    style={{ fontSize: '12px' }}
                                    tick={{ fill: '#666' }}
                                />
                                <YAxis
                                    stroke="#888"
                                    style={{ fontSize: '12px' }}
                                    tick={{ fill: '#666' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="users"
                                    stroke="#3B82F6"
                                    strokeWidth={3}
                                    dot={{ fill: '#3B82F6', r: 5, strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 7 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Gender Distribution */}
                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Gender Distribution</h2>
                            <div className="bg-pink-100 text-pink-700 text-xs font-semibold px-3 py-1 rounded-full">
                                Demographics
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={analytics.genderDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={(entry: any) => `${entry.name}: ${((entry.value / analytics.genderDistribution.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {analytics.genderDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Match & Message Activity */}
                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Match & Message Activity</h2>
                            <div className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                                Engagement
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={analytics.matchStats}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="date"
                                    stroke="#888"
                                    style={{ fontSize: '12px' }}
                                />
                                <YAxis
                                    stroke="#888"
                                    style={{ fontSize: '12px' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="matches"
                                    stroke="#EC4899"
                                    strokeWidth={2}
                                    name="Matches"
                                    dot={{ fill: '#EC4899', r: 4 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="messages"
                                    stroke="#10B981"
                                    strokeWidth={2}
                                    name="Messages"
                                    dot={{ fill: '#10B981', r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Premium Subscriptions */}
                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Premium Subscriptions</h2>
                            <div className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
                                Revenue
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analytics.premiumStats}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="tier"
                                    stroke="#888"
                                    style={{ fontSize: '12px' }}
                                />
                                <YAxis
                                    stroke="#888"
                                    style={{ fontSize: '12px' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="count" fill="#8B5CF6" name="Subscribers" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Age Distribution */}
                    <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2 hover:shadow-lg transition">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Age Distribution</h2>
                            <div className="bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">
                                Demographics
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analytics.ageDistribution}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="range"
                                    stroke="#888"
                                    style={{ fontSize: '12px' }}
                                />
                                <YAxis
                                    stroke="#888"
                                    style={{ fontSize: '12px' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="count" fill="#F59E0B" name="Users" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Export & Actions */}
                <div className="mt-8 flex flex-wrap justify-between items-center gap-4 bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Data synced successfully</span>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={exportToCSV}
                            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2 font-medium shadow-md hover:shadow-lg"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export CSV
                        </button>

                        <button
                            onClick={() => window.print()}
                            className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition flex items-center gap-2 font-medium shadow-md hover:shadow-lg"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            Print Report
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}