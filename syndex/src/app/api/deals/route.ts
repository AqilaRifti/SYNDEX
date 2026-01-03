/**
 * SYNDEX Deals API Route
 * POST /api/deals - Create new deal
 * GET /api/deals - List all deals with stats
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { validateDealInput } from '@/lib/validations/deal';
import type { DealWithStats } from '@/types/database';

// ============================================
// POST - Create New Deal
// ============================================

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const validation = validateDealInput(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.errors },
                { status: 400 }
            );
        }

        const supabase = createServerSupabaseClient();

        // Create deal with draft status
        const { data, error } = await supabase
            .from('deals')
            .insert({
                ...validation.data,
                status: 'draft' as const,
            } as any)
            .select()
            .single();

        if (error) {
            console.error('Database error creating deal:', error);
            return NextResponse.json(
                { error: 'Failed to create deal', details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ data }, { status: 201 });

    } catch (error) {
        console.error('Error in POST /api/deals:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// ============================================
// GET - List All Deals
// ============================================

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const sector = searchParams.get('sector');
        const limit = parseInt(searchParams.get('limit') || '50', 10);
        const offset = parseInt(searchParams.get('offset') || '0', 10);

        const supabase = createServerSupabaseClient();

        // Build query
        let query = supabase
            .from('deals')
            .select(`
        *,
        deal_invitations (
          id,
          status,
          commitment_amount
        )
      `)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        // Apply filters
        if (status) {
            query = query.eq('status', status);
        }
        if (sector) {
            query = query.eq('sector', sector);
        }

        const { data: deals, error } = await query;

        if (error) {
            console.error('Database error fetching deals:', error);
            return NextResponse.json(
                { error: 'Failed to fetch deals', details: error.message },
                { status: 500 }
            );
        }

        // Transform to include stats
        const dealsWithStats: DealWithStats[] = (deals || []).map((deal: any) => {
            const invitations = deal.deal_invitations || [];
            const committed = invitations.filter((i: any) => i.status === 'committed');
            const interested = invitations.filter((i: any) => i.status === 'interested');

            return {
                ...deal,
                deal_invitations: undefined, // Remove raw invitations
                invitation_count: invitations.length,
                committed_count: committed.length,
                interested_count: interested.length,
                committed_amount: committed.reduce(
                    (sum: number, i: any) => sum + (i.commitment_amount || 0),
                    0
                ),
            };
        });

        return NextResponse.json({ data: dealsWithStats });

    } catch (error) {
        console.error('Error in GET /api/deals:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
