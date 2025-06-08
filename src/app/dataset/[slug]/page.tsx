'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, FileText, Database, BarChart3, Calendar, Globe, Table } from 'lucide-react';
import { loadSustainabilityData } from '@/lib/data-processing';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import {
    ArrowLeft,
    Share2
} from 'lucide-react';
import { sustainabilityDataProcessor, DatasetInfo } from '@/lib/data-processing';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default function DatasetPage({ params }: PageProps) {
    const [data, setData] = useState<Record<string, unknown>[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [slug, setSlug] = useState<string>('')

    useEffect(() => {
        const getParams = async () => {
            const resolvedParams = await params
            setSlug(resolvedParams.slug)
        }
        getParams()
    }, [params])

    useEffect(() => {
        if (!slug) return

        const loadData = async () => {
            try {
                setLoading(true)
                const result = await loadSustainabilityData()
                setData(result.data)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load data')
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [slug])

    const datasets = {
        'world-sustainability': {
            id: 'world-sustainability',
            title: 'World Sustainability Dataset',
            description: 'Comprehensive sustainability metrics covering environmental, social, and economic indicators across 173 countries over 19 years. This dataset provides a holistic view of global sustainability trends and enables deep analysis of country performance across multiple dimensions.',
            longDescription: `This dataset represents one of the most comprehensive collections of sustainability indicators available, covering 173 countries across a 19-year period from 2000 to 2020. The data encompasses 54 distinct metrics organized into three primary categories:

**Environmental Indicators**: Carbon emissions, renewable energy adoption, air quality indices, water quality, forest coverage, and biodiversity metrics.

**Social Indicators**: Education access and quality, healthcare metrics, gender equality indices, human development indicators, and social protection measures.

**Economic Indicators**: GDP metrics, income inequality measures, employment rates, economic diversification indices, and sustainable development financing.

The dataset has been carefully curated and validated to ensure consistency and reliability across different sources and time periods.`,
            metrics: 54,
            countries: 173,
            yearRange: '2000-2020',
            size: '1.4MB',
            format: 'CSV',
            tags: ['Environment', 'Social', 'Economic', 'Global', 'Time Series'],
            lastUpdated: '2024-06-07',
            downloads: 1247,
            source: 'Kaggle TrueCue Women+Data Hackathon',
            license: 'MIT License',
            featured: true,
            methodology: 'Data collected from UN databases, World Bank, OECD, and other international organizations',
            updateFrequency: 'Annual',
            dataQuality: 95
        }
    };

    const dataset = datasets[slug as keyof typeof datasets] || datasets['world-sustainability'];

    const downloadDataset = (format: string) => {
        if (format === 'csv') {
            const link = document.createElement('a');
            link.href = '/data/WorldSustainabilityDataset.csv';
            link.download = 'WorldSustainabilityDataset.csv';
            link.click();
        } else if (format === 'json') {
            const jsonData = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'WorldSustainabilityDataset.json';
            link.click();
        }
    };

    if (!dataset) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-950 dark:to-black">
                <Header />
                <main className="py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Dataset Not Found</h1>
                        <p className="text-gray-600 dark:text-gray-300 mb-8">The requested dataset could not be found.</p>
                        <Button asChild>
                            <Link href="/catalog">Back to Catalog</Link>
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-950 dark:to-black">
            <Header />

            <main className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Button asChild variant="ghost" className="mb-4">
                            <Link href="/">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Home
                            </Link>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-3xl mb-2">{dataset.title}</CardTitle>
                                            <CardDescription className="text-lg">
                                                {dataset.description}
                                            </CardDescription>
                                        </div>
                                        {dataset.featured && (
                                            <Badge className="bg-green-100 text-green-800">Featured</Badge>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {dataset.tags.map((tag) => (
                                            <Badge key={tag} variant="secondary">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <Database className="w-12 h-12 text-blue-600 mx-auto mb-1" />
                                            <div className="font-semibold text-gray-900 dark:text-white">{dataset.metrics}</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Metrics</div>
                                        </div>
                                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <Globe className="w-12 h-12 text-green-600 mx-auto mb-1" />
                                            <div className="font-semibold text-gray-900 dark:text-white">{dataset.countries}</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Countries</div>
                                        </div>
                                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <Calendar className="w-12 h-12 text-purple-600 mx-auto mb-1" />
                                            <div className="font-semibold text-gray-900 dark:text-white">{dataset.yearRange}</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Years</div>
                                        </div>
                                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <Download className="w-12 h-12 text-orange-600 mx-auto mb-1" />
                                            <div className="font-semibold text-gray-900 dark:text-white">{dataset.downloads}</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Downloads</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        About This Dataset
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="prose prose-gray max-w-none dark:prose-invert">
                                        <div className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                                            {dataset.longDescription}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Table className="w-5 h-5" />
                                        Data Preview
                                    </CardTitle>
                                    <CardDescription>
                                        Sample of the first 10 records
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {loading ? (
                                        <div className="text-center py-8 text-gray-500">
                                            Loading preview data...
                                        </div>
                                    ) : error ? (
                                        <div className="text-center py-8 text-red-500">
                                            {error}
                                        </div>
                                    ) : data.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full text-sm">
                                                <thead>
                                                    <tr className="border-b">
                                                        <th className="text-left py-2 px-3 font-medium">Country</th>
                                                        <th className="text-left py-2 px-3 font-medium">Year</th>
                                                        <th className="text-left py-2 px-3 font-medium">Region</th>
                                                        <th className="text-left py-2 px-3 font-medium">Income Group</th>
                                                        <th className="text-left py-2 px-3 font-medium">Carbon Emissions</th>
                                                        <th className="text-left py-2 px-3 font-medium">Renewable Energy</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data.slice(0, 10).map((row, index) => (
                                                        <tr key={index} className="border-b">
                                                            <td className="py-2 px-3">{String(row.Country || 'N/A')}</td>
                                                            <td className="py-2 px-3">{String(row.Year || 'N/A')}</td>
                                                            <td className="py-2 px-3">{String(row.Region || 'N/A')}</td>
                                                            <td className="py-2 px-3">{String(row['Income group'] || 'N/A')}</td>
                                                            <td className="py-2 px-3">{String(row['Carbon emissions (metric tons per capita)'] || 'N/A')}</td>
                                                            <td className="py-2 px-3">{String(row['Renewable energy consumption (% of total final energy consumption)'] || 'N/A')}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            No data found
                                        </div>
                                    )}

                                    <div className="mt-4 flex gap-2">
                                        <Button asChild size="sm">
                                            <Link href="/explorer">
                                                <Eye className="w-4 h-4 mr-2" />
                                                Explore Full Dataset
                                            </Link>
                                        </Button>
                                        <Button asChild variant="outline" size="sm">
                                            <Link href="/catalog">
                                                <BarChart3 className="w-4 h-4 mr-2" />
                                                View Visualizations
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Download Dataset</CardTitle>
                                    <CardDescription>
                                        Get the complete dataset in your preferred format
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button
                                        onClick={() => downloadDataset('csv')}
                                        className="w-full bg-green-600 hover:bg-green-700"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download CSV ({dataset.size})
                                    </Button>
                                    <Button
                                        onClick={() => downloadDataset('json')}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download JSON
                                    </Button>
                                    <Button variant="outline" className="w-full">
                                        <Share2 className="w-4 h-4 mr-2" />
                                        Share Dataset
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Dataset Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">Source</div>
                                        <div className="text-sm">{dataset.source}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">License</div>
                                        <div className="text-sm">{dataset.license}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">Last Updated</div>
                                        <div className="text-sm">{dataset.lastUpdated}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">Update Frequency</div>
                                        <div className="text-sm">{dataset.updateFrequency}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">Data Quality</div>
                                        <div className="text-sm">{dataset.dataQuality}%</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">Methodology</div>
                                        <div className="text-sm">{dataset.methodology}</div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Button asChild variant="outline" className="w-full">
                                        <Link href="/explorer">
                                            <BarChart3 className="w-4 h-4 mr-2" />
                                            Data Explorer
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline" className="w-full">
                                        <Link href="/insights">
                                            <Eye className="w-4 h-4 mr-2" />
                                            AI Insights
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline" className="w-full">
                                        <Link href="/catalog">
                                            <Database className="w-4 h-4 mr-2" />
                                            View All Datasets
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}