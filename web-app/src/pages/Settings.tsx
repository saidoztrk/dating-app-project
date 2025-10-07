import { useState } from 'react';
import axios from 'axios';

export default function Settings() {
    const [preferences, setPreferences] = useState({
        interestedIn: 'Female',
        minAge: 18,
        maxAge: 35,
        maxDistance: 50
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        alert('Preferences saved!');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
                <h1 className="text-3xl font-bold mb-6">Settings</h1>

                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Interested In</label>
                        <select
                            value={preferences.interestedIn}
                            onChange={(e) => setPreferences({ ...preferences, interestedIn: e.target.value })}
                            className="w-full p-3 border rounded-lg"
                        >
                            <option value="Male">Men</option>
                            <option value="Female">Women</option>
                            <option value="Both">Both</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Age Range: {preferences.minAge} - {preferences.maxAge}</label>
                        <div className="flex gap-4">
                            <input
                                type="range"
                                min="18"
                                max="60"
                                value={preferences.minAge}
                                onChange={(e) => setPreferences({ ...preferences, minAge: parseInt(e.target.value) })}
                                className="flex-1"
                            />
                            <input
                                type="range"
                                min="18"
                                max="60"
                                value={preferences.maxAge}
                                onChange={(e) => setPreferences({ ...preferences, maxAge: parseInt(e.target.value) })}
                                className="flex-1"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Maximum Distance: {preferences.maxDistance} miles</label>
                        <input
                            type="range"
                            min="1"
                            max="100"
                            value={preferences.maxDistance}
                            onChange={(e) => setPreferences({ ...preferences, maxDistance: parseInt(e.target.value) })}
                            className="w-full"
                        />
                    </div>

                    <button type="submit" className="w-full bg-pink-500 text-white py-3 rounded-lg font-semibold">
                        Save Preferences
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t">
                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}