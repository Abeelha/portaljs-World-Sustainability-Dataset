'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, BarChart3, Search, TrendingUp, Brain, Globe, Rocket } from 'lucide-react';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigation = [
        { href: '/catalog', label: 'Catalog', icon: BarChart3 },
        { href: '/explorer', label: 'Explorer', icon: Search },
        { href: '/visualizations', label: 'Charts', icon: TrendingUp },
        { href: '/insights', label: 'Insights', icon: Brain },
        { href: '/countries', label: 'Countries', icon: Globe }
    ];

    // Close mobile menu on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setMobileMenuOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    return (
        <>
            {/* Mobile Menu Backdrop */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-hidden="true"
                />
            )}

            <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 dark:border-gray-800/80 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-950/60">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                                <Globe className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <span className="text-xl font-bold text-gray-900 dark:text-white">
                                    SustainabilityPortal
                                </span>
                                <div className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                                    173 Countries • 19 Years • AI-Powered
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navigation.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 relative group"
                            >
                                <div className="flex items-center gap-2">
                                    <link.icon className="w-4 h-4" />
                                    {link.label}
                                </div>
                                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center space-x-3">
                        {/* Mobile menu button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-md border border-gray-300 dark:border-gray-600"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle mobile menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                            ) : (
                                <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                            )}
                        </Button>

                        <div className="hidden md:flex items-center space-x-4">
                            <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
                                <Link href="/explorer">
                                    <div className="flex items-center gap-2 justify-center">
                                        <Rocket className="w-4 h-4" />
                                        Get Started
                                    </div>
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {mobileMenuOpen && (
                    <div className="absolute top-full left-0 right-0 z-50 md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-xl">
                        <div className="px-4 py-4 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
                            {navigation.map((link, index) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="flex items-center px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 border border-transparent hover:border-green-200 dark:hover:border-green-800"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <div className="flex items-center gap-3">
                                        <link.icon className="w-5 h-5" />
                                        {link.label}
                                    </div>
                                </Link>
                            ))}

                            {/* Bottom section with Get Started and Theme Toggle */}
                            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                                <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white">
                                    <Link href="/explorer">
                                        <div className="flex items-center gap-2 justify-center">
                                            <Rocket className="w-4 h-4" />
                                            Get Started
                                        </div>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </header>
        </>
    );
}