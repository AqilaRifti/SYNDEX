/**
 * SYNDEX Invitation Detail API Route
 * GET /api/invitations/[id] - Get invitation
 * PATCH /api/invitations/[id] - Update invitation status
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { INVITATION_STATUSES, type InvitationStatus } from '@/types/database';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// ============================================
// GET - Get Invitation
// ============================================

export async function GET(_request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { error: 'Invitation ID is required' },
                { status: 400 }
            );
        }

        const supabase = createServerSupabaseClient();

        const { data, error } = await (supabase
            .from('deal_invitations') as any)
            .select(`
                *,
                bank:banks (*),
                deal:deals (*)
            `)
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json(
                    { error: 'Invitation not found' },
                    { status: 404 }
                );
            }
            console.error('Database error fetching invitation:', error);
            return NextResponse.json(
                { error: 'Failed to fetch invitation', details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ data });

    } catch (error) {
        console.error('Error in GET /api/invitations/[id]:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// ============================================
// PATCH - Update Invitation Status
// ============================================

export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { status, commitment_amount } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Invitation ID is required' },
                { status: 400 }
            );
        }

        // Validate status
        if (status && !INVITATION_STATUSES.includes(status as InvitationStatus)) {
            return NextResponse.json(
                { error: `Invalid status. Must be one of: ${INVITATION_STATUSES.join(', ')}` },
                { status: 400 }
            );
        }

        // Validate commitment_amount for committed status
        if (status === 'committed' && (!commitment_amount || commitment_amount <= 0)) {
            return NextResponse.json(
                { error: 'commitment_amount is required and must be positive for committed status' },
                { status: 400 }
            );
        }

        const supabase = createServerSupabaseClient();

        // Build update object
        const updateData: Record<string, unknown> = {};
        if (status) updateData.status = status;
        if (commitment_amount !== undefined) updateData.commitment_amount = commitment_amount;

        const { data, error } = await (supabase
            .from('deal_invitations') as any)
            .update(updateData)
            .eq('id', id)
            .select(`
                *,
                bank:banks (*)
            `)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json(
                    { error: 'Invitation not found' },
                    { status: 404 }
                );
            }
            console.error('Database error updating invitation:', error);
            return NextResponse.json(
                { error: 'Failed to update invitation', details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ data });

    } catch (error) {
        console.error('Error in PATCH /api/invitations/[id]:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// ============================================
// DELETE - Delete Invitation
// ============================================

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { error: 'Invitation ID is required' },
                { status: 400 }
            );
        }

        const supabase = createServerSupabaseClient();

        const { error } = await supabase
            .from('deal_invitations')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Database error deleting invitation:', error);
            return NextResponse.json(
                { error: 'Failed to delete invitation', details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error in DELETE /api/invitations/[id]:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
