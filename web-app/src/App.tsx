import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Matches from './pages/Matches';
import Login from './pages/Login';
import Register from './pages/Register';
import Discover from './pages/Discover';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Likes from './pages/Likes';
import Settings from './pages/Settings';
import Premium from './pages/Premium';





function App() {
  return (
    <BrowserRouter>
      <nav className="bg-pink-500 text-white p-4 flex gap-4">
        <a href="/discover" className="hover:underline">Discover</a>
        <a href="/matches" className="hover:underline">Matches</a>
        <a href="/profile" className="hover:underline">Profile</a>
        <a href="/likes" className="hover:underline">Likes</a>
        <a href="/settings" className="hover:underline">Settings</a>
        <a href="/premium" className="hover:underline">Premium</a>
      </nav>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/chat/:matchId" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/likes" element={<Likes />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/premium" element={<Premium />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;