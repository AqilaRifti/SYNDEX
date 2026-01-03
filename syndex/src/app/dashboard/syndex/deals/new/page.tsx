'use client';

/**
 * SYNDEX Create Deal Page
 * Form for creating new loan syndication deals
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { Loader2, ArrowRight, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dealSchema, type DealFormData } from '@/lib/validations/deal';
import {
    SECTORS,
    DEAL_TYPES,
    GEOGRAPHIES,
    CURRENCIES,
    RATINGS,
} from '@/types/database';

export default function CreateDealPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(dealSchema),
        defaultValues: {
            currency: 'USD' as const,
            deal_type: 'Senior Secured Credit Facility' as const,
        },
    });

    const onSubmit = async (data: DealFormData) => {
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/deals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to create deal');
            }

            const result = await res.json();
            router.push(`/dashboard/syndex/deals/${result.data.id}/match`);
        } catch (error) {
            console.error('Failed to create deal:', error);
            alert(error instanceof Error ? error.message : 'Failed to create deal');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="flex-1 overflow-auto p-6">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="terminal-window">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-6 w-6 text-primary" />
                                Create New Deal
                            </CardTitle>
                            <CardDescription>
                                Enter deal parameters to find AI-matched lenders
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
                                {/* Borrower Info */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                        Borrower Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="borrower_name">Borrower Name *</Label>
                                            <Input
                                                id="borrower_name"
                                                {...register('borrower_name')}
                                                placeholder="e.g., Acme Corporation"
                                                className="font-mono"
                                            />
                                            {errors.borrower_name && (
                                                <p className="text-xs text-destructive">{errors.borrower_name.message}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="sector">Sector *</Label>
                                            <Select onValueChange={(v) => setValue('sector', v as any)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select sector" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {SECTORS.map((sector) => (
                                                        <SelectItem key={sector} value={sector}>
                                                            {sector}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.sector && (
                                                <p className="text-xs text-destructive">{errors.sector.message}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="sub_sector">Sub-Sector (Optional)</Label>
                                        <Input
                                            id="sub_sector"
                                            {...register('sub_sector')}
                                            placeholder="e.g., Enterprise Software"
                                        />
                                    </div>
                                </div>

                                {/* Deal Terms */}
                                <div className="space-y-4 pt-4 border-t border-border">
                                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                        Deal Terms
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="amount_usd">Amount (USD) *</Label>
                                            <Input
                                                id="amount_usd"
                                                type="number"
                                                {...register('amount_usd', { valueAsNumber: true })}
                                                placeholder="500000000"
                                                className="font-mono"
                                            />
                                            {errors.amount_usd && (
                                                <p className="text-xs text-destructive">{errors.amount_usd.message}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="currency">Currency</Label>
                                            <Select
                                                defaultValue="USD"
                                                onValueChange={(v) => setValue('currency', v as any)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {CURRENCIES.map((currency) => (
                                                        <SelectItem key={currency} value={currency}>
                                                            {currency}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="deal_type">Deal Type *</Label>
                                            <Select
                                                defaultValue="Senior Secured Credit Facility"
                                                onValueChange={(v) => setValue('deal_type', v as any)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {DEAL_TYPES.map((type) => (
                                                        <SelectItem key={type} value={type}>
                                                            {type}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="tenor_years">Tenor (Years) *</Label>
                                            <Input
                                                id="tenor_years"
                                                type="number"
                                                {...register('tenor_years', { valueAsNumber: true })}
                                                placeholder="5"
                                                className="font-mono"
                                            />
                                            {errors.tenor_years && (
                                                <p className="text-xs text-destructive">{errors.tenor_years.message}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="pricing">Pricing *</Label>
                                            <Input
                                                id="pricing"
                                                {...register('pricing')}
                                                placeholder="SOFR + 250bps"
                                                className="font-mono"
                                            />
                                            {errors.pricing && (
                                                <p className="text-xs text-destructive">{errors.pricing.message}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="geography">Geography *</Label>
                                            <Select onValueChange={(v) => setValue('geography', v as any)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select geography" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {GEOGRAPHIES.map((geo) => (
                                                        <SelectItem key={geo} value={geo}>
                                                            {geo}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.geography && (
                                                <p className="text-xs text-destructive">{errors.geography.message}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Ratings */}
                                <div className="space-y-4 pt-4 border-t border-border">
                                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                        Credit Ratings (Optional)
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="rating_sp">S&P Rating</Label>
                                            <Select onValueChange={(v) => setValue('rating_sp', v as any)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select rating" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {RATINGS.map((rating) => (
                                                        <SelectItem key={rating} value={rating}>
                                                            {rating}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="rating_moodys">Moody's Rating</Label>
                                            <Select onValueChange={(v) => setValue('rating_moodys', v as any)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select rating" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {RATINGS.map((rating) => (
                                                        <SelectItem key={rating} value={rating}>
                                                            {rating}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Info */}
                                <div className="space-y-4 pt-4 border-t border-border">
                                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                        Additional Information (Optional)
                                    </h3>
                                    <div className="space-y-2">
                                        <Label htmlFor="use_of_proceeds">Use of Proceeds</Label>
                                        <Textarea
                                            id="use_of_proceeds"
                                            {...register('use_of_proceeds')}
                                            placeholder="e.g., Acquisition financing for strategic expansion"
                                            rows={3}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="target_close_date">Target Close Date</Label>
                                        <Input
                                            id="target_close_date"
                                            type="date"
                                            {...register('target_close_date')}
                                        />
                                    </div>
                                </div>

                                {/* Submit */}
                                <div className="pt-6 border-t border-border">
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full glow-effect"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Creating Deal...
                                            </>
                                        ) : (
                                            <>
                                                Find AI-Matched Lenders
                                                <ArrowRight className="h-4 w-4 ml-2" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </main>
    );
}
