// web-app/src/pages/admin/AdminReports.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Report {
    ReportID: number;
    ReportType: string;
    Reason: string;
    Status: string;
    CreatedAt: string;
    ReporterName: string;
    ReporterEmail: string;
    ReportedName: string;
    ReportedEmail: string;
    ReportedUserID: number;
}

export default function AdminReports() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('PENDING');
    const navigate = useNavigate();

    useEffect(() => {
        fetchReports();
    }, [statusFilter]);

    const fetchReports = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get('http://localhost:5000/api/admin/reports', {
                headers: { Authorization: `Bearer ${token}` },
                params: { status: statusFilter }
            });
            setReports(response.data.data.reports);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching reports:', error);
            navigate('/admin/login');
        }
    };

    const handleReview = async (reportId: number, action: string, status: string) => {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(`http://localhost:5000/api/admin/reports/${reportId}/review`,
                { action, status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchReports();
            alert(`Report ${status.toLowerCase()} successfully`);
        } catch (error) {
            console.error('Error reviewing report:', error);
            alert('Failed to review report');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
    };

    const getReportTypeColor = (type: string) => {
        switch (type) {
            case 'INAPPROPRIATE': return 'bg-red-100 text-red-800';
            case 'FAKE': return 'bg-orange-100 text-orange-800';
            case 'HARASSMENT': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'REVIEWED': return 'bg-blue-100 text-blue-800';
            case 'RESOLVED': return 'bg-green-100 text-green-800';
            case 'DISMISSED': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
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
                        <h1 className="text-3xl font-bold text-gray-900">Reports Management</h1>
                        <p className="text-gray-600 mt-1">Review and moderate user reports</p>
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
                        <a href="/admin/users" className="py-4 hover:border-b-2 border-white">
                            Users
                        </a>
                        <a href="/admin/reports" className="py-4 border-b-2 border-white font-semibold">
                            Reports
                        </a>
                    </div>
                </div>
            </nav>

            {/* Filters */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="flex gap-4">
                        <button
                            onClick={() => setStatusFilter('PENDING')}
                            className={`px-4 py-2 rounded-lg font-semibold ${statusFilter === 'PENDING'
                                ? 'bg-yellow-500 text-white'
                                : 'bg-gray-200 text-gray-700'
                                }`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => setStatusFilter('REVIEWED')}
                            className={`px-4 py-2 rounded-lg font-semibold ${statusFilter === 'REVIEWED'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700'
                                }`}
                        >
                            Reviewed
                        </button>
                        <button
                            onClick={() => setStatusFilter('RESOLVED')}
                            className={`px-4 py-2 rounded-lg font-semibold ${statusFilter === 'RESOLVED'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 text-gray-700'
                                }`}
                        >
                            Resolved
                        </button>
                        <button
                            onClick={() => setStatusFilter('DISMISSED')}
                            className={`px-4 py-2 rounded-lg font-semibold ${statusFilter === 'DISMISSED'
                                ? 'bg-gray-500 text-white'
                                : 'bg-gray-200 text-gray-700'
                                }`}
                        >
                            Dismissed
                        </button>
                    </div>
                </div>

                {/* Reports List */}
                {reports.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <div className="text-6xl mb-4">📋</div>
                        <p className="text-xl text-gray-600">No {statusFilter.toLowerCase()} reports</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reports.map((report) => (
                            <div key={report.ReportID} className="bg-white rounded-lg shadow p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex gap-2 mb-2">
                                            <span className={`px-3 py-1 text-sm rounded-full ${getReportTypeColor(report.ReportType)}`}>
                                                {report.ReportType}
                                            </span>
                                            <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(report.Status)}`}>
                                                {report.Status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            Report ID: #{report.ReportID} • {new Date(report.CreatedAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 mb-4">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 mb-1">Reporter</h3>
                                        <p className="font-medium">{report.ReporterName}</p>
                                        <p className="text-sm text-gray-600">{report.ReporterEmail}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 mb-1">Reported User</h3>
                                        <p className="font-medium text-red-600">{report.ReportedName}</p>
                                        <p className="text-sm text-gray-600">{report.ReportedEmail}</p>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Reason</h3>
                                    <p className="text-gray-700">{report.Reason || 'No reason provided'}</p>
                                </div>

                                {report.Status === 'PENDING' && (
                                    <div className="flex gap-3 pt-4 border-t">
                                        <button
                                            onClick={() => handleReview(report.ReportID, 'BAN', 'RESOLVED')}
                                            className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
                                        >
                                            🚫 Ban User
                                        </button>
                                        <button
                                            onClick={() => handleReview(report.ReportID, 'WARNING', 'REVIEWED')}
                                            className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition"
                                        >
                                            ⚠️ Warning
                                        </button>
                                        <button
                                            onClick={() => handleReview(report.ReportID, 'NONE', 'DISMISSED')}
                                            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
                                        >
                                            ✕ Dismiss
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}