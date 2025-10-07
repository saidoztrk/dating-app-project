import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Match {
    MatchID: number;
    MatchedUserID: number;
    FirstName: string;
    LastMessage: string;
}

export default function Matches() {
    const [matches, setMatches] = useState<Match[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMatches();
    }, []);

    const fetchMatches = async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/matches', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setMatches(response.data.data.matches);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Your Matches</h1>
                {matches.length === 0 ? (
                    <p className="text-center text-gray-500">No matches yet</p>
                ) : (
                    <div className="space-y-4">
                        {matches.map((match) => (
                            <div
                                key={match.MatchID}
                                onClick={() => navigate(`/chat/${match.MatchID}`)}
                                className="bg-white p-4 rounded-lg shadow hover:shadow-lg cursor-pointer"
                            >
                                <h3 className="font-bold text-lg">{match.FirstName}</h3>
                                <p className="text-gray-600 text-sm">{match.LastMessage || 'Say hi!'}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}