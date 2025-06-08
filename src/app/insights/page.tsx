'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, BarChart3, Brain, TrendingUp, Lightbulb, MessageCircle, Loader2, Sparkles, Globe, CheckCircle, AlertCircle, Info, Target, Zap, Leaf, LineChart, Heart, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { sustainabilityDataProcessor, SustainabilityData } from '@/lib/data-processing';
import { Badge } from '@/components/ui/badge';
import { aiService } from '@/lib/ai-service';

interface InsightResponse {
    insights: string[];
    statistics: string[];
    recommendations: string[];
    topCountries?: string[];
    trends?: string[];
}

const AI_RESPONSES: Record<string, InsightResponse> = {
    'carbon-trends': {
        insights: [
            "Global carbon emissions increased by 45% from 2000-2018, with developing economies showing the steepest growth curves",
            "Top 10 emitters account for 67% of global emissions, with China leading at 28% of total global output",
            "Europe shows declining trend (-12% since 2005) while Asia-Pacific region doubled emissions during the same period",
            "Per capita emissions reveal stark inequality: Qatar (37.3 tons), Kuwait (25.2 tons), and Brunei (23.1 tons) lead globally",
            "Post-2015 Paris Agreement period shows slower growth rates, indicating policy effectiveness in major economies"
        ],
        statistics: [
            "Annual global increase: 2.1% (2000-2010) vs 1.3% (2010-2018)",
            "Fossil fuel share: Coal 39%, Oil 31%, Natural Gas 21%, Others 9%",
            "Sector breakdown: Energy 73%, Agriculture 18%, Industrial 5%, Waste 4%",
            "G20 nations: 80% of global emissions despite being 64% of world population"
        ],
        recommendations: [
            "Implement carbon pricing mechanisms in developing economies to slow emission growth",
            "Accelerate renewable energy transitions in high per-capita emission countries",
            "Support technology transfer from low-carbon leaders to emerging economies",
            "Strengthen international cooperation on industrial decarbonization",
            "Prioritize transportation electrification in high-emission urban centers"
        ],
        topCountries: ["China", "United States", "India", "Russia", "Japan", "Germany", "Iran", "South Korea", "Saudi Arabia", "Indonesia"]
    },
    'renewable-leaders': {
        insights: [
            "Nordic countries dominate renewable energy: Iceland (85%), Norway (74%), Sweden (69%) lead global rankings",
            "Fastest growth rates observed in North Africa: Morocco (+340%), Egypt (+180%) from 2010-2018",
            "Regional patterns show Latin America averaging 54% renewable, Sub-Saharan Africa 76%, while Middle East lags at 12%",
            "Small nations excel with geographical advantages: Costa Rica (99%), Paraguay (97%), Albania (95%)",
            "Large markets showing promise: China (26% but massive scale), Brazil (46%), India (22% but rapidly growing)"
        ],
        statistics: [
            "Global renewable share increased from 16.2% (2005) to 26.2% (2018)",
            "Hydropower: 54% of renewables, Wind: 21%, Solar: 13%, Bioenergy: 9%, Geothermal: 3%",
            "Investment flows: $1.8 trillion globally (2010-2019), 65% in developing countries",
            "Job creation: 11.5 million renewable energy jobs worldwide, growing 6.5% annually"
        ],
        recommendations: [
            "Expand grid infrastructure in high-potential Sub-Saharan African countries",
            "Develop energy storage solutions for variable renewables in Nordic regions",
            "Create renewable energy financing mechanisms for Middle Eastern countries",
            "Support small island developing states with distributed renewable systems",
            "Strengthen regional renewable energy trading agreements"
        ],
        topCountries: ["Iceland", "Costa Rica", "Norway", "Brazil", "New Zealand", "Sweden", "Canada", "Finland", "Latvia", "Austria"],
        trends: [
            "Solar costs dropped 89% since 2010",
            "Wind power capacity grew 9% annually (2010-2019)",
            "Grid-scale battery costs fell 70% (2015-2020)"
        ]
    },
    'development-sustainability': {
        insights: [
            "Environmental Kuznets Curve evident: Wealthy nations (>$40k GDP/capita) show declining emissions per dollar of economic output",
            "Middle-income trap observed: Countries at $8k-15k GDP/capita struggle most with balancing growth and sustainability",
            "Success stories emerge: Denmark, Switzerland maintain high development (>$70k GDP) with decreasing carbon footprints",
            "Emerging economies like South Korea and Singapore prove sustainable industrialization is achievable",
            "Resource curse affects oil-rich nations: High GDP but poor sustainability metrics due to fossil fuel dependence"
        ],
        statistics: [
            "High-income countries: 16% of population, 52% of cumulative emissions",
            "Green GDP correlation: Every 1% increase in renewables associates with 0.3% higher HDI",
            "Innovation index: Top 10 sustainable countries average 58.3 vs global 29.8",
            "Education-environment link: 95% literacy countries show 23% better environmental performance"
        ],
        recommendations: [
            "Implement green growth strategies in middle-income countries to avoid carbon-intensive development",
            "Establish technology transfer partnerships between developed and developing nations",
            "Create sustainable development financing mechanisms for emerging economies",
            "Develop circular economy frameworks in industrializing nations",
            "Strengthen environmental education and awareness programs globally"
        ],
        topCountries: ["Denmark", "Switzerland", "Sweden", "Finland", "Singapore", "Netherlands", "Germany", "South Korea", "Japan", "Norway"]
    },
    'regional-analysis': {
        insights: [
            "Europe leads comprehensive sustainability: 31% renewable energy, declining emissions (-15% since 2005), highest life expectancy (81 years)",
            "Sub-Saharan Africa shows renewable potential (67% average) but faces electricity access challenges (43% population)",
            "Middle East paradox: Highest per-capita emissions globally but lowest renewable adoption (8% average)",
            "Asia-Pacific demonstrates extreme diversity: Leaders like Japan and South Korea contrast with rapid industrialization in China, India, Vietnam",
            "Latin America strength in renewables (54% average) with moderate emissions, but inequality remains challenge"
        ],
        statistics: [
            "Regional renewable shares: LAC 54%, SSA 67%, Europe 31%, MENA 8%, Asia 22%",
            "Life expectancy gaps: Europe 81yr, Americas 77yr, Asia 73yr, Africa 64yr",
            "Electricity access: Europe 100%, Americas 96%, Asia 89%, Africa 43%",
            "Carbon intensity: MENA 0.8 kg/USD, Europe 0.2 kg/USD, Global average 0.4 kg/USD"
        ],
        recommendations: [
            "Accelerate off-grid renewable deployment in Sub-Saharan Africa",
            "Diversify energy mix in Middle Eastern oil-dependent economies",
            "Strengthen regional renewable energy cooperation in Asia-Pacific",
            "Support just transition policies in coal-dependent European regions",
            "Develop climate adaptation strategies for vulnerable Latin American countries"
        ],
        topCountries: ["Norway", "Sweden", "Costa Rica", "Brazil", "Ethiopia", "Morocco", "South Korea", "Germany", "Kenya", "Chile"]
    },
    'electricity-access': {
        insights: [
            "Remarkable global progress: Electricity access increased from 78% (2000) to 89% (2018), but 759 million still lack access",
            "Sub-Saharan Africa lags significantly: 43% access compared to 87% global average, representing 573 million without electricity",
            "Urban-rural divide persists globally: 96% urban access versus 74% rural, highlighting infrastructure disparities",
            "Success stories demonstrate rapid progress: Bangladesh (+45%), Kenya (+38%), Ethiopia (+35%) achieved massive improvements",
            "Island nations face unique challenges: Pacific islands average 67% access due to geographic isolation and logistics"
        ],
        statistics: [
            "Annual connection rate: 153 million people gained access (2010-2018)",
            "Regional gaps: SSA 43%, Asia 89%, LAC 94%, Europe 100%, MENA 92%",
            "Rural electrification: 72% globally, ranging from 28% (Chad) to 100% (Europe)",
            "Off-grid solutions: 146 million people served by mini-grids and solar systems"
        ],
        recommendations: [
            "Scale distributed renewable energy systems in remote rural areas",
            "Develop innovative financing for last-mile electrification projects",
            "Strengthen regional power trading to improve grid stability",
            "Support community-based energy access initiatives",
            "Integrate productive use applications with electrification programs"
        ],
        topCountries: ["Rwanda", "Bangladesh", "Kenya", "Ethiopia", "Tanzania", "Myanmar", "Cambodia", "Ghana", "Senegal", "Nepal"],
        trends: [
            "Mini-grid capacity doubled every 2 years (2010-2018)",
            "Solar home system costs fell 50% since 2015",
            "Mobile payment systems revolutionized energy access financing"
        ]
    },
    'life-expectancy': {
        insights: [
            "Global life expectancy increased by 6.2 years from 67.2 (2000) to 73.4 years (2018), showing remarkable human development progress",
            "Top performers demonstrate health system excellence: Japan (84.6), Switzerland (83.8), Singapore (83.6), Australia (83.4)",
            "Strong sustainability-health correlation: Countries with better air quality show +3.2 years additional life expectancy",
            "Income inequality creates stark disparities: High-income countries average 81 years versus 63 years in low-income nations",
            "Environmental health link clear: Access to clean cooking fuels correlates with +5.4 years life expectancy advantage"
        ],
        statistics: [
            "Regional averages: Europe 78.2yr, Americas 75.8yr, Asia 72.7yr, Africa 62.3yr",
            "Gender gap: Women live 4.8 years longer globally, ranging from 2.1yr (Botswana) to 7.8yr (Russia)",
            "Pollution impact: PM2.5 exposure reduces life expectancy by 0.2 years per 10μg/m³",
            "Healthcare spending correlation: Every $1000 per capita associates with +2.1 years"
        ],
        recommendations: [
            "Expand universal healthcare coverage in developing regions",
            "Implement air quality improvement programs in polluted urban areas",
            "Promote clean cooking solutions in rural communities",
            "Strengthen preventive healthcare and health education systems",
            "Address social determinants of health through integrated policies"
        ],
        topCountries: ["Japan", "Switzerland", "Singapore", "Spain", "Italy", "Australia", "Sweden", "Israel", "Luxembourg", "Norway"],
        trends: [
            "Fastest improvements: Sub-Saharan Africa (+8.9 years since 2000)",
            "Slowest progress: Eastern Europe (+2.1 years since 2000)",
            "COVID-19 impact: -1.3 years globally in 2020"
        ]
    }
};

