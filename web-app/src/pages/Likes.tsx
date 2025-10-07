import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Likes() {
    const [likes, setLikes] = useState<any[]>([]);

    useEffect(() => {
        fetchLikes();
    }, []);

    const fetchLikes = async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/likes-received', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setLikes(response.data.data.likes);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">People Who Liked You</h1>
                {likes.length === 0 ? (
                    <p className="text-center text-gray-500">No likes yet</p>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {likes.map((like) => (
                            <div key={like.UserID} className="bg-white p-4 rounded-lg shadow">
                                <div className="h-32 bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg flex items-center justify-center mb-2">
                                    <div className="text-white text-4xl font-bold">{like.FirstName[0]}</div>
                                </div>
                                <h3 className="font-bold">{like.FirstName}, {like.Age}</h3>
                                <p className="text-sm text-gray-600">{like.City}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}