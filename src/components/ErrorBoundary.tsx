'use client';

import React, { Component, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: (error: Error, reset: () => void) => ReactNode;
    onError?: (error: Error) => void;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error boundary caught an error:', error, errorInfo);
        this.props.onError?.(error);
    }

    reset = () => {
        this.setState({ hasError: false, error: undefined });
    };

    render() {
        if (this.state.hasError && this.state.error) {
            if (this.props.fallback) {
                return this.props.fallback(this.state.error, this.reset);
            }

            return (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900"
                >
                    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
                        <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
                            Something went wrong
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {this.state.error.message || 'An unexpected error occurred'}
                        </p>
                        <button
                            onClick={this.reset}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                            Try again
                        </button>
                    </div>
                </motion.div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;