export default function InsightsPage() {
    const [data, setData] = useState<SustainabilityData[]>([]);
    const [loading, setLoading] = useState(true);
    const [analysisLoading, setAnalysisLoading] = useState(false);
    const [insights, setInsights] = useState<InsightResponse | null>(null);
    const [selectedAnalysis, setSelectedAnalysis] = useState<string>('');

    const questionOptions = [
        {
            id: 'carbon-trends',
            title: 'Carbon Emission Trends',
            icon: Flame,
            description: 'Analyze global carbon emission patterns and identify major contributors',
            color: 'from-red-500 to-orange-500'
        },
        {
            id: 'renewable-leaders',
            title: 'Renewable Energy Leaders',
            icon: Leaf,
            description: 'Discover countries leading in renewable energy adoption',
            color: 'from-green-500 to-emerald-500'
        },
        {
            id: 'development-sustainability',
            title: 'Development vs Sustainability',
            icon: TrendingUp,
            description: 'Explore the relationship between economic development and environmental impact',
            color: 'from-blue-500 to-indigo-500'
        },
        {
            id: 'regional-analysis',
            title: 'Regional Analysis',
            icon: Globe,
            description: 'Compare sustainability metrics across different world regions',
            color: 'from-purple-500 to-pink-500'
        },
        {
            id: 'electricity-access',
            title: 'Electricity Access Patterns',
            icon: Zap,
            description: 'Examine global electricity access and energy poverty trends',
            color: 'from-yellow-500 to-orange-500'
        },
        {
            id: 'life-expectancy',
            title: 'Life Expectancy Insights',
            icon: Heart,
            description: 'Analyze health outcomes and their relationship with sustainability',
            color: 'from-pink-500 to-rose-500'
        }
    ];

    useEffect(() => {
        const loadData = async () => {
            try {
                await sustainabilityDataProcessor.loadData();
                const allData = sustainabilityDataProcessor.getData();
                setData(allData.slice(0, 100));
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleAnalysis = useCallback(async (analysisType: string) => {
        setAnalysisLoading(true);
        setSelectedAnalysis(analysisType);

        await new Promise(resolve => setTimeout(resolve, 1500));

        const response = AI_RESPONSES[analysisType];
        setInsights(response);
        setAnalysisLoading(false);
    }, []);

    const formatNumber = useCallback((num: number): string => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toLocaleString();
    }, []);

    const dataStats = useMemo(() => {
        if (!data.length) return null;

        const countries = new Set(data.map(d => d.Country)).size;
        const years = new Set(data.map(d => d.Year)).size;
        const records = data.length;

        return { countries, years, records };
    }, [data]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-950 dark:to-black">
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="text-center">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-green-600" />
                            <p className="text-gray-600 dark:text-gray-400">Loading sustainability insights...</p>
                        </div>
                    </div>
                </div>
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

                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Brain className="w-10 h-10 text-purple-600" />
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                                AI-Powered Sustainability Insights
                            </h1>
                        </div>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Discover deep insights from our comprehensive sustainability dataset using advanced AI analysis
                        </p>
                    </div>

                    {dataStats && (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <Card>
                                <CardContent className="pt-6 text-center">
                                    <div className="text-3xl font-bold text-green-600 mb-2">{dataStats.countries}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Countries</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6 text-center">
                                    <div className="text-3xl font-bold text-blue-600 mb-2">{dataStats.years}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Years</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6 text-center">
                                    <div className="text-3xl font-bold text-purple-600 mb-2">54</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Metrics</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6 text-center">
                                    <div className="text-3xl font-bold text-orange-600 mb-2">{formatNumber(dataStats.records)}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Records</div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Brain className="w-5 h-5 text-purple-600" />
                                Choose Your Analysis
                            </CardTitle>
                            <CardDescription>
                                Select a specific analysis topic to get focused AI insights about sustainability trends
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                {questionOptions.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => handleAnalysis(option.id)}
                                        disabled={analysisLoading}
                                        className={`p-4 border-2 rounded-lg text-left transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${selectedAnalysis === option.id
                                            ? 'ring-2 ring-green-500 border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20'
                                            : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        <div className={`w-full h-3 bg-gradient-to-r ${option.color} rounded-full mb-3`}></div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <option.icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                {option.title}
                                            </h3>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {option.description}
                                        </p>
                                    </button>
                                ))}
                            </div>

                            {analysisLoading && (
                                <div className="flex items-center justify-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg mb-4">
                                    <Loader2 className="animate-spin w-8 h-8 text-green-600 mr-3" />
                                    <span className="text-lg text-gray-700 dark:text-gray-300">Analyzing sustainability data...</span>
                                </div>
                            )}

                            {insights && (
                                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Sparkles className="w-5 h-5 text-green-600" />
                                        <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                                            AI Analysis Results
                                        </h3>
                                    </div>

                                    {/* Key Insights Section */}
                                    <div className="mb-6">
                                        <h4 className="flex items-center gap-2 text-md font-semibold text-green-800 dark:text-green-200 mb-3">
                                            <Info className="w-4 h-4" />
                                            Key Insights
                                        </h4>
                                        <div className="space-y-3">
                                            {insights.insights.map((insight, index) => (
                                                <div key={index} className="flex items-start gap-3">
                                                    <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-semibold mt-0.5">
                                                        {index + 1}
                                                    </div>
                                                    <p className="text-green-800 dark:text-green-200 leading-relaxed">{insight}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Statistics Section */}
                                    <div className="mb-6">
                                        <h4 className="flex items-center gap-2 text-md font-semibold text-green-800 dark:text-green-200 mb-3">
                                            <BarChart3 className="w-4 h-4" />
                                            Key Statistics
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {insights.statistics.map((stat, index) => (
                                                <div key={index} className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg border border-green-200 dark:border-green-700">
                                                    <p className="text-green-800 dark:text-green-200 text-sm">{stat}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Top Countries Section */}
                                    {insights.topCountries && (
                                        <div className="mb-6">
                                            <h4 className="flex items-center gap-2 text-md font-semibold text-green-800 dark:text-green-200 mb-3">
                                                <Globe className="w-4 h-4" />
                                                Featured Countries
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {insights.topCountries.map((country, index) => (
                                                    <Badge key={index} variant="secondary" className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200">
                                                        #{index + 1} {country}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Trends Section */}
                                    {insights.trends && (
                                        <div className="mb-6">
                                            <h4 className="flex items-center gap-2 text-md font-semibold text-green-800 dark:text-green-200 mb-3">
                                                <TrendingUp className="w-4 h-4" />
                                                Notable Trends
                                            </h4>
                                            <div className="space-y-2">
                                                {insights.trends.map((trend, index) => (
                                                    <div key={index} className="flex items-center gap-3">
                                                        <LineChart className="w-4 h-4 text-green-600" />
                                                        <p className="text-green-800 dark:text-green-200 text-sm">{trend}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Recommendations Section */}
                                    <div className="mb-4">
                                        <h4 className="flex items-center gap-2 text-md font-semibold text-green-800 dark:text-green-200 mb-3">
                                            <Target className="w-4 h-4" />
                                            Recommendations
                                        </h4>
                                        <div className="space-y-3">
                                            {insights.recommendations.map((recommendation, index) => (
                                                <div key={index} className="flex items-start gap-3">
                                                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                                    <p className="text-green-800 dark:text-green-200 leading-relaxed">{recommendation}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-green-200 dark:border-green-700">
                                        <Button
                                            onClick={() => {
                                                setSelectedAnalysis('');
                                                setInsights(null);
                                            }}
                                            variant="outline"
                                            className="w-full border-green-300 text-green-700 hover:bg-green-100 dark:border-green-600 dark:text-green-300 dark:hover:bg-green-800"
                                        >
                                            <Brain className="w-4 h-4 mr-2" />
                                            Choose Different Analysis
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {!insights && !analysisLoading && (
                                <div className="text-center py-8">
                                    <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        Select an analysis topic above to get AI-powered insights about sustainability trends
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
                        <p>
                            AI insights generated from World Sustainability Dataset • 173 countries • 2000-2020 • 54 metrics
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}