'use client';

/**
 * SYNDEX Banks Directory Page
 * Browse and filter bank profiles
 */

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Search, Building2, Globe, DollarSign, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { LoadingSpinner, ErrorDisplay } from '@/components/syndex';
import { getTierBadgeClasses, getTierLabel } from '@/lib/utils/color-coding';
import { formatAmount } from '@/lib/utils/progress';
import type { Bank, BankTier, Geography, Sector } from '@/types/database';
import { GEOGRAPHIES, SECTORS, BANK_TIERS } from '@/types/database';
import { cn } from '@/lib/utils';

export default function BanksDirectoryPage() {
    const [banks, setBanks] = useState<Bank[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [search, setSearch] = useState('');
    const [tierFilter, setTierFilter] = useState<string>('all');
    const [geoFilter, setGeoFilter] = useState<string>('all');
    const [sectorFilter, setSectorFilter] = useState<string>('all');

    const fetchBanks = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (search) params.set('search', search);
            if (tierFilter !== 'all') params.set('tier', tierFilter);
            if (geoFilter !== 'all') params.set('geography', geoFilter);
            if (sectorFilter !== 'all') params.set('sector', sectorFilter);

            const res = await fetch(`/api/banks?${params.toString()}`);
            if (!res.ok) throw new Error('Failed to fetch banks');
            const data = await res.json();
            setBanks(data.data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load banks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const debounce = setTimeout(fetchBanks, 300);
        return () => clearTimeout(debounce);
    }, [search, tierFilter, geoFilter, sectorFilter]);

    return (
        <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Banks Directory
                    </h1>
                    <p className="text-muted-foreground">
                        Browse {banks.length} institutional lenders
                    </p>
                </div>

                {/* Filters */}
                <Card className="terminal-window">
                    <CardContent className="p-4">
                        <div className="flex flex-wrap gap-4">
                            {/* Search */}
                            <div className="flex-1 min-w-[200px]">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search banks..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>

                            {/* Tier Filter */}
                            <Select value={tierFilter} onValueChange={setTierFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Tier" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Tiers</SelectItem>
                                    {BANK_TIERS.map((tier) => (
                                        <SelectItem key={tier} value={tier.toString()}>
                                            Tier {tier}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Geography Filter */}
                            <Select value={geoFilter} onValueChange={setGeoFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Geography" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Geographies</SelectItem>
                                    {GEOGRAPHIES.map((geo) => (
                                        <SelectItem key={geo} value={geo}>
                                            {geo}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Sector Filter */}
                            <Select value={sectorFilter} onValueChange={setSectorFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Sector" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Sectors</SelectItem>
                                    {SECTORS.map((sector) => (
                                        <SelectItem key={sector} value={sector}>
                                            {sector}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Banks Grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <LoadingSpinner size="lg" message="Loading banks..." />
                    </div>
                ) : error ? (
                    <ErrorDisplay message={error} onRetry={fetchBanks} />
                ) : banks.length === 0 ? (
                    <Card className="terminal-window">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No banks found</h3>
                            <p className="text-muted-foreground">
                                Try adjusting your filters
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {banks.map((bank, index) => (
                            <motion.div
                                key={bank.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="terminal-window card-hover h-full">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <CardTitle className="text-lg">
                                                    {bank.name}
                                                </CardTitle>
                                                <Badge
                                                    variant="outline"
                                                    className={cn('text-xs', getTierBadgeClasses(bank.tier))}
                                                >
                                                    {getTierLabel(bank.tier)}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* HQ */}
                                        <div className="flex items-center gap-2 text-sm">
                                            <Globe className="h-4 w-4 text-muted-foreground" />
                                            <span>{bank.headquarters}</span>
                                        </div>

                                        {/* Deal Size Range */}
                                        <div className="flex items-center gap-2 text-sm">
                                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-mono-data">
                                                {formatAmount(bank.min_deal_size)} - {formatAmount(bank.max_deal_size)}
                                            </span>
                                        </div>

                                        {/* Sectors */}
                                        <div className="space-y-2">
                                            <p className="text-xs text-muted-foreground uppercase">Sectors</p>
                                            <div className="flex flex-wrap gap-1">
                                                {bank.sectors.slice(0, 4).map((sector) => (
                                                    <Badge key={sector} variant="secondary" className="text-xs">
                                                        {sector}
                                                    </Badge>
                                                ))}
                                                {bank.sectors.length > 4 && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        +{bank.sectors.length - 4}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        {/* Geographic Focus */}
                                        <div className="space-y-2">
                                            <p className="text-xs text-muted-foreground uppercase">Geographic Focus</p>
                                            <div className="flex flex-wrap gap-1">
                                                {bank.geographic_focus.slice(0, 3).map((geo) => (
                                                    <Badge key={geo} variant="outline" className="text-xs">
                                                        {geo}
                                                    </Badge>
                                                ))}
                                                {bank.geographic_focus.length > 3 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{bank.geographic_focus.length - 3}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
