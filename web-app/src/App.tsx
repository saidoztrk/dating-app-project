// web-app/src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// User Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Discover from './pages/Discover';
import Matches from './pages/Matches';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Likes from './pages/Likes';
import Settings from './pages/Settings';
import Premium from './pages/Premium';
import Notifications from './pages/Notifications';
import TestHashGenerator from './pages/TestHashGenerator';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminReports from './pages/admin/AdminReports';
import AdminAnalytics from './pages/admin/AdminAnalytics';

// Components
import NotificationBell from './components/NotificationBell';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  const isAdmin = !!localStorage.getItem('adminToken');

  return (
    <HelmetProvider>
      <BrowserRouter>
        {/* User Navigation */}
        {isAuthenticated && !window.location.pathname.startsWith('/admin') && !window.location.pathname.startsWith('/privacy') && !window.location.pathname.startsWith('/terms') && (
          <nav className="bg-pink-500 text-white p-4 flex items-center justify-between">
            <div className="flex gap-4">
              <a href="/discover" className="hover:underline font-semibold">Discover</a>
              <a href="/matches" className="hover:underline font-semibold">Matches</a>
              <a href="/likes" className="hover:underline font-semibold">Likes</a>
              <a href="/profile" className="hover:underline font-semibold">Profile</a>
              <a href="/premium" className="hover:underline font-semibold">Premium</a>
            </div>

            <div className="flex items-center gap-4">
              <NotificationBell />
              <a href="/settings" className="hover:underline font-semibold">Settings</a>
            </div>
          </nav>
        )}

        {/* Admin Navigation */}
        {isAdmin && window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login' && (
          <nav className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 shadow-lg">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex gap-6">
                <a href="/admin/dashboard" className="hover:bg-white/10 px-3 py-2 rounded transition font-semibold">
                  Dashboard
                </a>
                <a href="/admin/users" className="hover:bg-white/10 px-3 py-2 rounded transition font-semibold">
                  Users
                </a>
                <a href="/admin/reports" className="hover:bg-white/10 px-3 py-2 rounded transition font-semibold">
                  Reports
                </a>
                <a href="/admin/analytics" className="hover:bg-white/10 px-3 py-2 rounded transition font-semibold">
                  Analytics
                </a>
              </div>

              <button
                onClick={() => {
                  localStorage.removeItem('adminToken');
                  window.location.href = '/admin/login';
                }}
                className="hover:bg-white/10 px-4 py-2 rounded transition font-semibold"
              >
                Logout
              </button>
            </div>
          </nav>
        )}

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/test-hash" element={<TestHashGenerator />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />

          {/* User Routes */}
          <Route path="/discover" element={<Discover />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/chat/:matchId" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/likes" element={<Likes />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/notifications" element={<Notifications />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />

          {/* 404 Route - Must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;