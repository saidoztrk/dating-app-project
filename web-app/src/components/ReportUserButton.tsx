// web-app/src/components/ReportUserButton.tsx
import { useState } from 'react';
import axios from 'axios';

interface ReportUserButtonProps {
    reportedUserId: number;
    reportedUserName: string;
}

export default function ReportUserButton({ reportedUserId, reportedUserName }: ReportUserButtonProps) {
    const [showModal, setShowModal] = useState(false);
    const [reportType, setReportType] = useState('INAPPROPRIATE');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const reporterUserId = 1; // Gerçekte token'dan alınacak

            await axios.post('http://localhost:5000/api/reports',
                {
                    reportedUserId,
                    reportType,
                    reason
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert('Report submitted successfully');
            setShowModal(false);
            setReason('');
        } catch (error) {
            console.error('Error submitting report:', error);
            alert('Failed to submit report');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
                🚨 Report User
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Report {reportedUserName}</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-2">
                                    Report Type
                                </label>
                                <select
                                    value={reportType}
                                    onChange={(e) => setReportType(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    required
                                >
                                    <option value="INAPPROPRIATE">Inappropriate Content</option>
                                    <option value="FAKE">Fake Profile</option>
                                    <option value="HARASSMENT">Harassment</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-semibold mb-2">
                                    Reason (Optional)
                                </label>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    rows={4}
                                    placeholder="Provide additional details..."
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                                >
                                    {loading ? 'Submitting...' : 'Submit Report'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}