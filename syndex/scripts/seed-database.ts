/**
 * SYNDEX Database Seed Script
 * Generates realistic synthetic data for AI matching demonstration
 * 
 * Run with: npx tsx scripts/seed-database.ts
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables');
    console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'set' : 'missing');
    console.error('SUPABASE_SERVICE_KEY:', supabaseServiceKey ? 'set' : 'missing');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ============================================
// Bank Data - 50+ Major Global Banks
// ============================================

const BANKS = [
    // Tier 1 - Bulge Bracket (15 banks)
    { name: 'JPMorgan Chase', tier: 1, hq: 'United States', sectors: ['Technology', 'Healthcare', 'Industrials', 'Consumer'], geo: ['United States', 'Europe', 'Asia'], minDeal: 500_000_000, maxDeal: 10_000_000_000 },
    { name: 'Bank of America', tier: 1, hq: 'United States', sectors: ['Energy', 'Technology', 'Consumer', 'Real Estate'], geo: ['United States', 'Europe'], minDeal: 500_000_000, maxDeal: 8_000_000_000 },
    { name: 'Citigroup', tier: 1, hq: 'United States', sectors: ['Technology', 'Financial Services', 'Telecom', 'Infrastructure'], geo: ['United States', 'Europe', 'Asia', 'Latin America'], minDeal: 400_000_000, maxDeal: 10_000_000_000 },
    { name: 'Goldman Sachs', tier: 1, hq: 'United States', sectors: ['Technology', 'Media', 'Healthcare', 'Financial Services'], geo: ['United States', 'Europe', 'Asia'], minDeal: 500_000_000, maxDeal: 8_000_000_000 },
    { name: 'Morgan Stanley', tier: 1, hq: 'United States', sectors: ['Technology', 'Healthcare', 'Industrials', 'Media'], geo: ['United States', 'Europe', 'Asia'], minDeal: 400_000_000, maxDeal: 7_000_000_000 },
    { name: 'Wells Fargo', tier: 1, hq: 'United States', sectors: ['Real Estate', 'Consumer', 'Industrials', 'Energy'], geo: ['United States'], minDeal: 300_000_000, maxDeal: 5_000_000_000 },
    { name: 'Barclays', tier: 1, hq: 'United Kingdom', sectors: ['Energy', 'Industrials', 'Financial Services', 'Infrastructure'], geo: ['Europe', 'United Kingdom', 'United States'], minDeal: 400_000_000, maxDeal: 6_000_000_000 },
    { name: 'HSBC', tier: 1, hq: 'United Kingdom', sectors: ['Energy', 'Infrastructure', 'Industrials', 'Real Estate'], geo: ['Europe', 'Asia', 'United Kingdom', 'Middle East'], minDeal: 500_000_000, maxDeal: 8_000_000_000 },
    { name: 'Deutsche Bank', tier: 1, hq: 'Germany', sectors: ['Industrials', 'Energy', 'Technology', 'Financial Services'], geo: ['Europe', 'United States', 'Asia'], minDeal: 400_000_000, maxDeal: 6_000_000_000 },
    { name: 'BNP Paribas', tier: 1, hq: 'France', sectors: ['Energy', 'Infrastructure', 'Telecom', 'Industrials'], geo: ['Europe', 'United States', 'Asia'], minDeal: 400_000_000, maxDeal: 7_000_000_000 },
    { name: 'Credit Agricole', tier: 1, hq: 'France', sectors: ['Infrastructure', 'Energy', 'Real Estate', 'Consumer'], geo: ['Europe', 'Asia'], minDeal: 300_000_000, maxDeal: 5_000_000_000 },
    { name: 'UBS', tier: 1, hq: 'Switzerland', sectors: ['Healthcare', 'Technology', 'Financial Services', 'Consumer'], geo: ['Europe', 'United States', 'Asia'], minDeal: 400_000_000, maxDeal: 6_000_000_000 },
    { name: 'Mizuho', tier: 1, hq: 'Japan', sectors: ['Industrials', 'Technology', 'Energy', 'Infrastructure'], geo: ['Asia', 'United States', 'Europe'], minDeal: 400_000_000, maxDeal: 6_000_000_000 },
    { name: 'SMBC', tier: 1, hq: 'Japan', sectors: ['Industrials', 'Technology', 'Infrastructure', 'Energy'], geo: ['Asia', 'United States', 'Europe'], minDeal: 400_000_000, maxDeal: 6_000_000_000 },
    { name: 'Bank of China', tier: 1, hq: 'China', sectors: ['Energy', 'Infrastructure', 'Industrials', 'Real Estate'], geo: ['Asia', 'Europe', 'United States'], minDeal: 500_000_000, maxDeal: 8_000_000_000 },

    // Tier 2 - Mid-Tier Banks (20 banks)
    { name: 'RBC Capital Markets', tier: 2, hq: 'Canada', sectors: ['Energy', 'Mining', 'Technology', 'Financial Services'], geo: ['United States', 'Europe'], minDeal: 200_000_000, maxDeal: 3_000_000_000 },
    { name: 'TD Securities', tier: 2, hq: 'Canada', sectors: ['Energy', 'Consumer', 'Real Estate', 'Healthcare'], geo: ['United States', 'Europe'], minDeal: 200_000_000, maxDeal: 3_000_000_000 },
    { name: 'Scotiabank', tier: 2, hq: 'Canada', sectors: ['Energy', 'Mining', 'Infrastructure', 'Consumer'], geo: ['United States', 'Latin America'], minDeal: 150_000_000, maxDeal: 2_500_000_000 },
    { name: 'ING Bank', tier: 2, hq: 'Netherlands', sectors: ['Energy', 'Infrastructure', 'Real Estate', 'Telecom'], geo: ['Europe', 'Asia'], minDeal: 200_000_000, maxDeal: 3_000_000_000 },
    { name: 'Societe Generale', tier: 2, hq: 'France', sectors: ['Energy', 'Infrastructure', 'Industrials', 'Financial Services'], geo: ['Europe', 'United States'], minDeal: 250_000_000, maxDeal: 4_000_000_000 },
    { name: 'Natixis', tier: 2, hq: 'France', sectors: ['Infrastructure', 'Energy', 'Real Estate', 'Aviation'], geo: ['Europe', 'United States', 'Asia'], minDeal: 200_000_000, maxDeal: 3_000_000_000 },
    { name: 'Commerzbank', tier: 2, hq: 'Germany', sectors: ['Industrials', 'Energy', 'Technology', 'Consumer'], geo: ['Europe'], minDeal: 150_000_000, maxDeal: 2_500_000_000 },
    { name: 'UniCredit', tier: 2, hq: 'Italy', sectors: ['Infrastructure', 'Energy', 'Real Estate', 'Industrials'], geo: ['Europe'], minDeal: 200_000_000, maxDeal: 3_000_000_000 },
    { name: 'Intesa Sanpaolo', tier: 2, hq: 'Italy', sectors: ['Infrastructure', 'Energy', 'Consumer', 'Real Estate'], geo: ['Europe'], minDeal: 150_000_000, maxDeal: 2_500_000_000 },
    { name: 'Santander', tier: 2, hq: 'Spain', sectors: ['Energy', 'Infrastructure', 'Consumer', 'Real Estate'], geo: ['Europe', 'Latin America', 'United States'], minDeal: 200_000_000, maxDeal: 3_500_000_000 },
    { name: 'BBVA', tier: 2, hq: 'Spain', sectors: ['Energy', 'Infrastructure', 'Consumer', 'Telecom'], geo: ['Europe', 'Latin America', 'United States'], minDeal: 150_000_000, maxDeal: 2_500_000_000 },
    { name: 'Standard Chartered', tier: 2, hq: 'United Kingdom', sectors: ['Energy', 'Infrastructure', 'Financial Services', 'Consumer'], geo: ['Asia', 'Middle East', 'Europe'], minDeal: 200_000_000, maxDeal: 3_000_000_000 },
    { name: 'ANZ', tier: 2, hq: 'Australia', sectors: ['Energy', 'Mining', 'Infrastructure', 'Real Estate'], geo: ['Asia', 'Europe'], minDeal: 150_000_000, maxDeal: 2_500_000_000 },
    { name: 'Westpac', tier: 2, hq: 'Australia', sectors: ['Energy', 'Mining', 'Infrastructure', 'Consumer'], geo: ['Asia'], minDeal: 150_000_000, maxDeal: 2_000_000_000 },
    { name: 'National Australia Bank', tier: 2, hq: 'Australia', sectors: ['Energy', 'Mining', 'Real Estate', 'Infrastructure'], geo: ['Asia', 'Europe'], minDeal: 150_000_000, maxDeal: 2_500_000_000 },
    { name: 'DBS Bank', tier: 2, hq: 'Singapore', sectors: ['Technology', 'Real Estate', 'Infrastructure', 'Consumer'], geo: ['Asia'], minDeal: 150_000_000, maxDeal: 2_500_000_000 },
    { name: 'OCBC', tier: 2, hq: 'Singapore', sectors: ['Real Estate', 'Infrastructure', 'Consumer', 'Financial Services'], geo: ['Asia'], minDeal: 100_000_000, maxDeal: 2_000_000_000 },
    { name: 'UOB', tier: 2, hq: 'Singapore', sectors: ['Real Estate', 'Consumer', 'Infrastructure', 'Technology'], geo: ['Asia'], minDeal: 100_000_000, maxDeal: 2_000_000_000 },
    { name: 'Korea Development Bank', tier: 2, hq: 'South Korea', sectors: ['Industrials', 'Technology', 'Infrastructure', 'Energy'], geo: ['Asia'], minDeal: 200_000_000, maxDeal: 3_000_000_000 },
    { name: 'Industrial Bank of Korea', tier: 2, hq: 'South Korea', sectors: ['Industrials', 'Technology', 'Consumer', 'Energy'], geo: ['Asia'], minDeal: 150_000_000, maxDeal: 2_500_000_000 },

    // Tier 3 - Regional Banks (15 banks)
    { name: 'PNC Financial', tier: 3, hq: 'United States', sectors: ['Healthcare', 'Consumer', 'Real Estate', 'Technology'], geo: ['United States'], minDeal: 100_000_000, maxDeal: 1_500_000_000 },
    { name: 'US Bancorp', tier: 3, hq: 'United States', sectors: ['Consumer', 'Real Estate', 'Healthcare', 'Industrials'], geo: ['United States'], minDeal: 100_000_000, maxDeal: 1_500_000_000 },
    { name: 'Truist', tier: 3, hq: 'United States', sectors: ['Healthcare', 'Consumer', 'Real Estate', 'Technology'], geo: ['United States'], minDeal: 100_000_000, maxDeal: 1_500_000_000 },
    { name: 'Fifth Third Bank', tier: 3, hq: 'United States', sectors: ['Consumer', 'Healthcare', 'Industrials', 'Real Estate'], geo: ['United States'], minDeal: 75_000_000, maxDeal: 1_000_000_000 },
    { name: 'KeyBank', tier: 3, hq: 'United States', sectors: ['Healthcare', 'Consumer', 'Industrials', 'Real Estate'], geo: ['United States'], minDeal: 75_000_000, maxDeal: 1_000_000_000 },
    { name: 'Regions Bank', tier: 3, hq: 'United States', sectors: ['Energy', 'Consumer', 'Real Estate', 'Healthcare'], geo: ['United States'], minDeal: 75_000_000, maxDeal: 1_000_000_000 },
    { name: 'M&T Bank', tier: 3, hq: 'United States', sectors: ['Real Estate', 'Consumer', 'Healthcare', 'Industrials'], geo: ['United States'], minDeal: 75_000_000, maxDeal: 1_000_000_000 },
    { name: 'Citizens Bank', tier: 3, hq: 'United States', sectors: ['Healthcare', 'Consumer', 'Technology', 'Real Estate'], geo: ['United States'], minDeal: 100_000_000, maxDeal: 1_200_000_000 },
    { name: 'Huntington Bank', tier: 3, hq: 'United States', sectors: ['Consumer', 'Healthcare', 'Industrials', 'Real Estate'], geo: ['United States'], minDeal: 50_000_000, maxDeal: 800_000_000 },
    { name: 'Lloyds Banking Group', tier: 3, hq: 'United Kingdom', sectors: ['Real Estate', 'Consumer', 'Infrastructure', 'Healthcare'], geo: ['United Kingdom', 'Europe'], minDeal: 100_000_000, maxDeal: 1_500_000_000 },
    { name: 'NatWest', tier: 3, hq: 'United Kingdom', sectors: ['Real Estate', 'Consumer', 'Infrastructure', 'Energy'], geo: ['United Kingdom', 'Europe'], minDeal: 100_000_000, maxDeal: 1_500_000_000 },
    { name: 'Rabobank', tier: 3, hq: 'Netherlands', sectors: ['Consumer', 'Real Estate', 'Infrastructure', 'Energy'], geo: ['Europe'], minDeal: 100_000_000, maxDeal: 1_500_000_000 },
    { name: 'Nordea', tier: 3, hq: 'Finland', sectors: ['Energy', 'Infrastructure', 'Real Estate', 'Consumer'], geo: ['Europe'], minDeal: 100_000_000, maxDeal: 1_500_000_000 },
    { name: 'SEB', tier: 3, hq: 'Sweden', sectors: ['Energy', 'Infrastructure', 'Real Estate', 'Industrials'], geo: ['Europe'], minDeal: 100_000_000, maxDeal: 1_500_000_000 },
    { name: 'Danske Bank', tier: 3, hq: 'Denmark', sectors: ['Energy', 'Infrastructure', 'Real Estate', 'Consumer'], geo: ['Europe'], minDeal: 100_000_000, maxDeal: 1_200_000_000 },
];

const SECTORS = ['Technology', 'Healthcare', 'Energy', 'Industrials', 'Consumer', 'Financial Services', 'Real Estate', 'Telecom', 'Infrastructure', 'Media'];
const DEAL_TYPES = ['Senior Secured Credit Facility', 'Term Loan A', 'Term Loan B', 'Revolving Credit Facility', 'Bridge Loan', 'Acquisition Financing'];
const GEOGRAPHIES = ['United States', 'Europe', 'Asia', 'United Kingdom', 'Latin America'];
const RATINGS = ['AAA', 'AA+', 'AA', 'AA-', 'A+', 'A', 'A-', 'BBB+', 'BBB', 'BBB-', 'BB+', 'BB', 'BB-', 'B+', 'B'];

// Company name generators
const TECH_COMPANIES = ['TechVenture', 'CloudScale', 'DataSync', 'CyberShield', 'AILogic', 'QuantumByte', 'NexGen', 'DigiCore', 'SmartFlow', 'CodeWave'];
const HEALTHCARE_COMPANIES = ['MedLife', 'BioGenix', 'HealthFirst', 'PharmaCore', 'CarePoint', 'VitalMed', 'GenomeTech', 'MedDevice', 'HealthSync', 'BioVita'];
const ENERGY_COMPANIES = ['PowerGrid', 'SolarMax', 'WindForce', 'EnergyOne', 'GreenPower', 'FuelTech', 'OilField', 'GasStream', 'RenewCo', 'EcoEnergy'];
const INDUSTRIAL_COMPANIES = ['SteelWorks', 'MetalCraft', 'BuildPro', 'MachineCore', 'FactoryOne', 'IndustrialTech', 'ManufactPro', 'HeavyDuty', 'PrecisionMfg', 'AutoParts'];
const CONSUMER_COMPANIES = ['RetailMax', 'BrandCo', 'ShopSmart', 'ConsumerFirst', 'MarketPlace', 'TrendStyle', 'FoodChain', 'BeverageCo', 'ApparelGroup', 'HomeGoods'];

const COMPANY_NAMES: Record<string, string[]> = {
    'Technology': TECH_COMPANIES,
    'Healthcare': HEALTHCARE_COMPANIES,
    'Energy': ENERGY_COMPANIES,
    'Industrials': INDUSTRIAL_COMPANIES,
    'Consumer': CONSUMER_COMPANIES,
    'Financial Services': ['CapitalOne', 'FinanceHub', 'InvestCo', 'AssetMgmt', 'WealthGroup'],
    'Real Estate': ['PropertyMax', 'RealtyGroup', 'LandCorp', 'BuildingCo', 'EstateHoldings'],
    'Telecom': ['TelecomOne', 'NetworkCo', 'ConnectTel', 'MobileCom', 'FiberLink'],
    'Infrastructure': ['InfraCo', 'TransportHub', 'UtilityCorp', 'BridgeWorks', 'RoadBuilders'],
    'Media': ['MediaGroup', 'ContentCo', 'StreamMax', 'BroadcastOne', 'EntertainCorp'],
};

// Helper functions
function randomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateDealAmount(): number {
    // Realistic distribution: more deals in $100M-$500M range
    const ranges = [
        { min: 100, max: 300, weight: 30 },
        { min: 300, max: 500, weight: 25 },
        { min: 500, max: 800, weight: 20 },
        { min: 800, max: 1200, weight: 15 },
        { min: 1200, max: 2100, weight: 10 },
    ];

    const totalWeight = ranges.reduce((sum, r) => sum + r.weight, 0);
    let random = Math.random() * totalWeight;

    for (const range of ranges) {
        random -= range.weight;
        if (random <= 0) {
            return randomInt(range.min, range.max) * 1_000_000;
        }
    }

    return 500_000_000;
}

function generateBorrowerName(sector: string, index: number): string {
    const companies = COMPANY_NAMES[sector] || COMPANY_NAMES['Technology'];
    const company = randomElement(companies);
    const suffixes = ['Inc.', 'Corp.', 'Holdings', 'Group', 'LLC', 'Partners'];
    return `${company} ${randomElement(suffixes)}`;
}

function generatePricing(): string {
    const spread = randomInt(150, 400);
    return `SOFR + ${spread} bps`;
}

function generateDate(daysAgo: number): string {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
}

// ============================================
// Seed Functions
// ============================================

async function seedBanks() {
    console.log('Seeding banks...');

    const bankData = BANKS.map(bank => ({
        name: bank.name,
        tier: bank.tier,
        headquarters: bank.hq,
        sectors: bank.sectors,
        min_deal_size: bank.minDeal,
        max_deal_size: bank.maxDeal,
        geographic_focus: bank.geo,
    }));

    const { data, error } = await supabase
        .from('banks')
        .upsert(bankData, { onConflict: 'name' })
        .select();

    if (error) {
        console.error('Error seeding banks:', error);
        throw error;
    }

    console.log(`Seeded ${data?.length || 0} banks`);
    return data;
}

async function seedDeals(count: number = 500) {
    console.log(`Seeding ${count} deals...`);

    const deals = [];

    for (let i = 0; i < count; i++) {
        const sector = randomElement(SECTORS);
        const amount = generateDealAmount();
        const tenor = randomElement([3, 5, 7, 10]);
        const daysAgo = randomInt(1, 730); // Up to 2 years ago

        deals.push({
            borrower_name: generateBorrowerName(sector, i),
            sector,
            amount_usd: amount,
            currency: 'USD',
            deal_type: randomElement(DEAL_TYPES),
            tenor_years: tenor,
            pricing: generatePricing(),
            rating_sp: randomElement(RATINGS),
            geography: randomElement(GEOGRAPHIES),
            use_of_proceeds: randomElement(['Refinancing', 'Acquisition', 'General Corporate', 'Expansion', 'Working Capital', 'Dividend Recap']),
            status: 'closed',
            created_at: generateDate(daysAgo),
        });
    }

    // Insert in batches of 100
    const batchSize = 100;
    const insertedDeals = [];

    for (let i = 0; i < deals.length; i += batchSize) {
        const batch = deals.slice(i, i + batchSize);
        const { data, error } = await supabase
            .from('deals')
            .insert(batch)
            .select();

        if (error) {
            console.error('Error seeding deals batch:', error);
            throw error;
        }

        if (data) {
            insertedDeals.push(...data);
        }

        console.log(`Inserted deals ${i + 1} to ${Math.min(i + batchSize, deals.length)}`);
    }

    console.log(`Seeded ${insertedDeals.length} deals`);
    return insertedDeals;
}

async function seedParticipations(deals: any[], banks: any[]) {
    console.log('Seeding historical participations...');

    const participations: any[] = [];
    const bankMap = new Map(banks.map(b => [b.name, b]));

    for (const deal of deals) {
        // Each deal has 3-15 participating banks
        const numParticipants = randomInt(3, 15);

        // Filter banks that match deal criteria
        const eligibleBanks = banks.filter(bank => {
            const sectorMatch = bank.sectors.includes(deal.sector);
            const sizeMatch = deal.amount_usd >= bank.min_deal_size && deal.amount_usd <= bank.max_deal_size;
            const geoMatch = bank.geographic_focus.includes(deal.geography);
            return sectorMatch || sizeMatch || geoMatch;
        });

        // If not enough eligible banks, use all banks
        const bankPool = eligibleBanks.length >= numParticipants ? eligibleBanks : banks;

        // Shuffle and select banks
        const selectedBanks = [...bankPool]
            .sort(() => 0.5 - Math.random())
            .slice(0, numParticipants);

        // Distribute commitment amounts
        let remainingAmount = deal.amount_usd;

        selectedBanks.forEach((bank, idx) => {
            let role: string;
            let commitmentPct: number;

            if (idx === 0) {
                role = 'lead_arranger';
                commitmentPct = randomInt(15, 25) / 100;
            } else if (idx < 3) {
                role = 'co_arranger';
                commitmentPct = randomInt(10, 15) / 100;
            } else {
                role = 'participant';
                commitmentPct = randomInt(5, 10) / 100;
            }

            const commitment = Math.min(
                Math.floor(deal.amount_usd * commitmentPct),
                remainingAmount
            );
            remainingAmount -= commitment;

            participations.push({
                deal_id: deal.id,
                bank_id: bank.id,
                role,
                commitment_usd: commitment,
                participation_date: deal.created_at,
            });
        });
    }

    // Insert in batches
    const batchSize = 500;
    let totalInserted = 0;

    for (let i = 0; i < participations.length; i += batchSize) {
        const batch = participations.slice(i, i + batchSize);
        const { error } = await supabase
            .from('historical_participations')
            .insert(batch);

        if (error) {
            console.error('Error seeding participations batch:', error);
            throw error;
        }

        totalInserted += batch.length;
        console.log(`Inserted participations ${i + 1} to ${Math.min(i + batchSize, participations.length)}`);
    }

    console.log(`Seeded ${totalInserted} historical participations`);
}

// ============================================
// Main Execution
// ============================================

async function main() {
    console.log('Starting SYNDEX database seed...\n');

    try {
        // Clear existing data (optional - comment out to append)
        console.log('Clearing existing data...');
        await supabase.from('historical_participations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('deal_invitations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('deals').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('banks').delete().neq('id', '00000000-0000-0000-0000-000000000000');

        // Seed data
        const banks = await seedBanks();
        const deals = await seedDeals(500);
        await seedParticipations(deals, banks!);

        console.log('\n✅ Database seeding complete!');
        console.log(`   - ${banks?.length || 0} banks`);
        console.log(`   - ${deals.length} deals`);
        console.log(`   - Historical participations generated`);

    } catch (error) {
        console.error('\n❌ Seeding failed:', error);
        process.exit(1);
    }
}

main();
