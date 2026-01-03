'use client';

/**
 * SYNDEX Dashboard Page
 * Main dashboard with deal grid and market intelligence
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Plus, TrendingUp, Building2, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DealCard, LoadingSpinner, ErrorDisplay } from '@/components/syndex';
import type { DealWithStats } from '@/types/database';

export default function SyndexDashboard() {
    const [deals, setDeals] = useState<DealWithStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDeals = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/deals');
            if (!res.ok) throw new Error('Failed to fetch deals');
            const data = await res.json();
            setDeals(data.data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load deals');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeals();
    }, []);

    // Calculate stats
    const totalVolume = deals.reduce((sum, d) => sum + d.amount_usd, 0);
    const activeDeals = deals.filter(d => d.status === 'active').length;
    const totalCommitted = deals.reduce((sum, d) => sum + (d.committed_amount || 0), 0);

    const stats = [
        {
            label: 'Active Deals',
            value: activeDeals,
            icon: TrendingUp,
            color: 'text-accent',
        },
        {
            label: 'Total Volume',
            value: `$${(totalVolume / 1e9).toFixed(1)}B`,
            icon: DollarSign,
            color: 'text-primary',
        },
        {
            label: 'Committed',
            value: `$${(totalCommitted / 1e9).toFixed(1)}B`,
            icon: Building2,
            color: 'text-blue-400',
        },
    ];

    return (
        <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="text-primary">SYN</span>DEX
                        </h1>
                        <p className="text-muted-foreground">
                            AI-Powered Loan Syndication Platform
                        </p>
                    </div>
                    <Link href="/dashboard/syndex/deals/new">
                        <Button className="glow-effect">
                            <Plus className="h-4 w-4 mr-2" />
                            New Deal
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="terminal-window">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                {stat.label}
                                            </p>
                                            <p className="text-2xl font-bold font-mono-data">
                                                {stat.value}
                                            </p>
                                        </div>
                                        <stat.icon className={`h-8 w-8 ${stat.color}`} />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Deals Grid */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Active Deals</h2>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <LoadingSpinner size="lg" message="Loading deals..." />
                        </div>
                    ) : error ? (
                        <ErrorDisplay message={error} onRetry={fetchDeals} />
                    ) : deals.length === 0 ? (
                        <Card className="terminal-window">
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No deals yet</h3>
                                <p className="text-muted-foreground mb-4">
                                    Create your first deal to get started
                                </p>
                                <Link href="/dashboard/syndex/deals/new">
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Deal
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {deals.map((deal, index) => (
                                <DealCard key={deal.id} deal={deal} index={index} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
