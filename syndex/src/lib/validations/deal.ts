/**
 * SYNDEX Deal Validation Schema
 * Zod schemas for deal creation and validation
 */

import { z } from 'zod';
import {
    SECTORS,
    DEAL_TYPES,
    CURRENCIES,
    GEOGRAPHIES,
    RATINGS,
} from '@/types/database';

// ============================================
// Base Schemas
// ============================================

export const sectorSchema = z.enum(SECTORS);
export const dealTypeSchema = z.enum(DEAL_TYPES);
export const currencySchema = z.enum(CURRENCIES);
export const geographySchema = z.enum(GEOGRAPHIES);
export const ratingSchema = z.enum(RATINGS);

// ============================================
// Deal Creation Schema
// ============================================

export const createDealSchema = z.object({
    // Required fields
    borrower_name: z
        .string()
        .min(2, 'Borrower name must be at least 2 characters')
        .max(200, 'Borrower name must be less than 200 characters')
        .trim(),

    sector: sectorSchema,

    amount_usd: z
        .number()
        .min(1_000_000, 'Deal amount must be at least $1M')
        .max(50_000_000_000, 'Deal amount must be less than $50B'),

    deal_type: dealTypeSchema,

    tenor_years: z
        .number()
        .int('Tenor must be a whole number')
        .min(1, 'Tenor must be at least 1 year')
        .max(30, 'Tenor must be less than 30 years'),

    pricing: z
        .string()
        .min(1, 'Pricing is required')
        .max(100, 'Pricing must be less than 100 characters'),

    geography: geographySchema,

    // Optional fields
    sub_sector: z
        .string()
        .max(100, 'Sub-sector must be less than 100 characters')
        .optional()
        .nullable(),

    currency: currencySchema.default('USD'),

    rating_sp: ratingSchema.optional().nullable(),

    rating_moodys: ratingSchema.optional().nullable(),

    use_of_proceeds: z
        .string()
        .max(500, 'Use of proceeds must be less than 500 characters')
        .optional()
        .nullable(),

    target_close_date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
        .optional()
        .nullable(),
});

export type CreateDealInput = z.infer<typeof createDealSchema>;

// Alias for form usage
export const dealSchema = createDealSchema;
export type DealFormData = CreateDealInput;

// ============================================
// Deal Update Schema
// ============================================

export const updateDealSchema = createDealSchema.partial().extend({
    status: z.enum(['draft', 'active', 'closed']).optional(),
});

export type UpdateDealInput = z.infer<typeof updateDealSchema>;

// ============================================
// Validation Helper Functions
// ============================================

export interface ValidationResult<T> {
    success: boolean;
    data?: T;
    errors?: Record<string, string>;
}

/**
 * Validates deal creation input and returns typed result
 */
export function validateDealInput(
    input: unknown
): ValidationResult<CreateDealInput> {
    const result = createDealSchema.safeParse(input);

    if (result.success) {
        return {
            success: true,
            data: result.data,
        };
    }

    // Transform Zod errors into a simple key-value object
    const errors: Record<string, string> = {};
    if (result.error && result.error.issues) {
        result.error.issues.forEach((issue) => {
            const path = issue.path.join('.');
            errors[path] = issue.message;
        });
    }

    return {
        success: false,
        errors,
    };
}

/**
 * Validates deal update input
 */
export function validateDealUpdate(
    input: unknown
): ValidationResult<UpdateDealInput> {
    const result = updateDealSchema.safeParse(input);

    if (result.success) {
        return {
            success: true,
            data: result.data,
        };
    }

    const errors: Record<string, string> = {};
    if (result.error && result.error.issues) {
        result.error.issues.forEach((issue) => {
            const path = issue.path.join('.');
            errors[path] = issue.message;
        });
    }

    return {
        success: false,
        errors,
    };
}

/**
 * Checks if all required fields are present
 */
export function hasRequiredFields(input: Record<string, unknown>): boolean {
    const requiredFields = [
        'borrower_name',
        'sector',
        'amount_usd',
        'deal_type',
        'tenor_years',
        'pricing',
        'geography',
    ];

    return requiredFields.every(
        (field) => input[field] !== undefined && input[field] !== null && input[field] !== ''
    );
}

/**
 * Formats amount for display
 */
export function formatDealAmount(amount: number): string {
    if (amount >= 1_000_000_000) {
        return `${(amount / 1_000_000_000).toFixed(1)}B`;
    }
    return `${(amount / 1_000_000).toFixed(0)}M`;
}

/**
 * Parses pricing string to extract spread
 */
export function parsePricing(pricing: string): { base: string; spread: number } | null {
    const match = pricing.match(/^(SOFR|LIBOR|EURIBOR|Prime)\s*\+\s*(\d+)/i);
    if (!match) return null;

    return {
        base: match[1].toUpperCase(),
        spread: parseInt(match[2], 10),
    };
}
