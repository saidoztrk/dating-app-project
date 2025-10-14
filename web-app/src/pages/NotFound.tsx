// web-app/src/pages/NotFound.tsx
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center px-4">
            <SEO
                title="404 - Page Not Found"
                description="The page you're looking for doesn't exist."
            />

            <div className="text-center max-w-2xl">
                {/* 404 Animation */}
                <div className="mb-8">
                    <div className="relative inline-block">
                        <h1 className="text-9xl font-bold text-pink-500 opacity-20">404</h1>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-32 h-32 text-pink-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Message */}
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Oops! Page Not Found</h2>
                <p className="text-xl text-gray-600 mb-8">
                    Looks like this page went on a date and never came back. 💔
                </p>
                <p className="text-gray-500 mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Go Back
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition font-medium flex items-center justify-center gap-2 shadow-lg"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Go Home
                    </button>
                </div>

                {/* Popular Links */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-4">Popular pages:</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a href="/discover" className="text-pink-500 hover:text-pink-600 font-medium">Discover</a>
                        <span className="text-gray-300">•</span>
                        <a href="/matches" className="text-pink-500 hover:text-pink-600 font-medium">Matches</a>
                        <span className="text-gray-300">•</span>
                        <a href="/premium" className="text-pink-500 hover:text-pink-600 font-medium">Premium</a>
                        <span className="text-gray-300">•</span>
                        <a href="/profile" className="text-pink-500 hover:text-pink-600 font-medium">Profile</a>
                    </div>
                </div>
            </div>
        </div>
    );
}