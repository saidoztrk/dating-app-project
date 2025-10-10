// src/pages/Discover.tsx  (ya da senin dosya yolun her neyse)
import { useState, useEffect } from 'react';
import axios from 'axios';
import ReportUserButton from '../components/ReportUserButton';

interface User {
    UserID: number;
    FirstName: string;
    Age: number;
    Bio: string;
    City: string;
    DistanceInMiles: number;
}

export default function Discover() {
    const [users, setUsers] = useState<User[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/potential-matches?limit=10', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data.data.users);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleSwipe = async (type: 'LIKE' | 'DISLIKE') => {
        const token = localStorage.getItem('token');
        const currentUser = users[currentIndex];

        try {
            const response = await axios.post('http://localhost:5000/api/swipe',
                { swipedUserId: currentUser.UserID, swipeType: type },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.data.isMatch) {
                alert("It's a Match! 🎉");
            }
            setCurrentIndex((i) => i + 1);
        } catch (error) {
            console.error('Swipe error:', error);
        }
    };

    const handleRewind = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/rewind', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setCurrentIndex((i) => Math.max(0, i - 1));
                alert('Swipe undone!');
            }
        } catch (error: any) {
            if (error.response?.data?.upgrade) {
                alert('Premium feature! Upgrade to use Rewind.');
                window.location.href = '/premium';
            } else {
                alert('Cannot undo');
            }
        }
    };

    if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
    if (currentIndex >= users.length) return <div className="flex items-center justify-center h-screen text-2xl">No more profiles</div>;

    const currentUser = users[currentIndex];

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
                <div className="h-96 bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                    <div className="text-white text-6xl font-bold">{currentUser.FirstName[0]}</div>
                </div>

                {/* Profil Bilgileri */}
                <div className="p-6">
                    <h2 className="text-3xl font-bold">
                        {currentUser.FirstName}, {currentUser.Age}
                    </h2>
                    <p className="text-gray-600 mt-2">
                        {currentUser.City} • {currentUser.DistanceInMiles} miles away
                    </p>
                    <p className="mt-4 text-gray-700">
                        {currentUser.Bio || 'No bio available'}
                    </p>

                    {/* Report Button Ekle */}
                    <div className="mt-4">
                        <ReportUserButton
                            reportedUserId={currentUser.UserID}
                            reportedUserName={currentUser.FirstName}
                        />
                    </div>
                </div>

                {/* Aksiyon Butonları */}
                <div className="flex gap-4 p-6">
                    <button
                        onClick={() => handleSwipe('DISLIKE')}
                        className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-full font-semibold text-xl hover:bg-gray-300"
                        aria-label="Dislike"
                    >
                        ✕
                    </button>
                    <button
                        onClick={() => handleSwipe('LIKE')}
                        className="flex-1 bg-pink-500 text-white py-4 rounded-full font-semibold text-xl hover:bg-pink-600"
                        aria-label="Like"
                    >
                        ♥
                    </button>
                </div>

                {/* (Opsiyonel) Rewind butonu eklemek istersen:
        <div className="px-6 pb-6">
          <button onClick={handleRewind} className="w-full bg-yellow-100 text-yellow-800 py-2 rounded-lg hover:bg-yellow-200">
            Rewind
          </button>
        </div>
        */}
            </div>
        </div>
    );
}
