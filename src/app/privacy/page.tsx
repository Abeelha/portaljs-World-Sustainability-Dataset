'use client';

import Link from 'next/link';
import { ArrowLeft, Shield, Database, Eye, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function PrivacyPage() {
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
                        <Shield className="w-16 h-16 text-green-600 mx-auto mb-4" />
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Privacy Policy</h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            How we protect and handle your data
                        </p>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Database className="w-5 h-5 text-blue-600" />
                                    Data Collection
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-gray-700 dark:text-gray-300">
                                    The World Sustainability Data Portal is committed to protecting your privacy. This policy outlines how we collect, use, and protect your information.
                                </p>
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Information We Collect:</h4>
                                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                                        <li>Usage data and analytics to improve our service</li>
                                        <li>Search queries and filters used within the platform</li>
                                        <li>Technical information about your device and browser</li>
                                        <li>No personal identifying information is required or collected</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Eye className="w-5 h-5 text-green-600" />
                                    Data Usage
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">How We Use Your Data:</h4>
                                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                                        <li>Improve platform performance and user experience</li>
                                        <li>Generate usage analytics and insights</li>
                                        <li>Optimize search and filtering functionality</li>
                                        <li>Ensure system security and prevent abuse</li>
                                    </ul>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300">
                                    All data collected is used solely for improving the sustainability data portal and is never sold or shared with third parties.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Lock className="w-5 h-5 text-purple-600" />
                                    Data Protection
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Security Measures:</h4>
                                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                                        <li>Encrypted data transmission using HTTPS</li>
                                        <li>Secure hosting infrastructure</li>
                                        <li>Regular security audits and updates</li>
                                        <li>Limited data retention policies</li>
                                    </ul>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300">
                                    We implement industry-standard security practices to protect your data and ensure the integrity of our sustainability database.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 dark:text-gray-300 mb-4">
                                    If you have any questions about this Privacy Policy or our data practices, please contact us:
                                </p>
                                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                    <p className="text-gray-900 dark:text-gray-100 font-medium">Email: privacy@sustainabilityportal.org</p>
                                    <p className="text-gray-700 dark:text-gray-300">Response time: Within 48 hours</p>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-6">
                            Last updated: December 2025 | Effective immediately
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}