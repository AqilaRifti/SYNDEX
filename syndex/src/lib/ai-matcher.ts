/**
 * SYNDEX AI Matcher Service
 * Cerebras Qwen AI integration for intelligent lender matching
 */

import Cerebras from '@cerebras/cerebras_cloud_sdk';
import type { Deal, Bank, HistoricalParticipation, BankMatch } from '@/types/database';

// ============================================
// API Key Rotation for Load Balancing
// ============================================

const API_KEYS = [
    process.env.CEREBRAS_API_KEY_1 || 'csk-c9ddc69fd3pk9jj3py24jmhydft6c2ymmdk59tyt6em6derk',
    process.env.CEREBRAS_API_KEY_2 || 'csk-nrtfnn56xmvkyckdt9nwn3rh8ef8vwx9xxktvxwmk6yxw566',
    process.env.CEREBRAS_API_KEY_3 || 'csk-hrtwc24p9mtw48m4dmvf95j4xx539nth4y63wxympjhkdhfp',
    process.env.CEREBRAS_API_KEY_4 || 'csk-4r22m82n6pve9ywhd9hkpdneek6t52keethr5dn66jpw6fyw',
    process.env.CEREBRAS_API_KEY_5 || 'csk-wp589vwjn2hfhnxhv9rwyj54tnpexc6yfxev5en9x6ffej5m',
    process.env.CEREBRAS_API_KEY_6 || 'csk-6232phepe8nxn25vrwjenf2p9mpke9txvw6pjjd6jx8reh2n',
    process.env.CEREBRAS_API_KEY_7 || 'csk-4f9vfnrkmd898h5dyr98y8j2ftnjhvhee322mvy8tmhnfthh',
    process.env.CEREBRAS_API_KEY_8 || 'csk-mennk8jmdnxptr4r56xv9mc95t9vwjpwhhnr54jhp4382wjt',
].filter(Boolean);

let currentKeyIndex = 0;

/**
 * Gets the next API key in round-robin rotation
 * Exported for testing purposes
 */
export function getNextApiKey(): string {
    const key = API_KEYS[currentKeyIndex];
    currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
    return key;
}

/**
 * Resets the key index (for testing)
 */
export function resetKeyIndex(): void {
    currentKeyIndex = 0;
}

/**
 * Gets the current key index (for testing)
 */
export function getCurrentKeyIndex(): number {
    return currentKeyIndex;
}

/**
 * Gets total number of API keys
 */
export function getApiKeyCount(): number {
    return API_KEYS.length;
}

// ============================================
// AI Client Configuration
// ============================================

const MODEL = 'qwen-3-235b-a22b-instruct-2507';
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

/**
 * Creates a new Cerebras client with the next API key
 */
function createClient(): Cerebras {
    return new Cerebras({
        apiKey: getNextApiKey(),
    });
}

// ============================================
// Prompt Templates
// ============================================

const SYSTEM_PROMPT = `You are an expert loan syndication analyst at a top investment bank. Your job is to analyze deals and predict which banks are most likely to participate in a syndication based on historical patterns.

You have access to:
1. Historical participation data showing which banks participated in past deals
2. Bank mandates (sectors, deal sizes, geographies they prefer)
3. Market conditions and trends

Your analysis should consider:
- Sector expertise and historical participation in similar deals
- Geographic alignment between bank focus and deal location
- Deal size fit within bank's typical range
- Bank tier and typical role (lead arranger vs participant)
- Historical co-lending relationships

Your output MUST be valid JSON only, no additional text or markdown formatting.`;

