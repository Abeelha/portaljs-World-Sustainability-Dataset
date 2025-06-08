'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Database, Calendar, Globe, Download, Search, Filter, X, SortAsc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { sustainabilityDataProcessor, DatasetInfo } from '@/lib/data-processing';

export default function CatalogPage() {
    const [datasetInfo, setDatasetInfo] = useState<DatasetInfo | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<'downloads' | 'updated' | 'title'>('downloads');

    useEffect(() => {
        const loadData = async () => {
            try {
                await sustainabilityDataProcessor.loadData();
                setDatasetInfo(sustainabilityDataProcessor.getDatasetInfo());
            } catch (error) {
                console.error('Failed to load dataset:', error);
            }
        };

        loadData();
    }, []);

    const datasets = [
        {
            id: 'world-sustainability',
            title: 'World Sustainability Dataset',
            description: 'Comprehensive sustainability metrics covering environmental, social, and economic indicators across 173 countries over 19 years.',
            metrics: 54,
            countries: 173,
            yearRange: '2000-2020',
            size: '1.4MB',
            format: 'CSV',
            tags: ['Environment', 'Social', 'Economic', 'Global', 'Time Series'],
            lastUpdated: '2024-06-07',
            downloads: 1247,
            featured: true
        },
        {
            id: 'environmental-indicators',
            title: 'Environmental Performance Indicators',
            description: 'Focused environmental metrics including carbon emissions, renewable energy, air quality, and biodiversity indices.',
            metrics: 28,
            countries: 173,
            yearRange: '2000-2020',
            size: '850KB',
            format: 'CSV',
            tags: ['Environment', 'Climate', 'Energy', 'Emissions'],
            lastUpdated: '2024-06-07',
            downloads: 892,
            featured: false
        },
        {
            id: 'social-development',
            title: 'Social Development Metrics',
            description: 'Education, healthcare, gender equality, and human development indicators across countries and time.',
            metrics: 16,
            countries: 173,
            yearRange: '2000-2020',
            size: '620KB',
            format: 'CSV',
            tags: ['Social', 'Education', 'Healthcare', 'Development'],
            lastUpdated: '2024-06-07',
            downloads: 634,
            featured: false
        },
        {
            id: 'economic-indicators',
            title: 'Economic Sustainability Indicators',
            description: 'GDP, income inequality, employment, and economic development metrics for comprehensive analysis.',
            metrics: 10,
            countries: 173,
            yearRange: '2000-2020',
            size: '480KB',
            format: 'CSV',
            tags: ['Economic', 'GDP', 'Income', 'Employment'],
            lastUpdated: '2024-06-07',
            downloads: 756,
            featured: false
        }
    ];

    const allTags = [...new Set(datasets.flatMap(d => d.tags))];

    const filteredDatasets = datasets
        .filter(dataset => {
            const matchesSearch = dataset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                dataset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                dataset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesTags = selectedTags.length === 0 ||
                selectedTags.some(tag => dataset.tags.includes(tag));

            return matchesSearch && matchesTags;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'downloads':
                    return b.downloads - a.downloads;
                case 'updated':
                    return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
                case 'title':
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const clearFilters = () => {
        setSelectedTags([]);
        setSearchTerm('');
        setSortBy('downloads');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
            <Header />

            <main className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-8">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Home
                            </Link>
                        </Button>
                    </div>

                    <div className="mb-12">
                        <div className="text-center mb-8">
                            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-gray-200 bg-clip-text text-transparent mb-4">
                                Dataset Catalog
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                                Explore our comprehensive collection of sustainability datasets
                            </p>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        placeholder="Search datasets..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Select value={sortBy} onValueChange={(value: 'downloads' | 'updated' | 'title') => setSortBy(value)}>
                                        <SelectTrigger className="w-40 text-gray-900 dark:text-gray-100">
                                            <SortAsc className="w-4 h-4 mr-2" />
                                            <SelectValue placeholder="Sort by" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="downloads">Most Downloaded</SelectItem>
                                            <SelectItem value="updated">Recently Updated</SelectItem>
                                            <SelectItem value="title">Title A-Z</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2 text-gray-900 dark:text-gray-100 dark:hover:text-gray-900">
                                        <X className="w-4 h-4" />
                                        Clear
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by tags:</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {allTags.map(tag => (
                                        <Badge
                                            key={tag}
                                            variant={selectedTags.includes(tag) ? "default" : "outline"}
                                            className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900"
                                            onClick={() => toggleTag(tag)}
                                        >
                                            {tag}
                                            {selectedTags.includes(tag) && (
                                                <X className="w-3 h-3 ml-1" />
                                            )}
                                        </Badge>
                                    ))}
                                </div>
                                {(selectedTags.length > 0 || searchTerm) && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Showing {filteredDatasets.length} of {datasets.length} datasets
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                            <div className="stats-card p-6 text-center">
                                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                                    {datasetInfo?.countries || 173}
                                </div>
                                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Countries</div>
                            </div>
                            <div className="stats-card p-6 text-center">
                                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                    {datasetInfo ? datasetInfo.yearRange[1] - datasetInfo.yearRange[0] + 1 : 19}
                                </div>
                                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Years</div>
                            </div>
                            <div className="stats-card p-6 text-center">
                                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">{datasets.length}</div>
                                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Datasets</div>
                            </div>
                            <div className="stats-card p-6 text-center">
                                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                                    {datasetInfo?.totalRecords.toLocaleString() || '3,287'}
                                </div>
                                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Records</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {filteredDatasets.map((dataset) => (
                            <Card key={dataset.id} className={`data-card h-full ${dataset.featured ? 'featured-dataset' : ''}`}>
                                <CardHeader className="pb-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                                                    {dataset.title}
                                                </CardTitle>
                                                {dataset.featured && (
                                                    <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                                                        Featured
                                                    </span>
                                                )}
                                            </div>
                                            <CardDescription className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
                                                {dataset.description}
                                            </CardDescription>
                                        </div>
                                        <div className="ml-6 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                            <Database className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center gap-3 p-3 bg-gray-50/50 dark:bg-gray-800/30 rounded-lg">
                                                <Database className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{dataset.metrics}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">metrics</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50/50 dark:bg-gray-800/30 rounded-lg">
                                                <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{dataset.countries}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">countries</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50/50 dark:bg-gray-800/30 rounded-lg">
                                                <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{dataset.yearRange}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">years</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50/50 dark:bg-gray-800/30 rounded-lg">
                                                <Download className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{dataset.downloads}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">downloads</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {dataset.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-600"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                {dataset.format} • {dataset.size}
                                            </div>
                                            <div className="flex gap-3">
                                                <Button asChild variant="outline" size="sm" className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800">
                                                    <Link href={`/dataset/${dataset.id}`}>
                                                        View Details
                                                    </Link>
                                                </Button>
                                                <Button asChild size="sm" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium shadow-sm hover:shadow-md transition-all duration-200">
                                                    <Link href="/explorer">
                                                        Explore Data
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {filteredDatasets.length === 0 && (
                        <div className="text-center py-12">
                            <Database className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No datasets found</h3>
                            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search terms or filters</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}