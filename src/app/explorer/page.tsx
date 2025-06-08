'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Filter, Download, BarChart3, Table as TableIcon, Map, TrendingUp, Database, Globe, Zap, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import GradientCard from '@/components/ui/gradient-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { sustainabilityDataProcessor, SustainabilityData } from '@/lib/data-processing';
import { DataTable } from '@/components/DataTable';
import { DataVisualizations } from '@/components/DataVisualizations';

export default function ExplorerPage() {
    const searchParams = useSearchParams();
    const [data, setData] = useState<SustainabilityData[]>([]);
    const [filteredData, setFilteredData] = useState<SustainabilityData[]>([]);
    const [loading, setLoading] = useState(true);
    const [countries, setCountries] = useState<string[]>([]);
    const [regions, setRegions] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);

    const [filters, setFilters] = useState({
        country: 'all',
        region: 'all',
        year: 'all',
        incomeGroup: 'all'
    });

    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                await sustainabilityDataProcessor.loadData();
                const allData = sustainabilityDataProcessor.getAllData();
                setData(allData);
                setFilteredData(allData);

                const uniqueCountries = sustainabilityDataProcessor.getUniqueCountries();
                const uniqueRegions = sustainabilityDataProcessor.getUniqueRegions();

                setCountries(uniqueCountries);
                setRegions(uniqueRegions);

                const countryParam = searchParams.get('country');
                if (countryParam && uniqueCountries.includes(countryParam)) {
                    setFilters(prev => ({ ...prev, country: countryParam }));
                }

                setLoading(false);
            } catch (error) {
                console.error('Failed to load data:', error);
                setLoading(false);
            }
        };

        loadData();
    }, []);

    useEffect(() => {
        let filtered = [...data];

        if (filters.country && filters.country !== 'all') {
            filtered = filtered.filter(item => item.Country === filters.country);
        }
        if (filters.region && filters.region !== 'all') {
            filtered = filtered.filter(item => item.Region === filters.region);
        }
        if (filters.year && filters.year !== 'all') {
            filtered = filtered.filter(item => item.Year.toString() === filters.year);
        }
        if (filters.incomeGroup && filters.incomeGroup !== 'all') {
            filtered = filtered.filter(item => item['Income group'] === filters.incomeGroup);
        }

        setFilteredData(filtered);
        setCurrentPage(1);
    }, [filters, data]);

    useEffect(() => {
        if (searchParams.get('country')) {
            setSelectedCountries([searchParams.get('country')!]);
        }
    }, [searchParams]);

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({ country: 'all', region: 'all', year: 'all', incomeGroup: 'all' });
    };

    const exportData = (format: 'csv' | 'json') => {
        if (format === 'csv') {
            const headers = Object.keys(filteredData[0] || {});
            const csvContent = [
                headers.join(','),
                ...filteredData.map(row =>
                    headers.map(header => {
                        const value = row[header as keyof SustainabilityData];
                        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
                    }).join(',')
                )
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'filtered_sustainability_data.csv';
            link.click();
        } else {
            const jsonContent = JSON.stringify(filteredData, null, 2);
            const blob = new Blob([jsonContent], { type: 'application/json' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'filtered_sustainability_data.json';
            link.click();
        }
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const getStatistics = () => {
        if (filteredData.length === 0) return null;

        const carbonEmissions = filteredData
            .map(d => d['Carbon emissions (metric tons per capita)'])
            .filter(val => val !== null && val !== undefined && !isNaN(Number(val)))
            .map(Number);

        const renewableEnergy = filteredData
            .map(d => d['Renewable energy consumption (% of total final energy consumption)'])
            .filter(val => val !== null && val !== undefined && !isNaN(Number(val)))
            .map(Number);

        return {
            totalRecords: filteredData.length,
            avgCarbonEmissions: carbonEmissions.length > 0 ?
                (carbonEmissions.reduce((a, b) => a + b, 0) / carbonEmissions.length).toFixed(2) : 'N/A',
            avgRenewableEnergy: renewableEnergy.length > 0 ?
                (renewableEnergy.reduce((a, b) => a + b, 0) / renewableEnergy.length).toFixed(2) : 'N/A',
            uniqueCountries: [...new Set(filteredData.map(d => d.Country))].length,
            yearRange: filteredData.length > 0 ?
                `${Math.min(...filteredData.map(d => d.Year))} - ${Math.max(...filteredData.map(d => d.Year))}` : 'N/A'
        };
    };

    const stats = getStatistics();

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-950 dark:to-black">
                <Header />
                <main className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Loading Data Explorer</h2>
                        <p className="text-gray-600">Please wait while we load the sustainability dataset...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-950 dark:to-black transition-colors duration-500">
            <Header />

            <main className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-8">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Home
                            </Link>
                        </Button>
                    </div>

                    <div className="mb-8">
                        {searchParams.get('country') && (
                            <nav className="flex mb-4" aria-label="Breadcrumb">
                                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                                    <li className="inline-flex items-center">
                                        <Link href="/countries" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400">
                                            Country Profiles
                                        </Link>
                                    </li>
                                    <li>
                                        <div className="flex items-center">
                                            <span className="mx-2 text-gray-400">/</span>
                                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                {searchParams.get('country')}
                                            </span>
                                        </div>
                                    </li>
                                </ol>
                            </nav>
                        )}
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Data Explorer</h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
                            Explore and analyze sustainability data with interactive filters and visualizations
                            {searchParams.get('country') && (
                                <span className="block text-green-600 dark:text-green-400 mt-1">
                                    Showing data for {searchParams.get('country')}
                                </span>
                            )}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Filters</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Country</label>
                                    <Select value={filters.country} onValueChange={(value) => handleFilterChange('country', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Countries" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Countries</SelectItem>
                                            {countries.map(country => (
                                                <SelectItem key={country} value={country}>{country}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Region</label>
                                    <Select value={filters.region} onValueChange={(value) => handleFilterChange('region', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Regions" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Regions</SelectItem>
                                            {regions.filter(region => region !== "Unknown").map(region => (
                                                <SelectItem key={region} value={region}>{region}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Year</label>
                                    <Select value={filters.year} onValueChange={(value) => handleFilterChange('year', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Years" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Years</SelectItem>
                                            {Array.from({ length: 21 }, (_, i) => 2000 + i).map(year => (
                                                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Income Group</label>
                                    <Select value={filters.incomeGroup} onValueChange={(value) => handleFilterChange('incomeGroup', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Income Groups" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Income Groups</SelectItem>
                                            <SelectItem value="High income">High income</SelectItem>
                                            <SelectItem value="Upper middle income">Upper middle income</SelectItem>
                                            <SelectItem value="Lower middle income">Lower middle income</SelectItem>
                                            <SelectItem value="Low income">Low income</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="pt-2 space-y-2">
                                    <Button onClick={clearFilters} variant="outline" className="w-full">
                                        <Filter className="w-4 h-4 mr-2" />
                                        Clear Filters
                                    </Button>
                                    <Button onClick={() => exportData('csv')} variant="outline" className="w-full">
                                        <Download className="w-4 h-4 mr-2" />
                                        Export CSV
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="lg:col-span-3 space-y-6">
                            {stats && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <GradientCard
                                        title="Total Records"
                                        value={stats.totalRecords}
                                        icon={Database}
                                        gradient="from-emerald-500 to-teal-600"
                                        delay={0}
                                    />
                                    <GradientCard
                                        title="Countries"
                                        value={stats.uniqueCountries}
                                        icon={Globe}
                                        gradient="from-blue-500 to-indigo-600"
                                        delay={0.1}
                                    />
                                    <GradientCard
                                        title="Avg Carbon Emissions"
                                        value={stats.avgCarbonEmissions}
                                        icon={Zap}
                                        gradient="from-red-500 to-pink-600"
                                        delay={0.2}
                                    />
                                    <GradientCard
                                        title="Avg Renewable Energy"
                                        value={`${stats.avgRenewableEnergy}%`}
                                        icon={Leaf}
                                        gradient="from-green-500 to-emerald-600"
                                        delay={0.3}
                                    />
                                </div>
                            )}

                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="flex items-center gap-2">
                                                <TableIcon className="w-5 h-5" />
                                                Data Table
                                            </CardTitle>
                                            <CardDescription>
                                                Showing {startIndex + 1}-{Math.min(endIndex, filteredData.length)} of {filteredData.length} records
                                            </CardDescription>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button asChild variant="outline" size="sm">
                                                <Link href="/insights">
                                                    <BarChart3 className="w-4 h-4 mr-2" />
                                                    View Charts
                                                </Link>
                                            </Button>
                                            <Button onClick={() => exportData('json')} variant="outline" size="sm">
                                                <Download className="w-4 h-4 mr-2" />
                                                Export JSON
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {paginatedData.length > 0 ? (
                                        <>
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full text-sm">
                                                    <thead>
                                                        <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                                                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Country</th>
                                                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Year</th>
                                                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Region</th>
                                                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Income Group</th>
                                                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Carbon Emissions</th>
                                                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Renewable Energy</th>
                                                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">GDP per Capita</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {paginatedData.map((row, index) => (
                                                            <tr key={`${row.Country}-${row.Year}-${index}`} className="border-b border-gray-200 dark:border-gray-700 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-200">
                                                                <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">{row.Country}</td>
                                                                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{row.Year}</td>
                                                                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{row.Region}</td>
                                                                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{row['Income group']}</td>
                                                                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                                                                    {row['Carbon emissions (metric tons per capita)'] || 'N/A'}
                                                                </td>
                                                                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                                                                    {row['Renewable energy consumption (% of total final energy consumption)'] || 'N/A'}
                                                                </td>
                                                                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                                                                    {row['GDP per capita (current US$)'] || 'N/A'}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {totalPages > 1 && (
                                                <div className="flex items-center justify-between mt-6">
                                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                                        Page {currentPage} of {totalPages}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                                            disabled={currentPage === 1}
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            Previous
                                                        </Button>
                                                        <Button
                                                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                                            disabled={currentPage === totalPages}
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            Next
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-center py-12">
                                            <TableIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">No data found</h3>
                                            <p className="text-gray-500">Try adjusting your filters to see more results</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5" />
                                            Quick Insights
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Year Range:</span>
                                                <span className="font-medium text-gray-900 dark:text-gray-100">{stats?.yearRange}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Countries Covered:</span>
                                                <span className="font-medium text-gray-900 dark:text-gray-100">{stats?.uniqueCountries}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Avg Carbon Emissions:</span>
                                                <span className="font-medium text-gray-900 dark:text-gray-100">{stats?.avgCarbonEmissions} mt/capita</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Avg Renewable Energy:</span>
                                                <span className="font-medium text-gray-900 dark:text-gray-100">{stats?.avgRenewableEnergy}%</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Explore More</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <Button asChild variant="outline" className="w-full">
                                            <Link href="/insights">
                                                <BarChart3 className="w-4 h-4 mr-2" />
                                                View Visualizations
                                            </Link>
                                        </Button>
                                        <Button asChild variant="outline" className="w-full">
                                            <Link href="/catalog">
                                                <TableIcon className="w-4 h-4 mr-2" />
                                                Browse Datasets
                                            </Link>
                                        </Button>
                                        <Button asChild variant="outline" className="w-full">
                                            <Link href="/countries">
                                                <Map className="w-4 h-4 mr-2" />
                                                Country Profiles
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}