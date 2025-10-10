// web-app/src/pages/Likes.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Like {
    UserID: number;
    FirstName: string;
    Age: number;
    Bio: string;
    City: string;
    SwipedAt: string;
}

export default function Likes() {
    const [likes, setLikes] = useState<Like[]>([]);
    const [isPremium, setIsPremium] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        checkPremiumStatus();
        fetchLikes();
    }, []);

    const checkPremiumStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/subscriptions/status', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsPremium(response.data.data.subscription?.IsActive || false);
        } catch (error) {
            console.error('Error checking premium:', error);
        }
    };

    const fetchLikes = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/likes-received', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLikes(response.data.data.likes);
            setLoading(false);
        } catch (error: any) {
            if (error.response?.data?.upgrade) {
                setLoading(false);
            } else {
                console.error('Error:', error);
                setLoading(false);
            }
        }
    };

    const handleLikeBack = async (userId: number) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/swipe',
                { swipedUserId: userId, swipeType: 'LIKE' },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.data.isMatch) {
                alert("It's a Match! 🎉");
                navigate('/matches');
            } else {
                fetchLikes();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handlePass = async (userId: number) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/swipe',
                { swipedUserId: userId, swipeType: 'DISLIKE' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchLikes();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isPremium) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <h1 className="text-3xl font-bold mb-4">Premium Feature</h1>
                    <p className="text-gray-600 mb-6">
                        See who liked you is a premium feature. Upgrade now to see all the people who already swiped right on you!
                    </p>
                    <div className="bg-pink-50 p-4 rounded-lg mb-6">
                        <p className="text-sm text-gray-700">
                            ✨ <strong>{likes.length} people</strong> have already liked you!
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/premium')}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-lg font-bold text-lg hover:from-pink-600 hover:to-purple-600 transition"
                    >
                        Upgrade to Premium
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">People Who Liked You</h1>
                    <p className="text-gray-600">
                        {likes.length} {likes.length === 1 ? 'person has' : 'people have'} liked you
                    </p>
                </div>

                {likes.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <div className="text-6xl mb-4">💔</div>
                        <p className="text-xl text-gray-600">No likes yet</p>
                        <p className="text-sm text-gray-500 mt-2">Keep swiping to get more matches!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {likes.map((like) => (
                            <div key={like.UserID} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition">
                                <div className="h-80 bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                                    <div className="text-white text-6xl font-bold">{like.FirstName[0]}</div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-2xl font-bold mb-1">
                                        {like.FirstName}, {like.Age}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-3">📍 {like.City}</p>
                                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                                        {like.Bio || 'No bio available'}
                                    </p>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handlePass(like.UserID)}
                                            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-300 transition"
                                        >
                                            ✕ Pass
                                        </button>
                                        <button
                                            onClick={() => handleLikeBack(like.UserID)}
                                            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-600 transition"
                                        >
                                            ♥ Like Back
                                        </button>
                                    </div>

                                    <p className="text-xs text-gray-400 text-center mt-3">
                                        Liked you {new Date(like.SwipedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}