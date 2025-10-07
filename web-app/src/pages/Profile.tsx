import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Profile() {
    const [profile, setProfile] = useState<any>(null);
    const [photos, setPhotos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
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
        try {
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
            setLoading(false);
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        }
    };

    const fetchPhotos = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/photos/1'); // UserID 1
            setPhotos(response.data.data.photos || []);
        } catch (error) {
            console.error('Photos error:', error);
        }
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        const formData = new FormData();
        formData.append('photo', e.target.files[0]);

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/photos/upload', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            fetchPhotos();
        } catch (error) {
            console.error('Upload error:', error);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5000/api/users/profile', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEditing(false);
            fetchProfile();
        } catch (error) {
            console.error('Update error:', error);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (!profile) return <div className="p-8">Error</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
                <h1 className="text-3xl font-bold mb-4">{profile.FirstName}</h1>

                {/* Photos */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-3">Photos ({photos.length}/6)</h2>
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
                        <label className="bg-pink-500 text-white px-4 py-2 rounded-lg cursor-pointer inline-block hover:bg-pink-600">
                            Upload Photo
                            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                        </label>
                    )}
                </div>

                {/* Profile */}
                {!editing ? (
                    <div className="space-y-3">
                        <p><strong>Email:</strong> {profile.Email}</p>
                        <p><strong>Bio:</strong> {profile.Bio || 'No bio'}</p>
                        <p><strong>Occupation:</strong> {profile.Occupation || 'Not specified'}</p>
                        <p><strong>City:</strong> {profile.City || 'Not specified'}</p>
                        <button onClick={() => setEditing(true)} className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-lg">
                            Edit Profile
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <textarea
                            placeholder="Bio"
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            className="w-full p-3 border rounded-lg"
                            rows={3}
                        />
                        <input
                            type="text"
                            placeholder="Occupation"
                            value={formData.occupation}
                            onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                            className="w-full p-3 border rounded-lg"
                        />
                        <input
                            type="text"
                            placeholder="City"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="w-full p-3 border rounded-lg"
                        />
                        <div className="flex gap-2">
                            <button type="submit" className="bg-pink-500 text-white px-6 py-2 rounded-lg">Save</button>
                            <button type="button" onClick={() => setEditing(false)} className="bg-gray-300 px-6 py-2 rounded-lg">Cancel</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}