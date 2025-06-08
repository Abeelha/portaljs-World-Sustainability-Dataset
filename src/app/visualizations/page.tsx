'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowLeft, BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, Filter, Download, Loader2, Globe, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { sustainabilityDataProcessor, SustainabilityData } from '@/lib/data-processing';

type ChartType = 'bar' | 'line' | 'pie';
type MetricType = 'carbon' | 'renewable' | 'gdp' | 'life_expectancy' | 'forest' | 'population';

interface ChartData {
    name: string;
    value: number;
    country?: string;
    region?: string;
    year?: number;
}

export default function VisualizationsPage() {
    const [data, setData] = useState<SustainabilityData[]>([]);
    const [loading, setLoading] = useState(true);
    const [chartType, setChartType] = useState<ChartType>('bar');
    const [selectedMetric, setSelectedMetric] = useState<MetricType>('carbon');
    const [selectedYear, setSelectedYear] = useState<number>(2018);
    const [selectedRegion, setSelectedRegion] = useState<string>('all');
    const [topN, setTopN] = useState<number>(10);

    useEffect(() => {
        const loadData = async () => {
            try {
                await sustainabilityDataProcessor.loadData();
                const allData = sustainabilityDataProcessor.getAllData();
                setData(allData);
                setLoading(false);
            } catch (error) {
                console.error('Failed to load data:', error);
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const metrics = {
        carbon: {
            key: 'Annual production-based emissions of carbon dioxide (CO2), measured in million tonnes',
            label: 'Carbon Emissions (Million Tonnes)',
            color: '#ef4444',
            description: 'Annual CO2 emissions in million tonnes'
        },
        renewable: {
            key: 'Renewable energy consumption (% of total final energy consumption) - EG.FEC.RNEW.ZS',
            label: 'Renewable Energy (%)',
            color: '#22c55e',
            description: 'Percentage of renewable energy in total consumption'
        },
        gdp: {
            key: 'GDP per capita (current US$) - NY.GDP.PCAP.CD',
            label: 'GDP per Capita (USD)',
            color: '#3b82f6',
            description: 'Economic output per person in USD'
        },
        life_expectancy: {
            key: 'Life expectancy at birth, total (years) - SP.DYN.LE00.IN',
            label: 'Life Expectancy (years)',
            color: '#8b5cf6',
            description: 'Average lifespan at birth'
        },
        forest: {
            key: 'Access to electricity (% of population) - EG.ELC.ACCS.ZS',
            label: 'Electricity Access (%)',
            color: '#10b981',
            description: 'Percentage of population with access to electricity'
        },
        population: {
            key: 'Population, total - SP.POP.TOTL',
            label: 'Total Population',
            color: '#f59e0b',
            description: 'Total country population'
        }
    };

    const uniqueYears = useMemo(() => {
        const years = [...new Set(data.map(d => d.Year))].sort((a, b) => b - a);
        return years;
    }, [data]);

    const uniqueRegions = useMemo(() => {
        return [...new Set(data.map(d => d.Region).filter(Boolean))].sort();
    }, [data]);

    const chartData = useMemo(() => {
        const metric = metrics[selectedMetric];
        let filteredData = data.filter(d => d.Year === selectedYear);

        if (selectedRegion !== 'all') {
            filteredData = filteredData.filter(d => d.Region === selectedRegion);
        }

        const processedData = filteredData
            .map(d => ({
                name: d.Country,
                value: Number(d[metric.key as keyof SustainabilityData]) || 0,
                country: d.Country,
                region: d.Region,
                year: d.Year
            }))
            .filter(d => d.value > 0)
            .sort((a, b) => b.value - a.value)
            .slice(0, topN);

        return processedData;
    }, [data, selectedMetric, selectedYear, selectedRegion, topN]);

    const timeSeriesData = useMemo(() => {
        if (chartType !== 'line') return [];

        const metric = metrics[selectedMetric];
        const topCountries = chartData.slice(0, topN).map(d => d.country);

        const yearlyData = uniqueYears.map(year => {
            const yearData: any = { year };

            topCountries.forEach(country => {
                const countryData = data.find(d => d.Country === country && d.Year === year);
                if (countryData) {
                    yearData[country] = Number(countryData[metric.key as keyof SustainabilityData]) || 0;
                }
            });

            return yearData;
        }).sort((a, b) => a.year - b.year);

        return yearlyData;
    }, [data, selectedMetric, chartData, uniqueYears, chartType, topN]);

    const generateColors = (count: number) => {
        const baseColors = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];
        return Array.from({ length: count }, (_, i) => baseColors[i % baseColors.length]);
    };

    const downloadChart = () => {
        const csvContent = chartData
            .map(row => `${row.name},${row.value}`)
            .join('\n');

        const blob = new Blob([`Country,${metrics[selectedMetric].label}\n${csvContent}`],
            { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${selectedMetric}_${selectedYear}_chart_data.csv`;
        link.click();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-950 dark:to-black">
                <Header />
                <main className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <Loader2 className="animate-spin h-12 w-12 text-green-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Loading Visualizations</h2>
                        <p className="text-gray-600 dark:text-gray-300">Preparing interactive charts and graphs...</p>
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
                    <div className="flex items-center gap-4 mb-8">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Home
                            </Link>
                        </Button>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Data Visualizations</h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            Interactive charts and graphs showing sustainability metrics across countries and time
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Filter className="w-5 h-5" />
                                    Filters
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Chart Type</label>
                                    <Select value={chartType} onValueChange={(value: ChartType) => setChartType(value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="bar">
                                                <div className="flex items-center gap-2">
                                                    <BarChart3 className="w-4 h-4" />
                                                    Bar Chart
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="line">
                                                <div className="flex items-center gap-2">
                                                    <LineChartIcon className="w-4 h-4" />
                                                    Time Series
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="pie">
                                                <div className="flex items-center gap-2">
                                                    <PieChartIcon className="w-4 h-4" />
                                                    Pie Chart
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Metric</label>
                                    <Select value={selectedMetric} onValueChange={(value: MetricType) => setSelectedMetric(value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(metrics).map(([key, metric]) => (
                                                <SelectItem key={key} value={key}>
                                                    {metric.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Year</label>
                                    <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(Number(value))}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {uniqueYears.map(year => (
                                                <SelectItem key={year} value={year.toString()}>
                                                    {year}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Region</label>
                                    <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Regions</SelectItem>
                                            {uniqueRegions.map(region => (
                                                <SelectItem key={region} value={region}>
                                                    {region}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Show Top</label>
                                    <Select
                                        value={topN.toString()}
                                        onValueChange={(value) => {
                                            setTopN(Number(value));
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={`Top ${topN}`} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="5">Top 5</SelectItem>
                                            <SelectItem value="10">Top 10</SelectItem>
                                            <SelectItem value="15">Top 15</SelectItem>
                                            <SelectItem value="20">Top 20</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Badge variant="secondary" className="ml-2">
                                        Top {topN}
                                    </Badge>
                                </div>

                                <Button onClick={downloadChart} className="w-full" variant="outline">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Data
                                </Button>
                            </CardContent>
                        </Card>

                        <div className="lg:col-span-3">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {chartType === 'bar' && <BarChart3 className="w-5 h-5" />}
                                            {chartType === 'line' && <LineChartIcon className="w-5 h-5" />}
                                            {chartType === 'pie' && <PieChartIcon className="w-5 h-5" />}
                                            {metrics[selectedMetric].label}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline">
                                                Top {topN}
                                            </Badge>
                                            <Badge variant="secondary">
                                                {chartType === 'line' ? `${uniqueYears[uniqueYears.length - 1]}-${uniqueYears[0]}` : selectedYear}
                                            </Badge>
                                        </div>
                                    </CardTitle>
                                    <CardDescription>
                                        {metrics[selectedMetric].description}
                                        {selectedRegion !== 'all' && ` • ${selectedRegion}`}
                                        • Showing {chartData.length} countries
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-96 w-full">
                                        {chartType === 'bar' && (
                                            <ResponsiveContainer width="100%" height="100%" key={`bar-${topN}-${selectedMetric}-${selectedYear}-${selectedRegion}`}>
                                                <BarChart data={chartData}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis
                                                        dataKey="name"
                                                        angle={-45}
                                                        textAnchor="end"
                                                        height={60}
                                                        fontSize={12}
                                                    />
                                                    <YAxis />
                                                    <Tooltip
                                                        formatter={(value) => [Number(value).toLocaleString(), metrics[selectedMetric].label]}
                                                        labelFormatter={(label) => `Country: ${label}`}
                                                    />
                                                    <Bar
                                                        dataKey="value"
                                                        fill={metrics[selectedMetric].color}
                                                        radius={[4, 4, 0, 0]}
                                                    />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        )}

                                        {chartType === 'line' && (
                                            <ResponsiveContainer width="100%" height="100%" key={`line-${topN}-${selectedMetric}-${selectedYear}-${selectedRegion}`}>
                                                <LineChart data={timeSeriesData}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="year" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Legend />
                                                    {chartData.slice(0, topN).map((country, index) => (
                                                        <Line
                                                            key={country.country}
                                                            type="monotone"
                                                            dataKey={country.country}
                                                            stroke={generateColors(topN)[index]}
                                                            strokeWidth={2}
                                                            dot={{ r: 4 }}
                                                        />
                                                    ))}
                                                </LineChart>
                                            </ResponsiveContainer>
                                        )}

                                        {chartType === 'pie' && (
                                            <ResponsiveContainer width="100%" height="100%" key={`pie-${topN}-${selectedMetric}-${selectedYear}-${selectedRegion}`}>
                                                <PieChart>
                                                    <Pie
                                                        data={chartData}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        label={({ name, value, percent }) =>
                                                            `${name}: ${(percent! * 100).toFixed(1)}%`
                                                        }
                                                        outerRadius={120}
                                                        fill="#8884d8"
                                                        dataKey="value"
                                                    >
                                                        {chartData.map((entry, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={generateColors(chartData.length)[index]}
                                                            />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip
                                                        formatter={(value) => [Number(value).toLocaleString(), metrics[selectedMetric].label]}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                    {chartData.length}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Countries</p>
                                            </div>
                                            <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                    {selectedYear}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Selected Year</p>
                                            </div>
                                            <Calendar className="w-8 h-8 text-green-600 dark:text-green-400" />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                                    {chartData.length > 0 ? chartData[0].value.toLocaleString() : '0'}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Highest Value</p>
                                            </div>
                                            <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                                        </div>
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