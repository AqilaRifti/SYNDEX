/**
 * SYNDEX Color Coding Utilities
 * Match score and status color coding for Bloomberg-style UI
 */

import type { InvitationStatus } from '@/types/database';

// ============================================
// Match Score Color Coding
// ============================================

export type ScoreColorClass = 'accent' | 'primary' | 'destructive';

/**
 * Returns the appropriate color class based on match score
 * - Green (accent): score > 80 (high match)
 * - Orange (primary): score 60-80 (medium match)
 * - Red (destructive): score < 60 (low match)
 * 
 * @param score - Match score from 0-100
 * @returns Color class name
 */
export function getScoreColorClass(score: number): ScoreColorClass {
    if (score > 80) {
        return 'accent';
    }
    if (score >= 60) {
        return 'primary';
    }
    return 'destructive';
}

/**
 * Returns Tailwind CSS classes for score badge styling
 */
export function getScoreBadgeClasses(score: number): string {
    const colorClass = getScoreColorClass(score);

    switch (colorClass) {
        case 'accent':
            return 'bg-accent/20 text-accent border-accent/30';
        case 'primary':
            return 'bg-primary/20 text-primary border-primary/30';
        case 'destructive':
            return 'bg-destructive/20 text-destructive border-destructive/30';
    }
}

/**
 * Returns the progress bar fill class based on score
 */
export function getProgressBarClass(score: number): string {
    const colorClass = getScoreColorClass(score);

    switch (colorClass) {
        case 'accent':
            return 'bg-accent';
        case 'primary':
            return 'bg-primary';
        case 'destructive':
            return 'bg-destructive';
    }
}

/**
 * Returns hex color for charts based on score
 */
export function getScoreHexColor(score: number): string {
    if (score > 80) {
        return '#22C55E'; // Green
    }
    if (score >= 60) {
        return '#FF7A00'; // Orange
    }
    return '#EF4444'; // Red
}

// ============================================
// Invitation Status Color Coding
// ============================================

export type StatusColorClass = 'muted' | 'blue' | 'accent' | 'destructive';

/**
 * Returns color class for invitation status
 */
export function getStatusColorClass(status: InvitationStatus): StatusColorClass {
    switch (status) {
        case 'pending':
            return 'muted';
        case 'interested':
            return 'blue';
        case 'committed':
            return 'accent';
        case 'declined':
            return 'destructive';
    }
}

/**
 * Returns Tailwind CSS classes for status badge styling
 */
export function getStatusBadgeClasses(status: InvitationStatus): string {
    switch (status) {
        case 'pending':
            return 'bg-muted text-muted-foreground border-muted';
        case 'interested':
            return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        case 'committed':
            return 'bg-accent/20 text-accent border-accent/30';
        case 'declined':
            return 'bg-destructive/20 text-destructive border-destructive/30';
    }
}

/**
 * Returns hex color for status
 */
export function getStatusHexColor(status: InvitationStatus): string {
    switch (status) {
        case 'pending':
            return '#6B7280'; // Gray
        case 'interested':
            return '#3B82F6'; // Blue
        case 'committed':
            return '#22C55E'; // Green
        case 'declined':
            return '#EF4444'; // Red
    }
}

// ============================================
// Bank Tier Color Coding
// ============================================

export function getTierBadgeClasses(tier: 1 | 2 | 3): string {
    switch (tier) {
        case 1:
            return 'bg-primary/20 text-primary border-primary/30';
        case 2:
            return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        case 3:
            return 'bg-muted text-muted-foreground border-muted';
    }
}

export function getTierLabel(tier: 1 | 2 | 3): string {
    switch (tier) {
        case 1:
            return 'Tier 1 - Bulge Bracket';
        case 2:
            return 'Tier 2 - Mid-Tier';
        case 3:
            return 'Tier 3 - Regional';
    }
}

// ============================================
// Confidence Level Color Coding
// ============================================

export function getConfidenceBadgeClasses(confidence: 'high' | 'medium' | 'low'): string {
    switch (confidence) {
        case 'high':
            return 'text-accent';
        case 'medium':
            return 'text-primary';
        case 'low':
            return 'text-muted-foreground';
    }
}