function buildUserPrompt(
    deal: Deal,
    historicalData: HistoricalParticipation[],
    allBanks: Bank[]
): string {
    const dealAmount = (deal.amount_usd / 1_000_000).toFixed(0);

    // Summarize historical patterns
    const historicalSummary = summarizeHistoricalData(historicalData, allBanks);

    // Format bank list
    const bankList = allBanks.map(b => ({
        name: b.name,
        tier: b.tier,
        sectors: b.sectors,
        hq: b.headquarters,
        geo_focus: b.geographic_focus,
        deal_range: `$${(b.min_deal_size / 1_000_000).toFixed(0)}M - $${(b.max_deal_size / 1_000_000).toFixed(0)}M`,
    }));

    return `Analyze this loan deal and rank the top 20 banks most likely to participate:

**DEAL DETAILS:**
- Borrower: ${deal.borrower_name}
- Sector: ${deal.sector}
- Amount: $${dealAmount}M
- Geography: ${deal.geography}
- Rating: ${deal.rating_sp || 'NR'}
- Tenor: ${deal.tenor_years} years
- Pricing: ${deal.pricing}
- Deal Type: ${deal.deal_type}
- Use of Proceeds: ${deal.use_of_proceeds || 'General Corporate'}

**HISTORICAL PATTERNS (Similar Deals):**
${historicalSummary}

**AVAILABLE BANKS:**
${JSON.stringify(bankList, null, 2)}

Analyze patterns such as:
- Which banks historically participate in similar sector/size deals
- Geographic preferences (US banks for US deals, etc.)
- Bank relationships (which banks often co-lend together)
- Sector specialization
- Deal size fit (don't suggest small regional banks for $1B+ deals)

Return ONLY a JSON array with this exact structure:
[
  {
    "bank_name": "JPMorgan Chase",
    "match_score": 92,
    "reasoning": "Lead arranger in 8 of past 10 similar tech deals, strong relationship with borrower sector, ideal deal size",
    "historical_participation_rate": "80%",
    "estimated_commitment": 75000000,
    "confidence": "high"
  }
]

Return exactly 20 banks, ranked by match_score (0-100). Ensure match_score values are realistic and differentiated.`;
}

/**
 * Summarizes historical participation data for the prompt
 */
function summarizeHistoricalData(
    participations: HistoricalParticipation[],
    banks: Bank[]
): string {
    if (participations.length === 0) {
        return 'No historical data available for similar deals.';
    }

    const bankMap = new Map(banks.map(b => [b.id, b.name]));

    // Count participations by bank
    const bankCounts = new Map<string, number>();
    const leadCounts = new Map<string, number>();

    participations.forEach(p => {
        const bankName = bankMap.get(p.bank_id) || 'Unknown';
        bankCounts.set(bankName, (bankCounts.get(bankName) || 0) + 1);
        if (p.role === 'lead_arranger') {
            leadCounts.set(bankName, (leadCounts.get(bankName) || 0) + 1);
        }
    });

    // Get top 10 most active banks
    const topBanks = Array.from(bankCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, count]) => {
            const leads = leadCounts.get(name) || 0;
            return `- ${name}: ${count} deals (${leads} as lead)`;
        });

    return `Based on ${participations.length} similar historical participations:\n${topBanks.join('\n')}`;
}

// ============================================
// Main Matching Function
// ============================================

export interface MatchLendersResult {
    matches: BankMatch[];
    error?: string;
}

/**
 * Matches lenders for a deal using AI analysis
 * 
 * @param deal - The deal to match lenders for
 * @param historicalData - Historical participation records for similar deals
 * @param allBanks - All available banks
 * @returns Array of bank matches ranked by score
 */
export async function matchLendersForDeal(
    deal: Deal,
    historicalData: HistoricalParticipation[],
    allBanks: Bank[]
): Promise<MatchLendersResult> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            const client = createClient();

            const response = await client.chat.completions.create({
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: buildUserPrompt(deal, historicalData, allBanks) },
                ],
                model: MODEL,
                stream: false,
                max_completion_tokens: 8192,
                temperature: 0.6,
                top_p: 0.95,
            });

            const content = (response as any).choices?.[0]?.message?.content;

            if (!content) {
                throw new Error('Empty response from AI');
            }

            // Parse JSON from response (handle potential markdown wrapping)
            const matches = parseAIResponse(content);

            // Validate and normalize matches
            const validatedMatches = validateMatches(matches, allBanks);

            return { matches: validatedMatches };

        } catch (error) {
            lastError = error as Error;
            console.error(`AI matching attempt ${attempt + 1} failed:`, error);

            // Wait before retry (exponential backoff)
            if (attempt < MAX_RETRIES - 1) {
                await sleep(RETRY_DELAY_MS * Math.pow(2, attempt));
            }
        }
    }

    // All retries failed
    console.error('All AI matching attempts failed:', lastError);
    return {
        matches: generateFallbackMatches(deal, allBanks),
        error: lastError?.message || 'AI matching failed after multiple attempts',
    };
}

// ============================================
// Response Parsing and Validation
// ============================================

