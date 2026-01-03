'use client';

/**
 * SYNDEX Status Badge Component
 * Color-coded badges for invitation statuses
 */

import { Badge } from '@/components/ui/badge';
import { getStatusBadgeClasses } from '@/lib/utils/color-coding';
import type { InvitationStatus, DealStatus } from '@/types/database';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
    status: InvitationStatus | DealStatus;
    className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const isInvitationStatus = ['pending', 'interested', 'committed', 'declined'].includes(status);

    if (isInvitationStatus) {
        return (
            <Badge
                variant="outline"
                className={cn(
                    'capitalize font-medium',
                    getStatusBadgeClasses(status as InvitationStatus),
                    className
                )}
            >
                {status}
            </Badge>
        );
    }

    // Deal status
    return (
        <Badge
            variant="outline"
            className={cn(
                'capitalize font-medium',
                status === 'active' && 'bg-accent/20 text-accent border-accent/30',
                status === 'draft' && 'bg-muted text-muted-foreground border-muted',
                status === 'closed' && 'bg-primary/20 text-primary border-primary/30',
                className
            )}
        >
            {status}
        </Badge>
    );
}

export default StatusBadge;
