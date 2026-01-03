'use client';

/**
 * SYNDEX Syndication Progress Component
 * Displays deal syndication progress with stats
 */

import { motion } from 'motion/react';
import { Mail, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatAmount, formatPercentage } from '@/lib/utils/progress';
import { cn } from '@/lib/utils';

interface SyndicationProgressProps {
    totalAmount: number;
    committedAmount: number;
    invitedCount: number;
    interestedCount: number;
    committedCount: number;
    declinedCount?: number;
}

export function SyndicationProgress({
    totalAmount,
    committedAmount,
    invitedCount,
    interestedCount,
    committedCount,
    declinedCount = 0,
}: SyndicationProgressProps) {
    const percentage = totalAmount > 0
        ? Math.min((committedAmount / totalAmount) * 100, 100)
        : 0;

    const stats = [
        {
            label: 'Invited',
            value: invitedCount,
            icon: Mail,
            color: 'text-muted-foreground',
        },
        {
            label: 'Interested',
            value: interestedCount,
            icon: Eye,
            color: 'text-blue-400',
        },
        {
            label: 'Committed',
            value: committedCount,
            icon: CheckCircle,
            color: 'text-accent',
        },
        {
            label: 'Declined',
            value: declinedCount,
            icon: XCircle,
            color: 'text-destructive',
        },
    ];

    return (
        <Card className="terminal-window">
            <CardHeader>
                <CardTitle>Syndication Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Main Progress */}
                <div className="space-y-3">
                    <div className="flex justify-between items-baseline">
                        <span className="text-muted-foreground">Commitments Received</span>
                        <span className="font-mono-data text-lg font-bold">
                            {formatAmount(committedAmount)} / {formatAmount(totalAmount)}
                            <span className="text-muted-foreground ml-2">
                                ({formatPercentage(percentage)})
                            </span>
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-4 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                            className={cn(
                                'absolute inset-y-0 left-0 rounded-full',
                                percentage >= 100 ? 'bg-accent' :
                                    percentage >= 50 ? 'bg-primary' :
                                        'bg-primary/70'
                            )}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                        />

                        {/* Milestone markers */}
                        <div className="absolute inset-0 flex">
                            <div className="w-1/4 border-r border-background/20" />
                            <div className="w-1/4 border-r border-background/20" />
                            <div className="w-1/4 border-r border-background/20" />
                            <div className="w-1/4" />
                        </div>
                    </div>

                    {/* Milestone labels */}
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0%</span>
                        <span>25%</span>
                        <span>50%</span>
                        <span>75%</span>
                        <span>100%</span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-4 pt-4 border-t border-border">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center"
                        >
                            <div className={cn('flex justify-center mb-2', stat.color)}>
                                <stat.icon className="h-5 w-5" />
                            </div>
                            <p className="font-mono-data text-2xl font-bold">{stat.value}</p>
                            <p className="text-xs text-muted-foreground">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Remaining Amount */}
                {committedAmount < totalAmount && (
                    <div className="pt-4 border-t border-border">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Remaining to Syndicate</span>
                            <span className="font-mono-data font-medium text-primary">
                                {formatAmount(totalAmount - committedAmount)}
                            </span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default SyndicationProgress;
