'use client';

import Link from 'next/link';
import { ArrowLeft, Code, Database, Key, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ApiDocsPage() {
    const endpoints = [
        {
            method: 'GET',
            path: '/api/countries',
            description: 'Get list of all countries with sustainability data',
            response: 'Array of country names'
        },
        {
            method: 'GET',
            path: '/api/data/filter',
            description: 'Filter sustainability data by country, year, region',
            params: '?country=Brazil&year=2018&region=South%20America',
            response: 'Filtered dataset array'
        },
        {
            method: 'GET',
            path: '/api/insights',
            description: 'Get AI-generated insights for dataset',
            params: '?country=Brazil&metrics=carbon,renewable',
            response: 'AI insights object with recommendations'
        },
        {
            method: 'GET',
            path: '/api/stats',
            description: 'Get aggregated statistics for filtered data',
            response: 'Statistics object with averages and totals'
        }
    ];

    const examples = [
        {
            title: 'Get Brazil Data',
            code: `curl -X GET "https://sustainabilityportal.org/api/data/filter?country=Brazil"`,
            language: 'bash'
        },
        {
            title: 'JavaScript Fetch',
            code: `fetch('/api/data/filter?country=Brazil&year=2018')
  .then(response => response.json())
  .then(data => console.log(data));`,
            language: 'javascript'
        },
        {
            title: 'Python Request',
            code: `import requests

url = "https://sustainabilityportal.org/api/data/filter"
params = {"country": "Brazil", "year": "2018"}
response = requests.get(url, params=params)
data = response.json()`,
            language: 'python'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-950 dark:to-black transition-colors duration-500">
            <Header />

            <main className="py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Button asChild variant="ghost" className="mb-4 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                            <Link href="/">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Home
                            </Link>
                        </Button>
                    </div>

                    <div className="text-center mb-8">
                        <Code className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">API Documentation</h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            Programmatic access to sustainability data
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Database className="w-5 h-5 text-blue-600" />
                                    RESTful API
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 dark:text-gray-300 text-sm">
                                    Standard REST endpoints for accessing sustainability metrics, country data, and AI insights.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Key className="w-5 h-5 text-green-600" />
                                    No Auth Required
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 dark:text-gray-300 text-sm">
                                    Free access to all endpoints. Rate limiting applies: 1000 requests per hour per IP.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-orange-600" />
                                    Real-time Data
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 dark:text-gray-300 text-sm">
                                    Access the same data powering our web interface with millisecond response times.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Base URL</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg font-mono">
                                <p className="text-gray-900 dark:text-gray-100">https://sustainabilityportal.org/api</p>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                                All API endpoints are relative to this base URL. Responses are in JSON format.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Available Endpoints</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {endpoints.map((endpoint, index) => (
                                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-2 py-1 text-xs font-medium rounded ${endpoint.method === 'GET'
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                                                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                                                }`}>
                                                {endpoint.method}
                                            </span>
                                            <code className="font-mono text-sm text-gray-900 dark:text-gray-100">{endpoint.path}</code>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">{endpoint.description}</p>
                                        {endpoint.params && (
                                            <div className="text-xs text-gray-600 dark:text-gray-400">
                                                Example: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">{endpoint.params}</code>
                                            </div>
                                        )}
                                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                            Returns: {endpoint.response}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Code Examples</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {examples.map((example, index) => (
                                    <div key={index}>
                                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{example.title}</h4>
                                        <div className="bg-gray-900 dark:bg-gray-950 p-4 rounded-lg overflow-x-auto">
                                            <pre className="text-green-400 text-sm">{example.code}</pre>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Response Format</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                All API responses follow a consistent format:
                            </p>
                            <div className="bg-gray-900 dark:bg-gray-950 p-4 rounded-lg overflow-x-auto">
                                <pre className="text-green-400 text-sm">{`{
  "success": true,
  "data": [...],
  "meta": {
    "total": 3287,
    "filtered": 152,
    "countries": 173,
    "years": "2000-2018"
  },
  "timestamp": "2024-12-01T10:30:00Z"
}`}</pre>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Error Handling</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                                    <h5 className="font-semibold text-red-900 dark:text-red-100 mb-2">400 Bad Request</h5>
                                    <p className="text-red-800 dark:text-red-200 text-sm">Invalid parameters or malformed request</p>
                                </div>
                                <div className="border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                                    <h5 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">429 Too Many Requests</h5>
                                    <p className="text-orange-800 dark:text-orange-200 text-sm">Rate limit exceeded (1000 requests/hour)</p>
                                </div>
                                <div className="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                                    <h5 className="font-semibold text-red-900 dark:text-red-100 mb-2">500 Internal Server Error</h5>
                                    <p className="text-red-800 dark:text-red-200 text-sm">Server error - please try again later</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Support & Contact</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Need help with API integration or have questions?
                            </p>
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                <p className="text-gray-900 dark:text-gray-100 font-medium">Developer Support: api@sustainabilityportal.org</p>
                                <p className="text-gray-700 dark:text-gray-300">Documentation: docs.sustainabilityportal.org</p>
                                <p className="text-gray-700 dark:text-gray-300">Status Page: status.sustainabilityportal.org</p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-6">
                        API Version 1.0 | Last updated: June 2025
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}