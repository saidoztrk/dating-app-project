// web-app/src/pages/admin/AdminUsers.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface User {
    UserID: number;
    Email: string;
    FirstName: string;
    LastName: string;
    Gender: string;
    City: string;
    IsPremium: boolean;
    PremiumTier: string;
    IsBanned: boolean;
    IsActive: boolean;
    CreatedAt: string;
    LastActiveAt: string;
}

export default function AdminUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, [page, search, filter]);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get('http://localhost:5000/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` },
                params: { page, search, filter, limit: 20 }
            });
            setUsers(response.data.data.users);
            setTotalPages(response.data.data.totalPages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            navigate('/admin/login');
        }
    };

    const handleBan = async (userId: number) => {
        if (!confirm('Are you sure you want to ban this user?')) return;

        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(`http://localhost:5000/api/admin/users/${userId}/ban`,
                { reason: 'Banned by admin' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchUsers();
            alert('User banned successfully');
        } catch (error) {
            console.error('Error banning user:', error);
            alert('Failed to ban user');
        }
    };

    const handleUnban = async (userId: number) => {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(`http://localhost:5000/api/admin/users/${userId}/unban`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchUsers();
            alert('User unbanned successfully');
        } catch (error) {
            console.error('Error unbanning user:', error);
            alert('Failed to unban user');
        }
    };

    const handleDelete = async (userId: number) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
            alert('User deleted successfully');
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
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
                        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                        <p className="text-gray-600 mt-1">Manage all registered users</p>
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
                        <a href="/admin/dashboard" className="py-4 hover:border-b-2 border-white">
                            Dashboard
                        </a>
                        <a href="/admin/users" className="py-4 border-b-2 border-white font-semibold">
                            Users
                        </a>
                        <a href="/admin/reports" className="py-4 hover:border-b-2 border-white">
                            Reports
                        </a>
                    </div>
                </div>
            </nav>

            {/* Filters */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">All Users</option>
                            <option value="active">Active</option>
                            <option value="premium">Premium</option>
                            <option value="banned">Banned</option>
                        </select>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Location
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Joined
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.UserID}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                                                {user.FirstName[0]}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {user.FirstName} {user.LastName}
                                                </div>
                                                <div className="text-sm text-gray-500">{user.Email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{user.City || 'N/A'}</div>
                                        <div className="text-sm text-gray-500">{user.Gender}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex gap-2">
                                            {user.IsPremium && (
                                                <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                                                    💎 {user.PremiumTier}
                                                </span>
                                            )}
                                            {user.IsBanned && (
                                                <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                                                    🚫 Banned
                                                </span>
                                            )}
                                            {!user.IsActive && (
                                                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                                                    Inactive
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(user.CreatedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex gap-2">
                                            {user.IsBanned ? (
                                                <button
                                                    onClick={() => handleUnban(user.UserID)}
                                                    className="text-green-600 hover:text-green-900"
                                                >
                                                    Unban
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleBan(user.UserID)}
                                                    className="text-yellow-600 hover:text-yellow-900"
                                                >
                                                    Ban
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(user.UserID)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex justify-between items-center">
                    <button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <span className="text-gray-600">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}