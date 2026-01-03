/**
 * SYNDEX Match Lenders API Route
 * POST /api/match-lenders - Run AI matching for a deal
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { matchLendersForDeal } from '@/lib/ai-matcher';
import type { Deal, Bank, HistoricalParticipation, BankMatch } from '@/types/database';

// ============================================
// POST - Run AI Matching
// ============================================

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { deal_id } = body;

        if (!deal_id) {
            return NextResponse.json(
                { error: 'deal_id is required' },
                { status: 400 }
            );
        }

        const supabase = createServerSupabaseClient();

        // 1. Fetch deal details
        const { data: deal, error: dealError } = await (supabase
            .from('deals') as any)
            .select('*')
            .eq('id', deal_id)
            .single();

        if (dealError || !deal) {
            return NextResponse.json(
                { error: 'Deal not found' },
                { status: 404 }
            );
        }

        // 2. Fetch historical participations for similar deals
        const { data: historicalData, error: histError } = await (supabase
            .from('historical_participations') as any)
            .select(`
                *,
                deals!inner (
                    id,
                    sector,
                    amount_usd,
                    geography
                )
            `)
            .eq('deals.sector', deal.sector)
            .gte('deals.amount_usd', deal.amount_usd * 0.5)
            .lte('deals.amount_usd', deal.amount_usd * 1.5)
            .limit(100);

        if (histError) {
            console.error('Error fetching historical data:', histError);
        }

        // 3. Fetch all available banks
        const { data: allBanks, error: banksError } = await supabase
            .from('banks')
            .select('*');

        if (banksError || !allBanks) {
            return NextResponse.json(
                { error: 'Failed to fetch banks' },
                { status: 500 }
            );
        }

        // 4. Call AI matching
        const { matches, error: matchError } = await matchLendersForDeal(
            deal as Deal,
            (historicalData || []) as HistoricalParticipation[],
            allBanks as Bank[]
        );

        // 5. Store match results as deal invitations
        if (matches.length > 0) {
            const invitations = matches.map((match: BankMatch) => {
                const bank = (allBanks as Bank[]).find(
                    (b: Bank) => b.name.toLowerCase() === match.bank_name.toLowerCase()
                );

                return {
                    deal_id,
                    bank_id: bank?.id,
                    ai_match_score: match.match_score,
                    ai_reasoning: match.reasoning,
                    status: 'pending',
                };
            }).filter((inv) => inv.bank_id); // Only include valid bank IDs

            // Upsert invitations (update if exists, insert if not)
            const { error: insertError } = await (supabase
                .from('deal_invitations') as any)
                .upsert(invitations, {
                    onConflict: 'deal_id,bank_id',
                    ignoreDuplicates: false,
                });

            if (insertError) {
                console.error('Error storing invitations:', insertError);
                // Don't fail the request, just log the error
            }
        }

        // 6. Update deal status to active
        await (supabase
            .from('deals') as any)
            .update({ status: 'active' })
            .eq('id', deal_id);

        // Return matches with any error message
        return NextResponse.json({
            data: matches,
            deal_id,
            matchCount: matches.length,
            warning: matchError || undefined,
        });

    } catch (error) {
        console.error('Error in POST /api/match-lenders:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
