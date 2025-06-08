'use client';

import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingThemeToggle() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [mounted, setMounted] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        const getCurrentTheme = (): 'light' | 'dark' => {
            if (typeof window === 'undefined') return 'light';

            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'light' || savedTheme === 'dark') {
                return savedTheme;
            }

            const domHasDark = document.documentElement.classList.contains('dark');
            if (domHasDark) return 'dark';

            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            return systemTheme;
        };

        const initialTheme = getCurrentTheme();
        setTheme(initialTheme);

        document.documentElement.classList.toggle('dark', initialTheme === 'dark');

        if (!localStorage.getItem('theme')) {
            localStorage.setItem('theme', initialTheme);
        }

        setMounted(true);
    }, []);

    const handleToggle = () => {
        if (!mounted) return;

        const newTheme = theme === 'light' ? 'dark' : 'light';

        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);

        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleToggle();
        }
    };

    if (!mounted) return null;

    return (
        <>
            {/* Floating Theme Toggle Button */}
            <motion.button
                onClick={handleToggle}
                onKeyDown={handleKeyDown}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="fixed bottom-5 right-5 md:bottom-6 md:right-6 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-500/50 focus:ring-offset-2 shadow-lg hover:shadow-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50"
                style={{ zIndex: 9999 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
                role="button"
                tabIndex={0}
            >
                <AnimatePresence mode="wait">
                    {theme === 'light' ? (
                        <motion.div
                            key="moon"
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 90 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Moon className="w-6 h-6 md:w-7 md:h-7 text-gray-700 dark:text-gray-300" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="sun"
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 90 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Sun className="w-6 h-6 md:w-7 md:h-7 text-yellow-500" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Subtle pulse animation for attention */}
                <motion.div
                    className="absolute inset-0 rounded-full bg-green-500/20"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0, 0.3],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </motion.button>

            {/* Desktop Tooltip */}
            <AnimatePresence>
                {showTooltip && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: 10 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: 10 }}
                        className="hidden md:block fixed bottom-8 right-20 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm rounded-lg shadow-lg pointer-events-none whitespace-nowrap"
                        style={{ zIndex: 10000 }}
                    >
                        Switch to {theme === 'light' ? 'dark' : 'light'} mode
                        <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-900 dark:border-l-gray-100 border-t-4 border-t-transparent border-b-4 border-b-transparent" />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}