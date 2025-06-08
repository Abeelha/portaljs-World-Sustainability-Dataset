'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Map, Globe, TrendingUp, Users, Zap, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import GradientCard from '@/components/ui/gradient-card';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { sustainabilityDataProcessor, SustainabilityData } from '@/lib/data-processing';

const CountryMap = dynamic(
    () => import('@/components/maps/CountryMap'),
    {
        ssr: false,
        loading: () => (
            <div className="h-96 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
        )
    }
);

export default function CountriesPage() {
    const [data, setData] = useState<SustainabilityData[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalCountries: 0,
        totalRegions: 0,
        avgGDP: 0,
        avgLifeExpectancy: 0,
        avgCarbonEmissions: 0,
        avgRenewableEnergy: 0
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                await sustainabilityDataProcessor.loadData();
                const allData = sustainabilityDataProcessor.getAllData();
                setData(allData);

                const uniqueCountries = sustainabilityDataProcessor.getUniqueCountries();
                const uniqueRegions = sustainabilityDataProcessor.getUniqueRegions();

                const latestData = allData.filter(row => row.Year === Math.max(...allData.map(d => d.Year)));

                const validGDP = latestData
                    .map(d => d['GDP per capita (current US$)'])
                    .filter(val => val !== null && val !== undefined && !isNaN(Number(val)))
                    .map(Number);

                const validLifeExpectancy = latestData
                    .map(d => d['Life expectancy at birth, total (years)'])
                    .filter(val => val !== null && val !== undefined && !isNaN(Number(val)))
                    .map(Number);

                const validCarbonEmissions = latestData
                    .map(d => d['Carbon emissions (metric tons per capita)'])
                    .filter(val => val !== null && val !== undefined && !isNaN(Number(val)))
                    .map(Number);

                const validRenewableEnergy = latestData
                    .map(d => d['Renewable energy consumption (% of total final energy consumption)'])
                    .filter(val => val !== null && val !== undefined && !isNaN(Number(val)))
                    .map(Number);

                setStats({
                    totalCountries: uniqueCountries.length,
                    totalRegions: uniqueRegions.length,
                    avgGDP: validGDP.length > 0 ? validGDP.reduce((a, b) => a + b, 0) / validGDP.length : 0,
                    avgLifeExpectancy: validLifeExpectancy.length > 0 ? validLifeExpectancy.reduce((a, b) => a + b, 0) / validLifeExpectancy.length : 0,
                    avgCarbonEmissions: validCarbonEmissions.length > 0 ? validCarbonEmissions.reduce((a, b) => a + b, 0) / validCarbonEmissions.length : 0,
                    avgRenewableEnergy: validRenewableEnergy.length > 0 ? validRenewableEnergy.reduce((a, b) => a + b, 0) / validRenewableEnergy.length : 0
                });

                setLoading(false);
            } catch (error) {
                console.error('Failed to load data:', error);
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const statCards = [
        {
            title: 'Total Countries',
            value: stats.totalCountries,
            icon: Globe,
            gradient: 'from-blue-500 to-cyan-600',
            description: 'Countries with sustainability data'
        },
        {
            title: 'Regions Covered',
            value: stats.totalRegions,
            icon: Map,
            gradient: 'from-emerald-500 to-teal-600',
            description: 'Geographic regions represented'
        },
        {
            title: 'Avg Life Expectancy',
            value: `${stats.avgLifeExpectancy.toFixed(1)} years`,
            icon: Users,
            gradient: 'from-purple-500 to-indigo-600',
            description: 'Global average lifespan'
        },
        {
            title: 'Avg GDP per Capita',
            value: `$${(stats.avgGDP / 1000).toFixed(1)}K`,
            icon: TrendingUp,
            gradient: 'from-orange-500 to-red-600',
            description: 'Economic prosperity indicator'
        },
        {
            title: 'Avg Carbon Emissions',
            value: `${stats.avgCarbonEmissions.toFixed(1)} MT`,
            icon: Zap,
            gradient: 'from-red-500 to-pink-600',
            description: 'CO2 per capita annually'
        },
        {
            title: 'Avg Renewable Energy',
            value: `${stats.avgRenewableEnergy.toFixed(1)}%`,
            icon: Leaf,
            gradient: 'from-green-500 to-emerald-600',
            description: 'Clean energy consumption'
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-950 dark:to-black transition-colors duration-500">
                <Header />
                <main className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Loading Country Profiles</h2>
                        <p className="text-gray-600 dark:text-gray-400">Please wait while we load the interactive world map...</p>
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

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8"
                    >
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                Country Profiles
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Click on any country to see its sustainability profile, or use the filters below to explore specific regions and metrics. You&apos;ll find comprehensive data spanning 20 years across 54 different sustainability indicators.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {statCards.map((stat, index) => (
                                <GradientCard
                                    key={stat.title}
                                    title={stat.title}
                                    value={stat.value}
                                    description={stat.description}
                                    icon={stat.icon}
                                    gradient={stat.gradient}
                                    delay={index * 0.1}
                                />
                            ))}
                        </div>
                    </motion.div >

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Map className="w-12 h-12" />
                                    Interactive World Map
                                </CardTitle>
                                <CardDescription>
                                    Explore sustainability data by clicking on any country marker. Each green dot represents a country with available data in our database.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CountryMap data={data} loading={loading} />
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>How to Use the Map</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <div>
                                        <p className="font-medium text-sm">Click on Countries</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Click any green marker to view a country's key sustainability metrics
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <div>
                                        <p className="font-medium text-sm">View Details</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Select metrics to highlight on the map using &ldquo;View Details&rdquo; from country popups
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <div>
                                        <p className="font-medium text-sm">Filter by Region</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Use the region filter to focus on specific geographic areas
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Data Coverage</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">19</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Years of Data</div>
                                    </div>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">54+</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Metrics Tracked</div>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                                    Our dataset covers environmental, social, and economic indicators from 2000-2018,
                                    sourced from the World Bank, UN, and other international organizations.
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div >
            </main >

            <Footer />
        </div >
    );
}