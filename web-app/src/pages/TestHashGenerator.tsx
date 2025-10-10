import { useState } from 'react';
import axios from 'axios';

export default function TestHashGenerator() {
    const [password, setPassword] = useState('admin123');
    const [hash, setHash] = useState('');
    const [loading, setLoading] = useState(false);

    const generateHash = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/admin/generate-hash', {
                password
            });
            setHash(response.data.data.hash);
        } catch (error) {
            console.error('Error:', error);
            alert('Error generating hash');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
                <h1 className="text-2xl font-bold mb-6">Password Hash Generator</h1>

                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Password:</label>
                    <input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Enter password"
                    />
                </div>

                <button
                    onClick={generateHash}
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
                >
                    {loading ? 'Generating...' : 'Generate Hash'}
                </button>

                {hash && (
                    <div className="mt-6">
                        <label className="block text-sm font-semibold mb-2">Generated Hash:</label>
                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <code className="text-sm break-all">{hash}</code>
                        </div>
                        <button
                            onClick={() => navigator.clipboard.writeText(hash)}
                            className="mt-2 text-sm text-indigo-600 hover:underline"
                        >
                            Copy to clipboard
                        </button>

                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm font-semibold mb-2">SQL Query:</p>
                            <code className="text-xs block bg-white p-3 rounded border break-all">
                                UPDATE AdminUsers SET PasswordHash = '{hash}' WHERE Email = 'admin@datingapp.com';
                            </code>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}