'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, BarChart3, Globe, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SustainabilityData } from '@/lib/data-processing';

interface CountryPopupProps {
    country: string;
    data?: SustainabilityData[];
    isOpen: boolean;
    onClose: () => void;
    position?: { x: number; y: number };
}

const CountryPopup: React.FC<CountryPopupProps> = ({
    country,
    data = [],
    isOpen,
    onClose,
    position = { x: 0, y: 0 }
}) => {
    const router = useRouter();

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const countryData = data?.find(d => d.Country === country);

    const getKeyMetrics = () => {
        if (!countryData) return null;

        return {
            gdp: countryData['GDP per capita (current US$)'],
            lifeExpectancy: countryData['Life expectancy at birth, total (years)'],
            carbonEmissions: countryData['Carbon emissions (metric tons per capita)'],
            renewableEnergy: countryData['Renewable energy consumption (% of total final energy consumption)']
        };
    };

    const metrics = getKeyMetrics();
    const hasData = data.length > 0;
    const dataYears = hasData ? [...new Set(data.map(d => d.Year))].sort() : [];
    const latestYear = dataYears.length > 0 ? Math.max(...dataYears) : null;

    const handleViewDetails = () => {
        onClose();
        router.push(`/explorer?country=${encodeURIComponent(country)}`);
    };

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="relative max-w-md w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Card className="bg-white dark:bg-gray-800 shadow-2xl border-green-200 dark:border-green-700">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-5 h-5 text-green-600" />
                                        <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
                                            {country}
                                        </CardTitle>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={onClose}
                                        className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                                {latestYear && (
                                    <Badge variant="outline" className="text-xs w-fit">
                                        Latest data: {latestYear}
                                    </Badge>
                                )}
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {hasData && metrics ? (
                                    <>
                                        <div className="grid grid-cols-2 gap-3">
                                            {metrics.gdp && (
                                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-3 rounded-lg">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <TrendingUp className="w-4 h-4 text-blue-600" />
                                                        <span className="text-xs font-medium text-blue-700 dark:text-blue-300">GDP per capita</span>
                                                    </div>
                                                    <div className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                                                        ${(metrics.gdp).toLocaleString()}
                                                    </div>
                                                </div>
                                            )}

                                            {metrics.lifeExpectancy && (
                                                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-3 rounded-lg">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <BarChart3 className="w-4 h-4 text-green-600" />
                                                        <span className="text-xs font-medium text-green-700 dark:text-green-300">Life Expectancy</span>
                                                    </div>
                                                    <div className="text-sm font-semibold text-green-900 dark:text-green-100">
                                                        {metrics.lifeExpectancy.toFixed(1)} years
                                                    </div>
                                                </div>
                                            )}

                                            {metrics.carbonEmissions && (
                                                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-3 rounded-lg">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Globe className="w-4 h-4 text-orange-600" />
                                                        <span className="text-xs font-medium text-orange-700 dark:text-orange-300">CO₂ Emissions</span>
                                                    </div>
                                                    <div className="text-sm font-semibold text-orange-900 dark:text-orange-100">
                                                        {metrics.carbonEmissions.toFixed(2)} tons/capita
                                                    </div>
                                                </div>
                                            )}

                                            {metrics.renewableEnergy && (
                                                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 p-3 rounded-lg">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Zap className="w-4 h-4 text-emerald-600" />
                                                        <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Renewable Energy</span>
                                                    </div>
                                                    <div className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                                                        {metrics.renewableEnergy.toFixed(1)}%
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="border-t pt-3 dark:border-gray-700">
                                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                                                Data coverage: {dataYears.length} years ({Math.min(...dataYears)}-{Math.max(...dataYears)})
                                            </div>
                                            <Button
                                                onClick={handleViewDetails}
                                                className="w-full bg-green-600 hover:bg-green-700 text-white"
                                                size="sm"
                                            >
                                                View Detailed Analysis
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-6">
                                        <Globe className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                            No sustainability data available for {country}
                                        </p>
                                        <Button
                                            onClick={onClose}
                                            variant="outline"
                                            size="sm"
                                        >
                                            Close
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    if (typeof document === 'undefined') return null;

    const modalRoot = document.getElementById('modal-root') || document.body;
    return createPortal(modalContent, modalRoot);
};

export default CountryPopup;