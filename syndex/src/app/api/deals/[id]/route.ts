/**
 * SYNDEX Deal Detail API Route
 * GET /api/deals/[id] - Get deal with invitations
 * PATCH /api/deals/[id] - Update deal
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { validateDealUpdate } from '@/lib/validations/deal';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// ============================================
// GET - Get Deal with Invitations
// ============================================

export async function GET(_request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { error: 'Deal ID is required' },
                { status: 400 }
            );
        }

        const supabase = createServerSupabaseClient();

        // Fetch deal
        const { data: deal, error: dealError } = await supabase
            .from('deals')
            .select('*')
            .eq('id', id)
            .single();

        if (dealError) {
            if (dealError.code === 'PGRST116') {
                return NextResponse.json(
                    { error: 'Deal not found' },
                    { status: 404 }
                );
            }
            console.error('Database error fetching deal:', dealError);
            return NextResponse.json(
                { error: 'Failed to fetch deal', details: dealError.message },
                { status: 500 }
            );
        }

        // Fetch invitations with bank details
        const { data: invitations, error: invError } = await supabase
            .from('deal_invitations')
            .select(`
                *,
                bank:banks (*)
            `)
            .eq('deal_id', id)
            .order('ai_match_score', { ascending: false });

        if (invError) {
            console.error('Database error fetching invitations:', invError);
        }

        return NextResponse.json({
            data: {
                ...(deal as object),
                deal_invitations: invitations || [],
            }
        });

    } catch (error) {
        console.error('Error in GET /api/deals/[id]:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// ============================================
// PATCH - Update Deal
// ============================================

export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await request.json();

        if (!id) {
            return NextResponse.json(
                { error: 'Deal ID is required' },
                { status: 400 }
            );
        }

        // Validate input
        const validation = validateDealUpdate(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.errors },
                { status: 400 }
            );
        }

        const supabase = createServerSupabaseClient();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase
            .from('deals') as any)
            .update(validation.data)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json(
                    { error: 'Deal not found' },
                    { status: 404 }
                );
            }
            console.error('Database error updating deal:', error);
            return NextResponse.json(
                { error: 'Failed to update deal', details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ data });

    } catch (error) {
        console.error('Error in PATCH /api/deals/[id]:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// ============================================
// DELETE - Delete Deal
// ============================================

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { error: 'Deal ID is required' },
                { status: 400 }
            );
        }

        const supabase = createServerSupabaseClient();

        const { error } = await supabase
            .from('deals')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Database error deleting deal:', error);
            return NextResponse.json(
                { error: 'Failed to delete deal', details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error in DELETE /api/deals/[id]:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
