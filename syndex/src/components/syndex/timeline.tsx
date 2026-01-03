'use client';

/**
 * SYNDEX Timeline Component
 * Displays chronological events with animations
 */

import { motion } from 'motion/react';
import { formatDistanceToNow } from 'date-fns';
import { FileText, Mail, RefreshCw, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { TimelineEvent } from '@/types/database';
import { cn } from '@/lib/utils';

interface TimelineProps {
    events: TimelineEvent[];
    className?: string;
}

const eventIcons = {
    deal_created: FileText,
    invitation_sent: Mail,
    status_changed: RefreshCw,
    commitment_received: DollarSign,
};

const eventColors = {
    deal_created: 'text-primary',
    invitation_sent: 'text-blue-400',
    status_changed: 'text-muted-foreground',
    commitment_received: 'text-accent',
};

export function Timeline({ events, className }: TimelineProps) {
    if (events.length === 0) {
        return (
            <Card className={cn('terminal-window', className)}>
                <CardHeader>
                    <CardTitle>Activity Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">No activity yet</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={cn('terminal-window', className)}>
            <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

                    <div className="space-y-4">
                        {events.map((event, index) => {
                            const Icon = eventIcons[event.event_type];
                            const colorClass = eventColors[event.event_type];

                            return (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative pl-10"
                                >
                                    {/* Icon */}
                                    <div className={cn(
                                        'absolute left-0 p-2 rounded-full bg-background border border-border',
                                        colorClass
                                    )}>
                                        <Icon className="h-4 w-4" />
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-1">
                                        <p className="text-sm">{event.description}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default Timeline;
