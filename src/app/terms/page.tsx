'use client';

import Link from 'next/link';
import { ArrowLeft, FileText, Users, AlertTriangle, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-950 dark:to-black transition-colors duration-500">
            <Header />

            <main className="py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Button asChild variant="ghost" className="mb-4 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                            <Link href="/">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Home
                            </Link>
                        </Button>
                    </div>

                    <div className="text-center mb-8">
                        <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Terms of Use</h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            Guidelines for using the Sustainability Portal
                        </p>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-green-600" />
                                    Acceptable Use
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-gray-700 dark:text-gray-300">
                                    By accessing and using the World Sustainability Data Portal, you agree to comply with these terms and conditions.
                                </p>
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">You agree to:</h4>
                                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                                        <li>Use the platform for educational, research, and policy development purposes</li>
                                        <li>Properly attribute data sources when using or citing our data</li>
                                        <li>Respect intellectual property rights and data licensing terms</li>
                                        <li>Not attempt to reverse engineer or compromise platform security</li>
                                        <li>Not use automated systems to overload our servers</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Scale className="w-5 h-5 text-purple-600" />
                                    Data License
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Data Usage Rights:</h4>
                                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                                        <li>Data is provided under Creative Commons Attribution 4.0 International License</li>
                                        <li>Free to use, share, and adapt for any purpose with proper attribution</li>
                                        <li>Original data sources include World Bank, UN, and other international organizations</li>
                                        <li>No warranty is provided regarding data accuracy or completeness</li>
                                    </ul>
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                    <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Attribution Requirements:</h5>
                                    <p className="text-blue-800 dark:text-blue-200 text-sm">
                                        &ldquo;Data from World Sustainability Data Portal (sustainabilityportal.org),
                                        sourced from international organizations including World Bank and United Nations.&rdquo;
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                                    Limitations and Disclaimers
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Service Limitations:</h4>
                                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                                        <li>Data may contain gaps, inconsistencies, or temporal delays</li>
                                        <li>AI insights are algorithmic interpretations, not expert analysis</li>
                                        <li>Platform availability is not guaranteed 24/7</li>
                                        <li>Features and data sources may change without notice</li>
                                    </ul>
                                </div>
                                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                                    <p className="text-orange-800 dark:text-orange-200 text-sm">
                                        <strong>Important:</strong> This platform is for informational purposes only.
                                        Critical decisions should not be based solely on this data without additional verification.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Platform Governance</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">We reserve the right to:</h4>
                                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                                        <li>Modify these terms at any time with notice</li>
                                        <li>Restrict access for violations of these terms</li>
                                        <li>Update data sources and methodologies</li>
                                        <li>Suspend services for maintenance or improvements</li>
                                    </ul>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300">
                                    By continuing to use this platform, you acknowledge that you have read, understood,
                                    and agree to be bound by these terms and any future modifications.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Contact & Support</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 dark:text-gray-300 mb-4">
                                    Questions about these terms or need support? Contact us:
                                </p>
                                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                    <p className="text-gray-900 dark:text-gray-100 font-medium">Email: support@sustainabilityportal.org</p>
                                    <p className="text-gray-700 dark:text-gray-300">Legal inquiries: legal@sustainabilityportal.org</p>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-6">
                            Last updated: June 2025 | Effective immediately
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}