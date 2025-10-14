// web-app/src/pages/PrivacyPolicy.tsx
import SEO from '../components/SEO';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <SEO
                title="Privacy Policy"
                description="Read our privacy policy to understand how we collect, use, and protect your personal information."
            />

            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                    <p className="text-gray-600">Last updated: October 10, 2025</p>
                </div>

                {/* Content */}
                <div className="bg-white rounded-xl shadow-md p-8 space-y-8">
                    {/* Introduction */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Welcome to Dating App. We respect your privacy and are committed to protecting your personal data.
                            This privacy policy will inform you about how we look after your personal data when you visit our
                            platform and tell you about your privacy rights.
                        </p>
                    </section>

                    {/* Information We Collect */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">2.1 Personal Information</h3>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                    <li>Name, email address, and phone number</li>
                                    <li>Date of birth and gender</li>
                                    <li>Profile photos and bio</li>
                                    <li>Location data (city and country)</li>
                                    <li>Preferences and interests</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">2.2 Usage Data</h3>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                    <li>Swipe activity and match history</li>
                                    <li>Messages and chat content</li>
                                    <li>Device information and IP address</li>
                                    <li>Browser type and operating system</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* How We Use Your Information */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We use your personal information for the following purposes:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>To provide and maintain our dating service</li>
                            <li>To match you with compatible users</li>
                            <li>To send you notifications about matches and messages</li>
                            <li>To improve our service and user experience</li>
                            <li>To prevent fraud and ensure platform safety</li>
                            <li>To comply with legal obligations</li>
                        </ul>
                    </section>

                    {/* Data Sharing */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Sharing and Disclosure</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We do not sell your personal information. We may share your data in the following circumstances:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li><strong>With other users:</strong> Your profile information is visible to matched users</li>
                            <li><strong>Service providers:</strong> Third-party companies that help us operate our platform</li>
                            <li><strong>Legal requirements:</strong> When required by law or to protect rights and safety</li>
                            <li><strong>Business transfers:</strong> In connection with a merger or acquisition</li>
                        </ul>
                    </section>

                    {/* Data Security */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We implement appropriate technical and organizational measures to protect your personal data against
                            unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over
                            the Internet is 100% secure.
                        </p>
                    </section>

                    {/* Your Rights */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Privacy Rights</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            You have the following rights regarding your personal data:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li><strong>Access:</strong> Request a copy of your personal data</li>
                            <li><strong>Correction:</strong> Update inaccurate or incomplete information</li>
                            <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                            <li><strong>Objection:</strong> Object to processing of your personal data</li>
                            <li><strong>Portability:</strong> Receive your data in a structured format</li>
                        </ul>
                    </section>

                    {/* Cookies */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies and Tracking</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We use cookies and similar tracking technologies to track activity on our platform and store certain
                            information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                        </p>
                    </section>

                    {/* Children's Privacy */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Our service is not intended for users under the age of 18. We do not knowingly collect personal
                            information from anyone under 18. If you are a parent or guardian and believe your child has provided
                            us with personal data, please contact us.
                        </p>
                    </section>

                    {/* Changes to Policy */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Policy</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the
                            new Privacy Policy on this page and updating the "Last updated" date.
                        </p>
                    </section>

                    {/* Contact */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            If you have any questions about this Privacy Policy, please contact us:
                        </p>
                        <div className="bg-gray-50 rounded-lg p-6 space-y-2">
                            <p className="text-gray-700"><strong>Email:</strong> privacy@datingapp.com</p>
                            <p className="text-gray-700"><strong>Address:</strong> 123 Dating Street, Love City, 12345</p>
                            <p className="text-gray-700"><strong>Phone:</strong> +1 (555) 123-4567</p>
                        </div>
                    </section>
                </div>

                {/* Back Button */}
                <div className="text-center mt-8">
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 text-pink-500 hover:text-pink-600 font-medium"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
}