'use client';

/**
 * SYNDEX Deal Card Component
 * Displays deal summary with progress tracking
 */

import { motion } from 'motion/react';
import Link from 'next/link';
import { Building2, Users, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatAmount, formatPercentage } from '@/lib/utils/progress';
import { getScoreColorClass, getProgressBarClass } from '@/lib/utils/color-coding';
import type { DealWithStats } from '@/types/database';
import { cn } from '@/lib/utils';

interface DealCardProps {
    deal: DealWithStats;
    index?: number;
}

export function DealCard({ deal, index = 0 }: DealCardProps) {
    const progress = deal.committed_amount > 0
        ? (deal.committed_amount / deal.amount_usd) * 100
        : 0;

    const progressColor = getScoreColorClass(progress);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
        >
            <Link href={`/dashboard/syndex/deals/${deal.id}`}>
                <Card className="terminal-window card-hover cursor-pointer group">
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                    {deal.borrower_name}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs">
                                        {deal.sector}
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            'text-xs',
                                            deal.status === 'active' && 'border-accent text-accent',
                                            deal.status === 'draft' && 'border-muted-foreground text-muted-foreground',
                                            deal.status === 'closed' && 'border-primary text-primary'
                                        )}
                                    >
                                        {deal.status}
                                    </Badge>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-mono-data text-2xl font-bold text-primary">
                                    {formatAmount(deal.amount_usd)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {deal.deal_type}
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {/* Progress Bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Syndication Progress</span>
                                <span className="font-mono-data font-medium">
                                    {formatAmount(deal.committed_amount)} / {formatAmount(deal.amount_usd)}
                                </span>
                            </div>
                            <div className="progress-bar">
                                <motion.div
                                    className={cn('progress-bar-fill', `progress-bar-fill-${progressColor}`)}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(progress, 100)}%` }}
                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground text-right">
                                {formatPercentage(progress)} complete
                            </p>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border">
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="font-mono-data text-sm font-medium">
                                        {deal.committed_count}/{deal.invitation_count}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Banks</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="font-mono-data text-sm font-medium">
                                        {deal.pricing}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Pricing</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="font-mono-data text-sm font-medium">
                                        {deal.tenor_years}Y
                                    </p>
                                    <p className="text-xs text-muted-foreground">Tenor</p>
                                </div>
                            </div>
                        </div>

                        {/* Geography & Rating */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                            <span className="flex items-center gap-1">
                                <Building2 className="h-3 w-3" />
                                {deal.geography}
                            </span>
                            {deal.rating_sp && (
                                <span className="font-mono-data">
                                    Rating: {deal.rating_sp}
                                </span>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </motion.div>
    );
}

export default DealCard;
