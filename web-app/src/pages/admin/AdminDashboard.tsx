// web-app/src/pages/admin/AdminDashboard.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Stats {
    totalUsers: number;
    newUsersToday: number;
    totalMatches: number;
    activeUsers: number;
    premiumUsers: number;
    pendingReports: number;
    messagesToday: number;
    totalSubscriptions: number;
    totalRevenue: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get('http://localhost:5000/api/admin/dashboard/stats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching stats:', error);
            navigate('/admin/login');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-600 mt-1">Welcome back, Admin!</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Navigation */}
            <nav className="bg-indigo-600 text-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex space-x-8">
                        <a href="/admin/dashboard" className="py-4 border-b-2 border-white font-semibold">
                            Dashboard
                        </a>
                        <a href="/admin/users" className="py-4 hover:border-b-2 border-white">
                            Users
                        </a>
                        <a href="/admin/reports" className="py-4 hover:border-b-2 border-white">
                            Reports
                        </a>
                    </div>
                </div>
            </nav>

            {/* Stats Grid */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Users */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total Users</p>
                                <p className="text-3xl font-bold text-gray-900">{stats?.totalUsers}</p>
                            </div>
                            <div className="text-4xl">👥</div>
                        </div>
                        <p className="text-sm text-green-600 mt-2">
                            +{stats?.newUsersToday} today
                        </p>
                    </div>

                    {/* Active Users */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Active Users</p>
                                <p className="text-3xl font-bold text-gray-900">{stats?.activeUsers}</p>
                            </div>
                            <div className="text-4xl">🟢</div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">Last 7 days</p>
                    </div>

                    {/* Total Matches */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total Matches</p>
                                <p className="text-3xl font-bold text-gray-900">{stats?.totalMatches}</p>
                            </div>
                            <div className="text-4xl">💕</div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">All time</p>
                    </div>

                    {/* Premium Users */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Premium Users</p>
                                <p className="text-3xl font-bold text-gray-900">{stats?.premiumUsers}</p>
                            </div>
                            <div className="text-4xl">💎</div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">Active subscriptions</p>
                    </div>

                    {/* Messages Today */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Messages Today</p>
                                <p className="text-3xl font-bold text-gray-900">{stats?.messagesToday}</p>
                            </div>
                            <div className="text-4xl">💬</div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">Last 24 hours</p>
                    </div>

                    {/* Pending Reports */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Pending Reports</p>
                                <p className="text-3xl font-bold text-gray-900">{stats?.pendingReports}</p>
                            </div>
                            <div className="text-4xl">🚨</div>
                        </div>
                        <p className="text-sm text-yellow-600 mt-2">Needs review</p>
                    </div>

                    {/* Total Revenue */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total Revenue</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    ${stats?.totalRevenue.toFixed(2)}
                                </p>
                            </div>
                            <div className="text-4xl">💰</div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            {stats?.totalSubscriptions} subscriptions
                        </p>
                    </div>

                    {/* New Users Today */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">New Today</p>
                                <p className="text-3xl font-bold text-gray-900">{stats?.newUsersToday}</p>
                            </div>
                            <div className="text-4xl">✨</div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">New registrations</p>
                    </div>
                </div>
            </main>
        </div>
    );
}