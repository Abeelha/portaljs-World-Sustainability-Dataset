import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            World Sustainability Data Portal
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Comprehensive sustainability data for 173 countries over 19 years.
                            Explore environmental, social, and economic indicators with AI-powered insights.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-4">Explore</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/catalog" className="text-gray-600 dark:text-gray-400 hover:text-green-600">
                                    Dataset Catalog
                                </Link>
                            </li>
                            <li>
                                <Link href="/explorer" className="text-gray-600 dark:text-gray-400 hover:text-green-600">
                                    Data Explorer
                                </Link>
                            </li>
                            <li>
                                <Link href="/visualizations" className="text-gray-600 dark:text-gray-400 hover:text-green-600">
                                    Charts & Graphs
                                </Link>
                            </li>
                            <li>
                                <Link href="/insights" className="text-gray-600 dark:text-gray-400 hover:text-green-600">
                                    AI Insights
                                </Link>
                            </li>
                            <li>
                                <Link href="/countries" className="text-gray-600 dark:text-gray-400 hover:text-green-600">
                                    Countries
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-4">Resources</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/api-docs" className="text-gray-600 dark:text-gray-400 hover:text-green-600">
                                    API Documentation
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-green-600">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-green-600">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-center text-gray-600 dark:text-gray-400">
                        © 2025 World Sustainability Data Portal. Built with PortalJS.
                    </p>
                </div>
            </div>
        </footer>
    );
}