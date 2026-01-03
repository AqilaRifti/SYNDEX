'use client';

/**
 * SYNDEX Loading Spinner Component
 * Animated loading indicator with Bloomberg aesthetic
 */

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    message?: string;
}

const sizes = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
};

export function LoadingSpinner({ size = 'md', className, message }: LoadingSpinnerProps) {
    return (
        <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
            <div className={cn('relative', sizes[size])}>
                {/* Outer ring */}
                <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary/30"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />

                {/* Inner ring */}
                <motion.div
                    className="absolute inset-1 rounded-full border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                />

                {/* Center dot */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                >
                    <div className="h-2 w-2 rounded-full bg-primary" />
                </motion.div>
            </div>

            {message && (
                <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
            )}
        </div>
    );
}

export default LoadingSpinner;
