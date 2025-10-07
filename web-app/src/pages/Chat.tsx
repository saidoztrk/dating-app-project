import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';

interface Message {
    MessageID: number;
    SenderUserID: number;
    MessageText: string;
    SentAt: string;
}

export default function Chat() {
    const { matchId } = useParams();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const currentUserId = 1; // Gerçekte token'dan alınacak

    useEffect(() => {
        fetchMessages();

        const token = localStorage.getItem('token');
        const socket = io('http://localhost:5000', {
            auth: { token }
        });

        socket.on('new_message', (message) => {
            setMessages(prev => [...prev, message]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const fetchMessages = async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/messages/${matchId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(response.data.data.messages);
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const token = localStorage.getItem('token');
        await axios.post(`http://localhost:5000/api/messages/${matchId}`,
            { messageText: newMessage },
            { headers: { Authorization: `Bearer ${token}` } }
        );


        setNewMessage('');
        fetchMessages();
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <div className="bg-pink-500 text-white p-4 font-bold">Chat</div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                    <div key={msg.MessageID} className={`flex ${msg.SenderUserID === currentUserId ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs p-3 rounded-lg ${msg.SenderUserID === currentUserId ? 'bg-pink-500 text-white' : 'bg-white'}`}>
                            {msg.MessageText}
                        </div>
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage} className="p-4 bg-white flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-3 border rounded-lg"
                />
                <button className="bg-pink-500 text-white px-6 rounded-lg font-semibold">Send</button>
            </form>
        </div>
    );
}