/**
 * Parses AI response to extract JSON array
 */
function parseAIResponse(content: string): unknown[] {
    // Try to find JSON array in response
    const jsonMatch = content.match(/\[[\s\S]*\]/);

    if (!jsonMatch) {
        // Try parsing the whole content as JSON
        try {
            const parsed = JSON.parse(content);
            if (Array.isArray(parsed)) return parsed;
        } catch {
            throw new Error('No valid JSON array found in AI response');
        }
        throw new Error('No valid JSON array found in AI response');
    }

    try {
        return JSON.parse(jsonMatch[0]);
    } catch (e) {
        throw new Error(`Failed to parse AI response JSON: ${e}`);
    }
}

/**
 * Validates and normalizes AI matches
 */
function validateMatches(matches: unknown[], allBanks: Bank[]): BankMatch[] {
    if (!Array.isArray(matches)) {
        throw new Error('AI response is not an array');
    }

    const bankNames = new Set(allBanks.map(b => b.name.toLowerCase()));
    const validMatches: BankMatch[] = [];

    for (const match of matches) {
        if (!isValidMatch(match)) continue;

        // Normalize bank name
        const normalizedName = findBankName(String(match.bank_name), allBanks);
        if (!normalizedName) continue;

        validMatches.push({
            bank_name: normalizedName,
            match_score: Math.min(100, Math.max(0, Number(match.match_score))),
            reasoning: String(match.reasoning || 'No reasoning provided'),
            historical_participation_rate: String(match.historical_participation_rate || '0%'),
            estimated_commitment: Number(match.estimated_commitment) || 0,
            confidence: validateConfidence(match.confidence),
        });
    }

    // Sort by score and limit to 20
    return validMatches
        .sort((a, b) => b.match_score - a.match_score)
        .slice(0, 20);
}

/**
 * Type guard for match object
 */
function isValidMatch(match: unknown): match is Record<string, unknown> {
    return (
        typeof match === 'object' &&
        match !== null &&
        'bank_name' in match &&
        'match_score' in match
    );
}

/**
 * Finds the correct bank name (case-insensitive)
 */
function findBankName(name: string, banks: Bank[]): string | null {
    const lowerName = name.toLowerCase().trim();
    const bank = banks.find(b => b.name.toLowerCase() === lowerName);
    return bank?.name || null;
}

/**
 * Validates confidence level
 */
function validateConfidence(confidence: unknown): 'high' | 'medium' | 'low' {
    if (confidence === 'high' || confidence === 'medium' || confidence === 'low') {
        return confidence;
    }
    return 'medium';
}

// ============================================
// Fallback Matching (when AI fails)
// ============================================

/**
 * Generates fallback matches based on simple heuristics
 * Used when AI matching fails
 */
function generateFallbackMatches(deal: Deal, banks: Bank[]): BankMatch[] {
    return banks
        .map(bank => {
            let score = 50; // Base score

            // Sector match bonus
            if (bank.sectors.includes(deal.sector)) {
                score += 20;
            }

            // Geography match bonus
            if (bank.geographic_focus.includes(deal.geography)) {
                score += 15;
            }

            // Deal size fit
            if (deal.amount_usd >= bank.min_deal_size && deal.amount_usd <= bank.max_deal_size) {
                score += 10;
            }

            // Tier bonus (tier 1 banks get slight preference for large deals)
            if (bank.tier === 1 && deal.amount_usd >= 500_000_000) {
                score += 5;
            }

            // Add some randomness
            score += Math.random() * 10 - 5;

            return {
                bank_name: bank.name,
                match_score: Math.min(100, Math.max(0, Math.round(score))),
                reasoning: `${bank.name} has ${bank.sectors.includes(deal.sector) ? 'strong' : 'some'} sector expertise and ${bank.geographic_focus.includes(deal.geography) ? 'geographic alignment' : 'global reach'}.`,
                historical_participation_rate: `${Math.floor(Math.random() * 40 + 30)}%`,
                estimated_commitment: Math.floor(deal.amount_usd * (Math.random() * 0.1 + 0.05)),
                confidence: score > 70 ? 'high' : score > 50 ? 'medium' : 'low',
            } as BankMatch;
        })
        .sort((a, b) => b.match_score - a.match_score)
        .slice(0, 20);
}

// ============================================
// Utilities
// ============================================

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
