/**
 * SYNDEX Banks API Route
 * GET /api/banks - List banks with filters
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import type { Bank, BankTier, Geography, Sector } from '@/types/database';

// ============================================
// GET - List Banks with Filters
// ============================================

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const tier = searchParams.get('tier');
        const geography = searchParams.get('geography');
        const sector = searchParams.get('sector');
        const limit = parseInt(searchParams.get('limit') || '100', 10);
        const offset = parseInt(searchParams.get('offset') || '0', 10);

        const supabase = createServerSupabaseClient();

        // Start with base query
        let query = supabase
            .from('banks')
            .select('*')
            .order('tier', { ascending: true })
            .order('name', { ascending: true })
            .range(offset, offset + limit - 1);

        // Apply search filter (case-insensitive name search)
        if (search) {
            query = query.ilike('name', `%${search}%`);
        }

        // Apply tier filter
        if (tier) {
            const tierNum = parseInt(tier, 10);
            if ([1, 2, 3].includes(tierNum)) {
                query = query.eq('tier', tierNum);
            }
        }

        // Apply geography filter (check if geography is in geographic_focus array)
        if (geography) {
            query = query.contains('geographic_focus', [geography]);
        }

        // Apply sector filter (check if sector is in sectors array)
        if (sector) {
            query = query.contains('sectors', [sector]);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Database error fetching banks:', error);
            return NextResponse.json(
                { error: 'Failed to fetch banks', details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(data);

    } catch (error) {
        console.error('Error in GET /api/banks:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
