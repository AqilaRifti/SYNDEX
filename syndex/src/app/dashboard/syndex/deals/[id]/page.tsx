'use client';

/**
 * SYNDEX Deal Detail Page
 * Shows deal parameters, syndication progress, and invited banks
 */

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
    ArrowLeft,
    Sparkles,
    Mail,
    FileText,
    Settings,
    Building2,
    Calendar,
    Globe,
    CheckCircle,
    XCircle,
    ThumbsUp,
    MoreHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
    SyndicationProgress,
    StatusBadge,
    Timeline,
    LoadingSpinner,
    ErrorDisplay,
} from '@/components/syndex';
import { formatAmount } from '@/lib/utils/progress';
import type { Deal, InvitationWithBank, TimelineEvent } from '@/types/database';
import { formatDistanceToNow } from 'date-fns';

export default function DealDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: dealId } = use(params);
    const [deal, setDeal] = useState<Deal | null>(null);
    const [invitations, setInvitations] = useState<InvitationWithBank[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch deal
            const dealRes = await fetch(`/api/deals/${dealId}`);
            if (!dealRes.ok) throw new Error('Deal not found');
            const dealData = await dealRes.json();
            setDeal(dealData.data);

            // Fetch invitations
            const invRes = await fetch(`/api/invitations?deal_id=${dealId}`);
            if (invRes.ok) {
                const invData = await invRes.json();
                setInvitations(invData.data || []);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load deal');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [dealId]);

    // Update invitation status
    const updateInvitationStatus = async (
        invitationId: string,
        status: string,
        commitmentAmount?: number
    ) => {
        try {
            const body: Record<string, unknown> = { status };
            if (commitmentAmount) body.commitment_amount = commitmentAmount;

            const res = await fetch(`/api/invitations/${invitationId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                fetchData(); // Refresh data
            }
        } catch (err) {
            console.error('Failed to update invitation:', err);
        }
    };

    // Simulate random commitment amount (5-15% of deal)
    const getRandomCommitment = () => {
        if (!deal) return 0;
        const pct = Math.random() * 0.1 + 0.05; // 5-15%
        return Math.floor(deal.amount_usd * pct);
    };

    if (loading) {
        return (
            <main className="flex-1 overflow-auto p-6">
                <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" message="Loading deal..." />
                </div>
            </main>
        );
    }

    if (error || !deal) {
        return (
            <main className="flex-1 overflow-auto p-6">
                <ErrorDisplay message={error || 'Deal not found'} onRetry={fetchData} />
            </main>
        );
    }

    // Calculate stats
    const committedAmount = invitations
        .filter(i => i.status === 'committed')
        .reduce((sum, i) => sum + (i.commitment_amount || 0), 0);
    const invitedCount = invitations.length;
    const interestedCount = invitations.filter(i => i.status === 'interested').length;
    const committedCount = invitations.filter(i => i.status === 'committed').length;
    const declinedCount = invitations.filter(i => i.status === 'declined').length;

    // Generate timeline events from invitations
    const timelineEvents: TimelineEvent[] = [
        {
            id: 'deal-created',
            timestamp: deal.created_at,
            event_type: 'deal_created' as const,
            description: `Deal created for ${deal.borrower_name}`,
        },
        ...invitations.map(inv => ({
            id: inv.id,
            timestamp: inv.invited_at,
            event_type: 'invitation_sent' as const,
            description: `Invitation sent to ${inv.bank?.name || 'Unknown Bank'}`,
        })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return (
        <main className="flex-1 overflow-auto p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/syndex">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold">{deal.borrower_name}</h1>
                                <StatusBadge status={deal.status} />
                            </div>
                            <p className="text-muted-foreground">
                                {deal.deal_type} • {deal.sector}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link href={`/dashboard/syndex/deals/${dealId}/match`}>
                            <Button variant="outline">
                                <Sparkles className="h-4 w-4 mr-2" />
                                Run AI Matching
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Deal Info & Progress */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Deal Parameters */}
                        <Card className="terminal-window">
                            <CardHeader>
                                <CardTitle>Deal Parameters</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground uppercase">Amount</p>
                                        <p className="font-mono-data text-xl font-bold text-primary">
                                            {formatAmount(deal.amount_usd)}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground uppercase">Tenor</p>
                                        <p className="font-mono-data text-xl font-bold">
                                            {deal.tenor_years} Years
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground uppercase">Pricing</p>
                                        <p className="font-mono-data text-xl font-bold">
                                            {deal.pricing}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground uppercase">Geography</p>
                                        <div className="flex items-center gap-2">
                                            <Globe className="h-4 w-4 text-muted-foreground" />
                                            <span>{deal.geography}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground uppercase">Rating</p>
                                        <div className="flex gap-2">
                                            {deal.rating_sp && (
                                                <Badge variant="outline">S&P: {deal.rating_sp}</Badge>
                                            )}
                                            {deal.rating_moodys && (
                                                <Badge variant="outline">Moody's: {deal.rating_moodys}</Badge>
                                            )}
                                            {!deal.rating_sp && !deal.rating_moodys && (
                                                <span className="text-muted-foreground">NR</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground uppercase">Target Close</p>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span>
                                                {deal.target_close_date
                                                    ? new Date(deal.target_close_date).toLocaleDateString()
                                                    : 'TBD'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {deal.use_of_proceeds && (
                                    <div className="mt-6 pt-4 border-t border-border">
                                        <p className="text-xs text-muted-foreground uppercase mb-2">Use of Proceeds</p>
                                        <p className="text-sm">{deal.use_of_proceeds}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Syndication Progress */}
                        <SyndicationProgress
                            totalAmount={deal.amount_usd}
                            committedAmount={committedAmount}
                            invitedCount={invitedCount}
                            interestedCount={interestedCount}
                            committedCount={committedCount}
                            declinedCount={declinedCount}
                        />

                        {/* Invited Banks Table */}
                        <Card className="terminal-window">
                            <CardHeader>
                                <CardTitle>Invited Banks</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {invitations.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Building2 className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                                        <p className="text-muted-foreground mb-4">No banks invited yet</p>
                                        <Link href={`/dashboard/syndex/deals/${dealId}/match`}>
                                            <Button>
                                                <Sparkles className="h-4 w-4 mr-2" />
                                                Find Lenders with AI
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Bank</TableHead>
                                                <TableHead>Match Score</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Commitment</TableHead>
                                                <TableHead>Updated</TableHead>
                                                <TableHead className="w-[50px]">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {invitations.map((inv, index) => (
                                                <motion.tr
                                                    key={inv.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="border-b border-border"
                                                >
                                                    <TableCell className="font-medium">
                                                        {inv.bank?.name || 'Unknown Bank'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="font-mono-data">
                                                            {inv.ai_match_score}%
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <StatusBadge status={inv.status} />
                                                    </TableCell>
                                                    <TableCell className="font-mono-data">
                                                        {inv.commitment_amount
                                                            ? formatAmount(inv.commitment_amount)
                                                            : '-'}
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground text-sm">
                                                        {formatDistanceToNow(new Date(inv.updated_at), { addSuffix: true })}
                                                    </TableCell>
                                                    <TableCell>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem
                                                                    onClick={() => updateInvitationStatus(inv.id, 'interested')}
                                                                >
                                                                    <ThumbsUp className="h-4 w-4 mr-2 text-blue-500" />
                                                                    Mark Interested
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => updateInvitationStatus(
                                                                        inv.id,
                                                                        'committed',
                                                                        getRandomCommitment()
                                                                    )}
                                                                >
                                                                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                                                    Mark Committed
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    onClick={() => updateInvitationStatus(inv.id, 'declined')}
                                                                >
                                                                    <XCircle className="h-4 w-4 mr-2 text-red-500" />
                                                                    Mark Declined
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </motion.tr>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Actions & Timeline */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <Card className="terminal-window">
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button variant="outline" className="w-full justify-start">
                                    <Mail className="h-4 w-4 mr-2" />
                                    Send Reminders
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Generate Report
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <Settings className="h-4 w-4 mr-2" />
                                    Update Terms
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Timeline */}
                        <Timeline events={timelineEvents.slice(0, 10)} />
                    </div>
                </div>
            </div>
        </main>
    );
}
