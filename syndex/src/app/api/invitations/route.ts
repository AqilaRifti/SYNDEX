/**
 * SYNDEX Invitations API Route
 * POST /api/invitations - Create invitation
 * GET /api/invitations - List invitations (with filters)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { INVITATION_STATUSES, type InvitationStatus } from '@/types/database';

// ============================================
// POST - Create Invitation
// ============================================

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { deal_id, bank_id, ai_match_score, ai_reasoning } = body;

        if (!deal_id || !bank_id) {
            return NextResponse.json(
                { error: 'deal_id and bank_id are required' },
                { status: 400 }
            );
        }

        const supabase = createServerSupabaseClient();

        // Check if invitation already exists
        const { data: existing } = await (supabase
            .from('deal_invitations') as any)
            .select('id')
            .eq('deal_id', deal_id)
            .eq('bank_id', bank_id)
            .single();

        if (existing) {
            return NextResponse.json(
                { error: 'Invitation already exists', id: existing.id },
                { status: 409 }
            );
        }

        // Create invitation
        const { data, error } = await (supabase
            .from('deal_invitations') as any)
            .insert({
                deal_id,
                bank_id,
                ai_match_score: ai_match_score || null,
                ai_reasoning: ai_reasoning || null,
                status: 'pending',
            })
            .select(`
                *,
                bank:banks (*)
            `)
            .single();

        if (error) {
            console.error('Database error creating invitation:', error);
            return NextResponse.json(
                { error: 'Failed to create invitation', details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ data }, { status: 201 });

    } catch (error) {
        console.error('Error in POST /api/invitations:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// ============================================
// GET - List Invitations
// ============================================

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const dealId = searchParams.get('deal_id');
        const bankId = searchParams.get('bank_id');
        const status = searchParams.get('status');

        const supabase = createServerSupabaseClient();

        let query = (supabase
            .from('deal_invitations') as any)
            .select(`
                *,
                bank:banks (*),
                deal:deals (*)
            `)
            .order('ai_match_score', { ascending: false });

        if (dealId) {
            query = query.eq('deal_id', dealId);
        }
        if (bankId) {
            query = query.eq('bank_id', bankId);
        }
        if (status && INVITATION_STATUSES.includes(status as InvitationStatus)) {
            query = query.eq('status', status);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Database error fetching invitations:', error);
            return NextResponse.json(
                { error: 'Failed to fetch invitations', details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ data });

    } catch (error) {
        console.error('Error in GET /api/invitations:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
