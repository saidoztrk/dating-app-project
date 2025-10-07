import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Profile() {
    const [profile, setProfile] = useState<any>(null);
    const [photos, setPhotos] = useState<any[]>([]);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        bio: '',
        occupation: '',
        education: '',
        city: ''
    });

    useEffect(() => {
        fetchProfile();
        fetchPhotos();
    }, []);

    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users/profile', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const user = response.data.data.user;
        setProfile(user);
        setFormData({
            bio: user.Bio || '',
            occupation: user.Occupation || '',
            education: user.Education || '',
            city: user.City || ''
        });
    };

    const fetchPhotos = async () => {
        const token = localStorage.getItem('token');
        const userId = 1; // Token'dan alınacak
        const response = await axios.get(`http://localhost:5000/api/photos/${userId}`);
        setPhotos(response.data.data.photos);
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;

        const formData = new FormData();
        formData.append('photo', e.target.files[0]);

        const token = localStorage.getItem('token');
        await axios.post('http://localhost:5000/api/photos/upload', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });

        fetchPhotos();
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        await axios.put('http://localhost:5000/api/users/profile', formData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setEditing(false);
        fetchProfile();
    };

    if (!profile) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
                <h1 className="text-3xl font-bold mb-4">{profile.FirstName} {profile.LastName}</h1>

                {/* Photo Gallery */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-3">Photos</h2>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        {photos.map((photo) => (
                            <img
                                key={photo.PhotoID}
                                src={photo.PhotoURL}
                                alt="Profile"
                                className="w-full h-32 object-cover rounded-lg"
                            />
                        ))}
                    </div>
                    {photos.length < 6 && (
                        <label className="bg-pink-500 text-white px-4 py-2 rounded-lg cursor-pointer inline-block">
                            Upload Photo
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                className="hidden"
                            />
                        </label>
                    )}
                </div>

                {/* Profile Info - aynı */}
                {!editing ? (
                    <div className="space-y-3">
                        <p><strong>Email:</strong> {profile.Email}</p>
                        <p><strong>Bio:</strong> {profile.Bio || 'No bio yet'}</p>
                        <p><strong>Occupation:</strong> {profile.Occupation || 'Not specified'}</p>
                        <p><strong>Education:</strong> {profile.Education || 'Not specified'}</p>
                        <p><strong>City:</strong> {profile.City || 'Not specified'}</p>
                        <button
                            onClick={() => setEditing(true)}
                            className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-lg"
                        >
                            Edit Profile
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleUpdate} className="space-y-4">
                        {/* Form aynı */}
                    </form>
                )}
            </div>
        </div>
    );
}