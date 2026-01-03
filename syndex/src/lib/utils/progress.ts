/**
 * SYNDEX Syndication Progress Calculator
 * Utilities for calculating and displaying syndication progress
 */

import type { DealInvitation, InvitationStatus } from '@/types/database';

// ============================================
// Types
// ============================================

export interface SyndicationProgress {
    totalAmount: number;
    committedAmount: number;
    percentage: number;
    invitedCount: number;
    interestedCount: number;
    committedCount: number;
    declinedCount: number;
    pendingCount: number;
}

export interface StatusCounts {
    pending: number;
    interested: number;
    committed: number;
    declined: number;
}

// ============================================
// Progress Calculation Functions
// ============================================

/**
 * Calculates syndication progress from deal amount and invitations
 * 
 * @param totalAmount - Total deal amount in USD
 * @param invitations - Array of deal invitations
 * @returns SyndicationProgress object with all metrics
 */
export function calculateSyndicationProgress(
    totalAmount: number,
    invitations: DealInvitation[]
): SyndicationProgress {
    // Count invitations by status
    const statusCounts = countInvitationsByStatus(invitations);

    // Calculate committed amount (only from committed invitations)
    const committedAmount = invitations
        .filter((inv) => inv.status === 'committed')
        .reduce((sum, inv) => sum + (inv.commitment_amount || 0), 0);

    // Calculate percentage (avoid division by zero)
    const percentage = totalAmount > 0
        ? (committedAmount / totalAmount) * 100
        : 0;

    return {
        totalAmount,
        committedAmount,
        percentage: Math.min(percentage, 100), // Cap at 100%
        invitedCount: invitations.length,
        interestedCount: statusCounts.interested,
        committedCount: statusCounts.committed,
        declinedCount: statusCounts.declined,
        pendingCount: statusCounts.pending,
    };
}

/**
 * Counts invitations by status
 */
export function countInvitationsByStatus(
    invitations: DealInvitation[]
): StatusCounts {
    return invitations.reduce(
        (counts, inv) => {
            counts[inv.status]++;
            return counts;
        },
        { pending: 0, interested: 0, committed: 0, declined: 0 } as StatusCounts
    );
}

/**
 * Calculates the remaining amount needed to fully syndicate
 */
export function calculateRemainingAmount(
    totalAmount: number,
    committedAmount: number
): number {
    return Math.max(0, totalAmount - committedAmount);
}

/**
 * Calculates average commitment size from committed invitations
 */
export function calculateAverageCommitment(
    invitations: DealInvitation[]
): number {
    const committedInvitations = invitations.filter(
        (inv) => inv.status === 'committed' && inv.commitment_amount
    );

    if (committedInvitations.length === 0) return 0;

    const totalCommitted = committedInvitations.reduce(
        (sum, inv) => sum + (inv.commitment_amount || 0),
        0
    );

    return totalCommitted / committedInvitations.length;
}

// ============================================
// Formatting Functions
// ============================================

/**
 * Formats amount for display (e.g., $750M, $1.2B)
 */
export function formatAmount(amount: number): string {
    if (amount >= 1_000_000_000) {
        return `$${(amount / 1_000_000_000).toFixed(1)}B`;
    }
    if (amount >= 1_000_000) {
        return `$${(amount / 1_000_000).toFixed(0)}M`;
    }
    if (amount >= 1_000) {
        return `$${(amount / 1_000).toFixed(0)}K`;
    }
    return `$${amount.toFixed(0)}`;
}

/**
 * Formats percentage for display
 */
export function formatPercentage(percentage: number): string {
    return `${percentage.toFixed(1)}%`;
}

/**
 * Formats progress as "X / Y" string
 */
export function formatProgressFraction(
    committed: number,
    total: number
): string {
    return `${formatAmount(committed)} / ${formatAmount(total)}`;
}

// ============================================
// Progress Status Helpers
// ============================================

export type ProgressStatus = 'not_started' | 'in_progress' | 'near_complete' | 'complete' | 'oversubscribed';

/**
 * Determines the overall progress status
 */
export function getProgressStatus(percentage: number): ProgressStatus {
    if (percentage === 0) return 'not_started';
    if (percentage < 50) return 'in_progress';
    if (percentage < 100) return 'near_complete';
    if (percentage === 100) return 'complete';
    return 'oversubscribed';
}

/**
 * Returns a human-readable status message
 */
export function getProgressStatusMessage(progress: SyndicationProgress): string {
    const status = getProgressStatus(progress.percentage);

    switch (status) {
        case 'not_started':
            return 'No commitments yet';
        case 'in_progress':
            return `${formatPercentage(progress.percentage)} syndicated`;
        case 'near_complete':
            return `${formatPercentage(progress.percentage)} syndicated - Almost there!`;
        case 'complete':
            return 'Fully syndicated';
        case 'oversubscribed':
            return `Oversubscribed by ${formatPercentage(progress.percentage - 100)}`;
    }
}

/**
 * Calculates estimated time to close based on current velocity
 * (simplified estimation)
 */
export function estimateTimeToClose(
    progress: SyndicationProgress,
    daysSinceStart: number
): number | null {
    if (progress.percentage === 0 || daysSinceStart === 0) return null;
    if (progress.percentage >= 100) return 0;

    const dailyRate = progress.percentage / daysSinceStart;
    const remainingPercentage = 100 - progress.percentage;

    return Math.ceil(remainingPercentage / dailyRate);
}
