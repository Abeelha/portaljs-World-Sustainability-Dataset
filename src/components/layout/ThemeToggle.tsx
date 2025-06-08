'use client';

import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/theme-provider';
import { Button } from '@/components/ui/button';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <motion.div
            className="fixed top-4 right-4 z-50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Button
                    onClick={toggleTheme}
                    className={`
            relative h-12 w-12 rounded-full shadow-lg backdrop-blur-md border-2 transition-all duration-300
            ${theme === 'light'
                            ? 'bg-white/90 border-green-200 hover:bg-white hover:border-green-300 text-gray-700'
                            : 'bg-gray-900/90 border-green-500/30 hover:bg-gray-800 hover:border-green-400 text-white'
                        }
          `}
                    aria-label="Toggle theme"
                >
                    <motion.div
                        initial={false}
                        animate={{
                            scale: theme === 'light' ? 1 : 0,
                            opacity: theme === 'light' ? 1 : 0,
                            rotate: theme === 'light' ? 0 : 180,
                        }}
                        transition={{
                            duration: 0.4,
                            ease: 'easeInOut',
                        }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <Sun className="h-5 w-5 text-amber-500" />
                    </motion.div>

                    <motion.div
                        initial={false}
                        animate={{
                            scale: theme === 'dark' ? 1 : 0,
                            opacity: theme === 'dark' ? 1 : 0,
                            rotate: theme === 'dark' ? 0 : -180,
                        }}
                        transition={{
                            duration: 0.4,
                            ease: 'easeInOut',
                        }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <Moon className="h-5 w-5 text-indigo-400" />
                    </motion.div>

                    {/* Decorative ring animation */}
                    <motion.div
                        className={`absolute inset-0 rounded-full ${theme === 'light'
                            ? 'ring-2 ring-green-300/50'
                            : 'ring-2 ring-green-400/50'
                            }`}
                        animate={{
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                </Button>

                {/* Theme indicator tooltip */}
                <motion.div
                    className={`
            absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs font-medium whitespace-nowrap
            ${theme === 'light'
                            ? 'bg-gray-800 text-white'
                            : 'bg-white text-gray-800'
                        }
          `}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                >
                    {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                </motion.div>
            </motion.div>
        </motion.div>
    );
}