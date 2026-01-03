'use client';

/**
 * SYNDEX Bank Match Card Component
 * Displays AI-matched bank with score and reasoning
 */

import { motion } from 'motion/react';
import { Building2, TrendingUp, DollarSign, CheckCircle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatAmount } from '@/lib/utils/progress';
import {
    getScoreBadgeClasses,
    getProgressBarClass,
    getConfidenceBadgeClasses
} from '@/lib/utils/color-coding';
import type { BankMatch } from '@/types/database';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface BankMatchCardProps {
    match: BankMatch;
    index: number;
    onInvite?: (bankName: string) => Promise<void>;
    isInvited?: boolean;
}

export function BankMatchCard({
    match,
    index,
    onInvite,
    isInvited = false
}: BankMatchCardProps) {
    const [isInviting, setIsInviting] = useState(false);
    const [invited, setInvited] = useState(isInvited);

    const handleInvite = async () => {
        if (!onInvite || invited) return;

        setIsInviting(true);
        try {
            await onInvite(match.bank_name);
            setInvited(true);
        } catch (error) {
            console.error('Failed to invite bank:', error);
        } finally {
            setIsInviting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
        >
            <Card className="terminal-window card-hover">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                        {/* Left: Bank Info */}
                        <div className="flex-1 space-y-3">
                            {/* Header */}
                            <div className="flex items-center gap-3 flex-wrap">
                                <h3 className="text-xl font-bold">{match.bank_name}</h3>

                                {/* Match Score Badge */}
                                <Badge
                                    variant="outline"
                                    className={cn('font-mono-data font-bold', getScoreBadgeClasses(match.match_score))}
                                >
                                    {match.match_score}% Match
                                </Badge>

                                {/* Confidence Badge */}
                                <span className={cn(
                                    'text-xs uppercase tracking-wide',
                                    getConfidenceBadgeClasses(match.confidence)
                                )}>
                                    {match.confidence} confidence
                                </span>
                            </div>

                            {/* Reasoning */}
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {match.reasoning}
                            </p>

                            {/* Stats Row */}
                            <div className="flex flex-wrap gap-6 text-sm">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Historical Rate:</span>
                                    <span className="font-mono-data font-bold">
                                        {match.historical_participation_rate}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Est. Commitment:</span>
                                    <span className="font-mono-data font-bold">
                                        {formatAmount(match.estimated_commitment)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Action Button */}
                        <div className="flex-shrink-0">
                            {invited ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled
                                    className="border-accent text-accent"
                                >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Invited
                                </Button>
                            ) : (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleInvite}
                                    disabled={isInviting}
                                    className="hover:border-primary hover:text-primary transition-colors"
                                >
                                    {isInviting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Inviting...
                                        </>
                                    ) : (
                                        'Invite to Syndicate →'
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4 pt-4 border-t border-border">
                        <div className="progress-bar h-2">
                            <motion.div
                                className={cn('progress-bar-fill', getProgressBarClass(match.match_score))}
                                initial={{ width: 0 }}
                                animate={{ width: `${match.match_score}%` }}
                                transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

export default BankMatchCard;
