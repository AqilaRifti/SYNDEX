/**
 * SYNDEX Database Types
 * TypeScript interfaces for Supabase PostgreSQL tables
 */

// ============================================
// Constants
// ============================================

export const SECTORS = [
    'Technology',
    'Healthcare',
    'Energy',
    'Industrials',
    'Consumer',
    'Financial Services',
    'Real Estate',
    'Telecom',
    'Infrastructure',
    'Media'
] as const;

export type Sector = (typeof SECTORS)[number];

export const DEAL_TYPES = [
    'Senior Secured Credit Facility',
    'Term Loan A',
    'Term Loan B',
    'Revolving Credit Facility',
    'Bridge Loan',
    'Acquisition Financing',
    'Leveraged Buyout',
    'Project Finance',
    'Asset-Based Lending'
] as const;

export type DealType = (typeof DEAL_TYPES)[number];

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CHF'] as const;
export type Currency = (typeof CURRENCIES)[number];

export const GEOGRAPHIES = [
    'United States',
    'Europe',
    'Asia',
    'United Kingdom',
    'Latin America',
    'Middle East',
    'Global'
] as const;

export type Geography = (typeof GEOGRAPHIES)[number];

export const RATINGS = ['AAA', 'AA+', 'AA', 'AA-', 'A+', 'A', 'A-', 'BBB+', 'BBB', 'BBB-', 'BB+', 'BB', 'BB-', 'B+', 'B', 'B-', 'CCC', 'NR'] as const;
export type Rating = (typeof RATINGS)[number];

export const INVITATION_STATUSES = ['pending', 'interested', 'committed', 'declined'] as const;
export type InvitationStatus = (typeof INVITATION_STATUSES)[number];

export const DEAL_STATUSES = ['draft', 'active', 'closed'] as const;
export type DealStatus = (typeof DEAL_STATUSES)[number];

export const PARTICIPATION_ROLES = ['lead_arranger', 'co_arranger', 'participant'] as const;
export type ParticipationRole = (typeof PARTICIPATION_ROLES)[number];

export const BANK_TIERS = [1, 2, 3] as const;
export type BankTier = (typeof BANK_TIERS)[number];

export const CONFIDENCE_LEVELS = ['high', 'medium', 'low'] as const;
export type ConfidenceLevel = (typeof CONFIDENCE_LEVELS)[number];

// ============================================
// Database Table Types
// ============================================

export interface Deal {
    id: string;
    created_at: string;
    borrower_name: string;
    sector: Sector;
    sub_sector?: string | null;
    amount_usd: number;
    currency: Currency;
    deal_type: DealType;
    tenor_years: number;
    pricing: string;
    rating_sp?: Rating | null;
    rating_moodys?: Rating | null;
    geography: Geography;
    use_of_proceeds?: string | null;
    status: DealStatus;
    target_close_date?: string | null;
    created_by?: string | null;
}

export interface Bank {
    id: string;
    name: string;
    tier: BankTier;
    headquarters: string;
    sectors: Sector[];
    min_deal_size: number;
    max_deal_size: number;
    geographic_focus: Geography[];
    logo_url?: string | null;
}

export interface HistoricalParticipation {
    id: string;
    deal_id: string;
    bank_id: string;
    role: ParticipationRole;
    commitment_usd: number;
    participation_date: string;
}

export interface DealInvitation {
    id: string;
    deal_id: string;
    bank_id: string;
    invited_at: string;
    status: InvitationStatus;
    commitment_amount?: number | null;
    updated_at: string;
    ai_match_score: number;
    ai_reasoning: string;
}

// ============================================
// AI Matching Types
// ============================================

export interface BankMatch {
    bank_name: string;
    bank_id?: string;
    match_score: number;
    reasoning: string;
    historical_participation_rate: string;
    estimated_commitment: number;
    confidence: ConfidenceLevel;
}

// ============================================
// Extended Types (with relations)
// ============================================

export interface DealWithInvitations extends Deal {
    deal_invitations: DealInvitation[];
}

export interface DealWithStats extends Deal {
    invitation_count: number;
    committed_count: number;
    committed_amount: number;
    interested_count: number;
}

export interface InvitationWithBank extends DealInvitation {
    bank: Bank;
}

export interface HistoricalParticipationWithRelations extends HistoricalParticipation {
    deal: Deal;
    bank: Bank;
}

// ============================================
// Form/Input Types
// ============================================

export interface CreateDealInput {
    borrower_name: string;
    sector: Sector;
    sub_sector?: string;
    amount_usd: number;
    currency?: Currency;
    deal_type: DealType;
    tenor_years: number;
    pricing: string;
    rating_sp?: Rating;
    rating_moodys?: Rating;
    geography: Geography;
    use_of_proceeds?: string;
    target_close_date?: string;
}

export interface UpdateInvitationInput {
    status: InvitationStatus;
    commitment_amount?: number;
}

export interface BankFilterParams {
    search?: string;
    tier?: BankTier;
    geography?: Geography;
    sector?: Sector;
}

// ============================================
// API Response Types
// ============================================

export interface APIResponse<T> {
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
}

// ============================================
// Timeline Event Types
// ============================================

export interface TimelineEvent {
    id: string;
    timestamp: string;
    event_type: 'deal_created' | 'invitation_sent' | 'status_changed' | 'commitment_received';
    description: string;
    metadata?: Record<string, unknown>;
}

// ============================================
// Supabase Database Type (for client)
// ============================================

export interface Database {
    public: {
        Tables: {
            deals: {
                Row: Deal;
                Insert: Omit<Deal, 'id' | 'created_at'>;
                Update: Partial<Omit<Deal, 'id' | 'created_at'>>;
            };
            banks: {
                Row: Bank;
                Insert: Omit<Bank, 'id'>;
                Update: Partial<Omit<Bank, 'id'>>;
            };
            historical_participations: {
                Row: HistoricalParticipation;
                Insert: Omit<HistoricalParticipation, 'id'>;
                Update: Partial<Omit<HistoricalParticipation, 'id'>>;
            };
            deal_invitations: {
                Row: DealInvitation;
                Insert: Omit<DealInvitation, 'id' | 'invited_at' | 'updated_at'>;
                Update: Partial<Omit<DealInvitation, 'id' | 'invited_at'>>;
            };
        };
    };
}
