// web-app/src/pages/TermsOfService.tsx
import SEO from '../components/SEO';

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-gray-50">
            <SEO
                title="Terms of Service"
                description="Read our terms of service to understand the rules and guidelines for using our dating platform."
            />

            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
                    <p className="text-gray-600">Last updated: October 10, 2025</p>
                </div>

                {/* Content */}
                <div className="bg-white rounded-xl shadow-md p-8 space-y-8">
                    {/* Agreement to Terms */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
                        <p className="text-gray-700 leading-relaxed">
                            By accessing or using Dating App, you agree to be bound by these Terms of Service and our Privacy Policy.
                            If you do not agree to these terms, please do not use our service.
                        </p>
                    </section>

                    {/* Eligibility */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Eligibility</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            To use our service, you must:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Be at least 18 years old</li>
                            <li>Have the legal capacity to enter into a binding contract</li>
                            <li>Not be prohibited from using the service under applicable laws</li>
                            <li>Create only one account</li>
                            <li>Provide accurate and truthful information</li>
                        </ul>
                    </section>

                    {/* Account Registration */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Account Registration</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            When creating an account, you agree to:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Provide accurate, current, and complete information</li>
                            <li>Maintain and update your information to keep it accurate</li>
                            <li>Keep your password secure and confidential</li>
                            <li>Notify us immediately of any unauthorized use of your account</li>
                            <li>Accept responsibility for all activities under your account</li>
                        </ul>
                    </section>

                    {/* User Conduct */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Conduct</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            You agree NOT to:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Upload false or misleading information</li>
                            <li>Impersonate any person or entity</li>
                            <li>Post content that is illegal, harmful, or offensive</li>
                            <li>Harass, abuse, or harm other users</li>
                            <li>Use the service for commercial purposes without authorization</li>
                            <li>Attempt to gain unauthorized access to the platform</li>
                            <li>Use automated systems (bots) to access the service</li>
                            <li>Share explicit or adult content</li>
                            <li>Solicit money or personal information from other users</li>
                        </ul>
                    </section>

                    {/* Content Ownership */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Content and Intellectual Property</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">5.1 Your Content</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    You retain ownership of content you upload. By uploading content, you grant us a worldwide,
                                    non-exclusive, royalty-free license to use, store, and display your content for the purpose
                                    of providing our service.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">5.2 Our Platform</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    All platform features, design, and functionality are owned by Dating App and protected by
                                    copyright, trademark, and other intellectual property laws.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Premium Services */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Premium Services and Payments</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Our premium features require payment:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Subscriptions automatically renew unless cancelled</li>
                            <li>Prices are subject to change with notice</li>
                            <li>Refunds are provided according to our refund policy</li>
                            <li>You are responsible for all charges on your account</li>
                        </ul>
                    </section>

                    {/* Termination */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Termination</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We reserve the right to:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Suspend or terminate your account for violating these terms</li>
                            <li>Remove content that violates our policies</li>
                            <li>Refuse service to anyone for any reason</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            You may delete your account at any time from your settings page.
                        </p>
                    </section>

                    {/* Disclaimers */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Disclaimers</h2>
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded">
                            <p className="text-gray-700 leading-relaxed mb-4">
                                THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li>The accuracy or reliability of user profiles</li>
                                <li>That you will find a match or relationship</li>
                                <li>Uninterrupted or error-free service</li>
                                <li>Security of communications on the platform</li>
                            </ul>
                        </div>
                    </section>

                    {/* Limitation of Liability */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
                        <p className="text-gray-700 leading-relaxed">
                            To the maximum extent permitted by law, Dating App shall not be liable for any indirect, incidental,
                            special, consequential, or punitive damages arising out of your use or inability to use the service.
                        </p>
                    </section>

                    {/* Governing Law */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Governing Law</h2>
                        <p className="text-gray-700 leading-relaxed">
                            These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction],
                            without regard to its conflict of law provisions.
                        </p>
                    </section>

                    {/* Changes to Terms */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to Terms</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We reserve the right to modify these Terms at any time. We will notify you of significant changes
                            by email or through the platform. Your continued use of the service after changes constitutes
                            acceptance of the new Terms.
                        </p>
                    </section>

                    {/* Contact */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Information</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            For questions about these Terms, please contact us:
                        </p>
                        <div className="bg-gray-50 rounded-lg p-6 space-y-2">
                            <p className="text-gray-700"><strong>Email:</strong> legal@datingapp.com</p>
                            <p className="text-gray-700"><strong>Address:</strong> 123 Dating Street, Love City, 12345</p>
                            <p className="text-gray-700"><strong>Phone:</strong> +1 (555) 123-4567</p>
                        </div>
                    </section>

                    {/* Acceptance */}
                    <section className="bg-pink-50 border-l-4 border-pink-500 p-6 rounded">
                        <p className="text-gray-800 font-semibold">
                            By using Dating App, you acknowledge that you have read, understood, and agree to be bound by these
                            Terms of Service.
                        </p>
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