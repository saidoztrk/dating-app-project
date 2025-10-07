import { useState, useEffect } from 'react';
import axios from 'axios';

interface Plan {
    id: string;
    name: string;
    price: number;
    features: string[];
}

export default function Premium() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/subscriptions/plans');
            setPlans(response.data.data.plans);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching plans:', error);
            setLoading(false);
        }
    };

    const handleSubscribe = async (planType: string) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/subscriptions/subscribe',
                {
                    planType,
                    transactionId: `MOCK_${Date.now()}` // Gerçekte Stripe'dan gelecek
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(`${planType} plan activated! 🎉`);
            window.location.href = '/profile';
        } catch (error) {
            console.error('Subscribe error:', error);
            alert('Subscription failed');
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-4">Upgrade to Premium</h1>
                <p className="text-center text-gray-600 mb-12">Get more matches with premium features</p>

                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`bg-white rounded-2xl shadow-xl p-8 ${plan.id === 'plus' ? 'border-4 border-pink-500 transform scale-105' : ''
                                }`}
                        >
                            {plan.id === 'plus' && (
                                <div className="bg-pink-500 text-white text-center py-2 rounded-lg mb-4 font-semibold">
                                    MOST POPULAR
                                </div>
                            )}

                            <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                            <div className="mb-6">
                                <span className="text-4xl font-bold">${plan.price}</span>
                                <span className="text-gray-600">/month</span>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSubscribe(plan.name)}
                                className={`w-full py-3 rounded-lg font-semibold transition ${plan.id === 'plus'
                                    ? 'bg-pink-500 text-white hover:bg-pink-600'
                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                    }`}
                            >
                                Choose {plan.name}
                            </button>
                        </div>
                    ))}
                </div>

                <p className="text-center text-sm text-gray-500 mt-8">
                    Cancel anytime. Terms and conditions apply.
                </p>
            </div>
        </div>
    );
}