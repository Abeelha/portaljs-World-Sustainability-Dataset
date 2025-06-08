'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface GradientCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: LucideIcon;
    gradient: string;
    delay?: number;
    children?: React.ReactNode;
}

export default function GradientCard({
    title,
    value,
    description,
    icon: Icon,
    gradient,
    delay = 0,
    children
}: GradientCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay, ease: 'easeOut' }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="relative group"
        >
            <div className={`
        relative p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-white/20 dark:border-gray-700/30
        bg-gradient-to-br ${gradient}
        hover:shadow-xl transition-all duration-300 overflow-hidden
      `}>
                {/* Background decoration */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/5 rounded-full blur-lg" />

                {/* Content */}
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white/20 dark:bg-black/20 rounded-xl backdrop-blur-sm">
                            <Icon className="w-12 h-12 text-white" />
                        </div>
                        <motion.div
                            className="w-2 h-2 bg-white/60 rounded-full"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.6, 1, 0.6],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />
                    </div>

                    <div className="text-white">
                        <h3 className="text-sm font-medium opacity-90 mb-1">{title}</h3>
                        <p className="text-2xl font-bold mb-1">{value}</p>
                        {description && (
                            <p className="text-xs opacity-75">{description}</p>
                        )}
                    </div>

                    {children}
                </div>

                {/* Shine effect on hover */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    initial={{ x: '-100%', opacity: 0 }}
                    whileHover={{ x: '100%', opacity: 1 }}
                    transition={{ duration: 0.6 }}
                />
            </div>
        </motion.div>
    );
}