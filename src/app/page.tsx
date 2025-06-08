'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Rocket, BarChart3, Globe, TrendingUp, Brain, Search, Database, Lightbulb, MapPin, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import GradientCard from '@/components/ui/gradient-card';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingThemeToggle from '@/components/layout/FloatingThemeToggle';
import { sustainabilityDataProcessor, DatasetInfo } from '@/lib/data-processing';

export default function HomePage() {
  const [datasetInfo, setDatasetInfo] = useState<DatasetInfo | null>(null);

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

  const features = [
    {
      icon: Database,
      title: 'Comprehensive Dataset Catalog',
      description: 'Browse and explore detailed sustainability datasets with rich metadata and documentation.',
      href: '/catalog',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: BarChart3,
      title: 'Interactive Data Explorer',
      description: 'Filter, visualize, and analyze sustainability metrics with powerful interactive tools.',
      href: '/explorer',
      color: 'bg-green-50 text-green-600'
    },
    {
      icon: Lightbulb,
      title: 'AI-Powered Insights',
      description: 'Get intelligent analysis and discover patterns with advanced AI-driven insights.',
      href: '/insights',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'Access data from 173 countries across all continents and regions.',
      href: '/countries',
      color: 'bg-orange-50 text-orange-600'
    }
  ];

  const stats = [
    {
      label: 'Countries',
      value: '173',
      icon: MapPin,
      gradient: 'from-emerald-500 to-teal-600',
      description: 'Global Coverage'
    },
    {
      label: 'Years of Data',
      value: '19',
      icon: Calendar,
      gradient: 'from-blue-500 to-indigo-600',
      description: '2000-2018 Period'
    },
    {
      label: 'Sustainability Metrics',
      value: '54',
      icon: BarChart3,
      gradient: 'from-purple-500 to-pink-600',
      description: 'Comprehensive Indicators'
    },
    {
      label: 'Total Records',
      value: datasetInfo?.totalRecords.toLocaleString() || '0',
      icon: Database,
      gradient: 'from-orange-500 to-red-600',
      description: 'Data Points Available'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-950 dark:to-black">
      <Header />

      <main>
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-gradient-to-br from-green-100/50 via-blue-50/30 to-purple-100/20 dark:from-green-900/10 dark:via-blue-900/10 dark:to-purple-900/10"></div>
          <div className="relative container mx-auto max-w-6xl">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                World Sustainability
                <span className="block text-green-600 dark:text-green-400">Data Portal</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Comprehensive sustainability data for <span className="font-semibold text-green-600 dark:text-green-400">173 countries</span> over <span className="font-semibold text-blue-600 dark:text-blue-400">19 years</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 text-lg">
                  <Link href="/explorer">
                    <div className="flex items-center gap-2">
                      <Rocket className="w-5 h-5" />
                      Start Exploring
                    </div>
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all duration-300 px-8 py-4 text-lg">
                  <Link href="/catalog">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Browse Datasets
                    </div>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Powerful Features
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Advanced tools for exploring and analyzing sustainability data
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group feature-card p-6 text-center bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm mb-4 w-fit mx-auto">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Rich Datasets</h3>
                <p className="text-white/90 text-sm">
                  173 countries, 19 years of comprehensive sustainability metrics covering environmental, social, and economic indicators.
                </p>
              </div>

              <div className="group feature-card p-6 text-center bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm mb-4 w-fit mx-auto">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Interactive Visualizations</h3>
                <p className="text-white/90 text-sm">
                  Dynamic charts, maps, and dashboards to explore sustainability trends and patterns with intuitive filters.
                </p>
              </div>

              <div className="group feature-card p-6 text-center bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm mb-4 w-fit mx-auto">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Global Coverage</h3>
                <p className="text-white/90 text-sm">
                  Complete coverage of all countries with detailed regional analysis and comparison tools for comprehensive insights.
                </p>
              </div>

              <div className="group feature-card p-6 text-center bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm mb-4 w-fit mx-auto">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">AI-Powered Insights</h3>
                <p className="text-white/90 text-sm">
                  Smart analysis and automated insights powered by advanced AI to help you discover hidden patterns and trends.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Explore Sustainability Data?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Start discovering insights from comprehensive global sustainability metrics.
              Analyze trends, compare countries, and generate reports with our powerful tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-gray-100 hover:text-green-700 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 text-lg">
                <Link href="/catalog">
                  Browse Datasets
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-white border-white text-green-600 hover:bg-gray-100 hover:text-green-700 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 text-lg font-semibold">
                <Link href="/explorer">
                  Start Exploring
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
