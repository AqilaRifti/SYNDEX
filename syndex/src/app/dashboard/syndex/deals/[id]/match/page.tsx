'use client';

/**
 * SYNDEX AI Matching Page - HERO FEATURE
 * Animated AI lender matching experience
 */

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Database, Search, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BankMatchCard, ErrorDisplay } from '@/components/syndex';
import type { Deal, BankMatch } from '@/types/database';

type Stage = 'analyzing' | 'matching' | 'results';

interface ChecklistItem {
    id: string;
    label: string;
    icon: React.ElementType;
    completed: boolean;
}

export default function AIMatchingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: dealId } = use(params);
    const router = useRouter();
    const [stage, setStage] = useState<Stage>('analyzing');
    const [progress, setProgress] = useState(0);
    const [deal, setDeal] = useState<Deal | null>(null);
    const [matches, setMatches] = useState<BankMatch[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [invitedBanks, setInvitedBanks] = useState<Set<string>>(new Set());

    const [checklist, setChecklist] = useState<ChecklistItem[]>([
        { id: 'database', label: 'Loading historical database...', icon: Database, completed: false },
        { id: 'patterns', label: 'Analyzing participation patterns...', icon: Search, completed: false },
        { id: 'mandates', label: 'Evaluating bank mandates...', icon: Brain, completed: false },
    ]);

    // Fetch deal and run AI matching
    useEffect(() => {
        const runMatching = async () => {
            try {
                // Fetch deal details
                const dealRes = await fetch(`/api/deals/${dealId}`);
                if (!dealRes.ok) throw new Error('Deal not found');
                const dealData = await dealRes.json();
                setDeal(dealData.data);

                // Simulate analyzing stage
                await simulateAnalyzing();

                // Switch to matching stage
                setStage('matching');
                setProgress(30);

                // Call AI matching API
                const matchRes = await fetch('/api/match-lenders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ deal_id: dealId }),
                });

                if (!matchRes.ok) {
                    const err = await matchRes.json();
                    throw new Error(err.error || 'AI matching failed');
                }

                const matchData = await matchRes.json();

                // Animate progress to 100%
                await animateProgress(30, 100, 2000);

                // Show results
                setMatches(matchData.data || []);
                setStage('results');
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Something went wrong');
            }
        };

        runMatching();
    }, [dealId]);

    const simulateAnalyzing = async () => {
        for (let i = 0; i < checklist.length; i++) {
            await new Promise(r => setTimeout(r, 800));
            setChecklist(prev => prev.map((item, idx) =>
                idx === i ? { ...item, completed: true } : item
            ));
            setProgress((i + 1) * 10);
        }
    };

    const animateProgress = (from: number, to: number, duration: number) => {
        return new Promise<void>(resolve => {
            const start = Date.now();
            const tick = () => {
                const elapsed = Date.now() - start;
                const p = Math.min(elapsed / duration, 1);
                setProgress(from + (to - from) * p);
                if (p < 1) requestAnimationFrame(tick);
                else resolve();
            };
            tick();
        });
    };

    const handleInvite = async (bankName: string) => {
        const match = matches.find(m => m.bank_name === bankName);
        if (!match || !deal) return;

        await fetch('/api/invitations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                deal_id: deal.id,
                bank_id: match.bank_id,
                ai_match_score: match.match_score,
                ai_reasoning: match.reasoning,
            }),
        });

        setInvitedBanks(prev => new Set(prev).add(bankName));
    };

    const handleInviteAll = async () => {
        for (const match of matches) {
            if (!invitedBanks.has(match.bank_name)) {
                await handleInvite(match.bank_name);
            }
        }
    };

    if (error) {
        return (
            <main className="flex-1 overflow-auto p-6">
                <div className="max-w-3xl mx-auto">
                    <ErrorDisplay
                        title="AI Matching Failed"
                        message={error}
                        onRetry={() => window.location.reload()}
                    />
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1 overflow-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold">
                        <span className="text-primary">AI</span> Lender Matching
                    </h1>
                    {deal && (
                        <p className="text-muted-foreground">
                            Finding optimal lenders for {deal.borrower_name} - ${(deal.amount_usd / 1e6).toFixed(0)}M {deal.deal_type}
                        </p>
                    )}
                </div>

                {/* Progress Bar */}
                <Card className="terminal-window">
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                    {stage === 'analyzing' && 'Analyzing deal parameters...'}
                                    {stage === 'matching' && 'Qwen-3-235B processing...'}
                                    {stage === 'results' && 'Matching complete!'}
                                </span>
                                <span className="font-mono-data">{Math.round(progress)}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                        </div>
                    </CardContent>
                </Card>

                <AnimatePresence mode="wait">
                    {/* Analyzing Stage */}
                    {stage === 'analyzing' && (
                        <motion.div
                            key="analyzing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <Card className="terminal-window">
                                <CardContent className="p-8">
                                    <div className="flex flex-col items-center space-y-8">
                                        {/* Spinning Animation */}
                                        <div className="relative h-32 w-32">
                                            <motion.div
                                                className="absolute inset-0 rounded-full border-4 border-primary/20"
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                            />
                                            <motion.div
                                                className="absolute inset-4 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent"
                                                animate={{ rotate: -360 }}
                                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Database className="h-10 w-10 text-primary" />
                                            </div>
                                        </div>

                                        {/* Checklist */}
                                        <div className="space-y-3 w-full max-w-sm">
                                            {checklist.map((item, index) => (
                                                <motion.div
                                                    key={item.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.2 }}
                                                    className="flex items-center gap-3"
                                                >
                                                    {item.completed ? (
                                                        <CheckCircle className="h-5 w-5 text-accent" />
                                                    ) : (
                                                        <item.icon className="h-5 w-5 text-muted-foreground animate-pulse" />
                                                    )}
                                                    <span className={item.completed ? 'text-foreground' : 'text-muted-foreground'}>
                                                        {item.label}
                                                    </span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Matching Stage */}
                    {stage === 'matching' && (
                        <motion.div
                            key="matching"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <Card className="terminal-window">
                                <CardContent className="p-8">
                                    <div className="flex flex-col items-center space-y-8">
                                        {/* Neural Network Animation */}
                                        <div className="relative h-40 w-40">
                                            {[...Array(3)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    className="absolute inset-0 rounded-full border-2 border-primary/30"
                                                    animate={{
                                                        scale: [1, 1.5, 1],
                                                        opacity: [0.5, 0, 0.5],
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        delay: i * 0.5,
                                                    }}
                                                />
                                            ))}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <motion.div
                                                    animate={{ scale: [1, 1.1, 1] }}
                                                    transition={{ duration: 1, repeat: Infinity }}
                                                >
                                                    <Sparkles className="h-12 w-12 text-primary" />
                                                </motion.div>
                                            </div>
                                        </div>

                                        <div className="text-center space-y-2">
                                            <h3 className="text-xl font-semibold">
                                                Cerebras Qwen-3-235B Analyzing
                                            </h3>
                                            <p className="text-muted-foreground">
                                                Processing 500+ historical deals and 50+ bank profiles...
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Results Stage */}
                    {stage === 'results' && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                        >
                            {/* Actions */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold">
                                        {matches.length} Matched Lenders
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Ranked by AI match score
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <Button variant="outline" onClick={handleInviteAll}>
                                        Invite All Top Matches
                                    </Button>
                                    <Button onClick={() => router.push(`/dashboard/syndex/deals/${dealId}`)}>
                                        View Deal
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </div>
                            </div>

                            {/* Match Cards */}
                            <div className="space-y-4">
                                {matches.map((match, index) => (
                                    <BankMatchCard
                                        key={match.bank_name}
                                        match={match}
                                        index={index}
                                        onInvite={handleInvite}
                                        isInvited={invitedBanks.has(match.bank_name)}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
