"use strict";
/**
 * SYNDEX Database Seed Script
 * Generates realistic synthetic data for AI matching demonstration
 *
 * Run with: npx tsx scripts/seed-database.ts
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var supabase_js_1 = require("@supabase/supabase-js");
// Load environment variables
var supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
var supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
var supabase = (0, supabase_js_1.createClient)("https://cozhneczrqtxlugkubte.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvemhuZWN6cnF0eGx1Z2t1YnRlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDE1NDk2OCwiZXhwIjoyMDc1NzMwOTY4fQ.CWdJyBVN7V7xBJQGAEnAa2eakbncabrn6SmuXIg5hNs");
// ============================================
// Bank Data - 50+ Major Global Banks
// ============================================
var BANKS = [
    // Tier 1 - Bulge Bracket (15 banks)
    { name: 'JPMorgan Chase', tier: 1, hq: 'United States', sectors: ['Technology', 'Healthcare', 'Industrials', 'Consumer'], geo: ['United States', 'Europe', 'Asia'], minDeal: 500000000, maxDeal: 10000000000 },
    { name: 'Bank of America', tier: 1, hq: 'United States', sectors: ['Energy', 'Technology', 'Consumer', 'Real Estate'], geo: ['United States', 'Europe'], minDeal: 500000000, maxDeal: 8000000000 },
    { name: 'Citigroup', tier: 1, hq: 'United States', sectors: ['Technology', 'Financial Services', 'Telecom', 'Infrastructure'], geo: ['United States', 'Europe', 'Asia', 'Latin America'], minDeal: 400000000, maxDeal: 10000000000 },
    { name: 'Goldman Sachs', tier: 1, hq: 'United States', sectors: ['Technology', 'Media', 'Healthcare', 'Financial Services'], geo: ['United States', 'Europe', 'Asia'], minDeal: 500000000, maxDeal: 8000000000 },
    { name: 'Morgan Stanley', tier: 1, hq: 'United States', sectors: ['Technology', 'Healthcare', 'Industrials', 'Media'], geo: ['United States', 'Europe', 'Asia'], minDeal: 400000000, maxDeal: 7000000000 },
    { name: 'Wells Fargo', tier: 1, hq: 'United States', sectors: ['Real Estate', 'Consumer', 'Industrials', 'Energy'], geo: ['United States'], minDeal: 300000000, maxDeal: 5000000000 },
    { name: 'Barclays', tier: 1, hq: 'United Kingdom', sectors: ['Energy', 'Industrials', 'Financial Services', 'Infrastructure'], geo: ['Europe', 'United Kingdom', 'United States'], minDeal: 400000000, maxDeal: 6000000000 },
    { name: 'HSBC', tier: 1, hq: 'United Kingdom', sectors: ['Energy', 'Infrastructure', 'Industrials', 'Real Estate'], geo: ['Europe', 'Asia', 'United Kingdom', 'Middle East'], minDeal: 500000000, maxDeal: 8000000000 },
    { name: 'Deutsche Bank', tier: 1, hq: 'Germany', sectors: ['Industrials', 'Energy', 'Technology', 'Financial Services'], geo: ['Europe', 'United States', 'Asia'], minDeal: 400000000, maxDeal: 6000000000 },
    { name: 'BNP Paribas', tier: 1, hq: 'France', sectors: ['Energy', 'Infrastructure', 'Telecom', 'Industrials'], geo: ['Europe', 'United States', 'Asia'], minDeal: 400000000, maxDeal: 7000000000 },
    { name: 'Credit Agricole', tier: 1, hq: 'France', sectors: ['Infrastructure', 'Energy', 'Real Estate', 'Consumer'], geo: ['Europe', 'Asia'], minDeal: 300000000, maxDeal: 5000000000 },
    { name: 'UBS', tier: 1, hq: 'Switzerland', sectors: ['Healthcare', 'Technology', 'Financial Services', 'Consumer'], geo: ['Europe', 'United States', 'Asia'], minDeal: 400000000, maxDeal: 6000000000 },
    { name: 'Mizuho', tier: 1, hq: 'Japan', sectors: ['Industrials', 'Technology', 'Energy', 'Infrastructure'], geo: ['Asia', 'United States', 'Europe'], minDeal: 400000000, maxDeal: 6000000000 },
    { name: 'SMBC', tier: 1, hq: 'Japan', sectors: ['Industrials', 'Technology', 'Infrastructure', 'Energy'], geo: ['Asia', 'United States', 'Europe'], minDeal: 400000000, maxDeal: 6000000000 },
    { name: 'Bank of China', tier: 1, hq: 'China', sectors: ['Energy', 'Infrastructure', 'Industrials', 'Real Estate'], geo: ['Asia', 'Europe', 'United States'], minDeal: 500000000, maxDeal: 8000000000 },
    // Tier 2 - Mid-Tier Banks (20 banks)
    { name: 'RBC Capital Markets', tier: 2, hq: 'Canada', sectors: ['Energy', 'Mining', 'Technology', 'Financial Services'], geo: ['United States', 'Europe'], minDeal: 200000000, maxDeal: 3000000000 },
    { name: 'TD Securities', tier: 2, hq: 'Canada', sectors: ['Energy', 'Consumer', 'Real Estate', 'Healthcare'], geo: ['United States', 'Europe'], minDeal: 200000000, maxDeal: 3000000000 },
    { name: 'Scotiabank', tier: 2, hq: 'Canada', sectors: ['Energy', 'Mining', 'Infrastructure', 'Consumer'], geo: ['United States', 'Latin America'], minDeal: 150000000, maxDeal: 2500000000 },
    { name: 'ING Bank', tier: 2, hq: 'Netherlands', sectors: ['Energy', 'Infrastructure', 'Real Estate', 'Telecom'], geo: ['Europe', 'Asia'], minDeal: 200000000, maxDeal: 3000000000 },
    { name: 'Societe Generale', tier: 2, hq: 'France', sectors: ['Energy', 'Infrastructure', 'Industrials', 'Financial Services'], geo: ['Europe', 'United States'], minDeal: 250000000, maxDeal: 4000000000 },
    { name: 'Natixis', tier: 2, hq: 'France', sectors: ['Infrastructure', 'Energy', 'Real Estate', 'Aviation'], geo: ['Europe', 'United States', 'Asia'], minDeal: 200000000, maxDeal: 3000000000 },
    { name: 'Commerzbank', tier: 2, hq: 'Germany', sectors: ['Industrials', 'Energy', 'Technology', 'Consumer'], geo: ['Europe'], minDeal: 150000000, maxDeal: 2500000000 },
    { name: 'UniCredit', tier: 2, hq: 'Italy', sectors: ['Infrastructure', 'Energy', 'Real Estate', 'Industrials'], geo: ['Europe'], minDeal: 200000000, maxDeal: 3000000000 },
    { name: 'Intesa Sanpaolo', tier: 2, hq: 'Italy', sectors: ['Infrastructure', 'Energy', 'Consumer', 'Real Estate'], geo: ['Europe'], minDeal: 150000000, maxDeal: 2500000000 },
    { name: 'Santander', tier: 2, hq: 'Spain', sectors: ['Energy', 'Infrastructure', 'Consumer', 'Real Estate'], geo: ['Europe', 'Latin America', 'United States'], minDeal: 200000000, maxDeal: 3500000000 },
    { name: 'BBVA', tier: 2, hq: 'Spain', sectors: ['Energy', 'Infrastructure', 'Consumer', 'Telecom'], geo: ['Europe', 'Latin America', 'United States'], minDeal: 150000000, maxDeal: 2500000000 },
    { name: 'Standard Chartered', tier: 2, hq: 'United Kingdom', sectors: ['Energy', 'Infrastructure', 'Financial Services', 'Consumer'], geo: ['Asia', 'Middle East', 'Europe'], minDeal: 200000000, maxDeal: 3000000000 },
    { name: 'ANZ', tier: 2, hq: 'Australia', sectors: ['Energy', 'Mining', 'Infrastructure', 'Real Estate'], geo: ['Asia', 'Europe'], minDeal: 150000000, maxDeal: 2500000000 },
    { name: 'Westpac', tier: 2, hq: 'Australia', sectors: ['Energy', 'Mining', 'Infrastructure', 'Consumer'], geo: ['Asia'], minDeal: 150000000, maxDeal: 2000000000 },
    { name: 'National Australia Bank', tier: 2, hq: 'Australia', sectors: ['Energy', 'Mining', 'Real Estate', 'Infrastructure'], geo: ['Asia', 'Europe'], minDeal: 150000000, maxDeal: 2500000000 },
    { name: 'DBS Bank', tier: 2, hq: 'Singapore', sectors: ['Technology', 'Real Estate', 'Infrastructure', 'Consumer'], geo: ['Asia'], minDeal: 150000000, maxDeal: 2500000000 },
    { name: 'OCBC', tier: 2, hq: 'Singapore', sectors: ['Real Estate', 'Infrastructure', 'Consumer', 'Financial Services'], geo: ['Asia'], minDeal: 100000000, maxDeal: 2000000000 },
    { name: 'UOB', tier: 2, hq: 'Singapore', sectors: ['Real Estate', 'Consumer', 'Infrastructure', 'Technology'], geo: ['Asia'], minDeal: 100000000, maxDeal: 2000000000 },
    { name: 'Korea Development Bank', tier: 2, hq: 'South Korea', sectors: ['Industrials', 'Technology', 'Infrastructure', 'Energy'], geo: ['Asia'], minDeal: 200000000, maxDeal: 3000000000 },
    { name: 'Industrial Bank of Korea', tier: 2, hq: 'South Korea', sectors: ['Industrials', 'Technology', 'Consumer', 'Energy'], geo: ['Asia'], minDeal: 150000000, maxDeal: 2500000000 },
    // Tier 3 - Regional Banks (15 banks)
    { name: 'PNC Financial', tier: 3, hq: 'United States', sectors: ['Healthcare', 'Consumer', 'Real Estate', 'Technology'], geo: ['United States'], minDeal: 100000000, maxDeal: 1500000000 },
    { name: 'US Bancorp', tier: 3, hq: 'United States', sectors: ['Consumer', 'Real Estate', 'Healthcare', 'Industrials'], geo: ['United States'], minDeal: 100000000, maxDeal: 1500000000 },
    { name: 'Truist', tier: 3, hq: 'United States', sectors: ['Healthcare', 'Consumer', 'Real Estate', 'Technology'], geo: ['United States'], minDeal: 100000000, maxDeal: 1500000000 },
    { name: 'Fifth Third Bank', tier: 3, hq: 'United States', sectors: ['Consumer', 'Healthcare', 'Industrials', 'Real Estate'], geo: ['United States'], minDeal: 75000000, maxDeal: 1000000000 },
    { name: 'KeyBank', tier: 3, hq: 'United States', sectors: ['Healthcare', 'Consumer', 'Industrials', 'Real Estate'], geo: ['United States'], minDeal: 75000000, maxDeal: 1000000000 },
    { name: 'Regions Bank', tier: 3, hq: 'United States', sectors: ['Energy', 'Consumer', 'Real Estate', 'Healthcare'], geo: ['United States'], minDeal: 75000000, maxDeal: 1000000000 },
    { name: 'M&T Bank', tier: 3, hq: 'United States', sectors: ['Real Estate', 'Consumer', 'Healthcare', 'Industrials'], geo: ['United States'], minDeal: 75000000, maxDeal: 1000000000 },
    { name: 'Citizens Bank', tier: 3, hq: 'United States', sectors: ['Healthcare', 'Consumer', 'Technology', 'Real Estate'], geo: ['United States'], minDeal: 100000000, maxDeal: 1200000000 },
    { name: 'Huntington Bank', tier: 3, hq: 'United States', sectors: ['Consumer', 'Healthcare', 'Industrials', 'Real Estate'], geo: ['United States'], minDeal: 50000000, maxDeal: 800000000 },
    { name: 'Lloyds Banking Group', tier: 3, hq: 'United Kingdom', sectors: ['Real Estate', 'Consumer', 'Infrastructure', 'Healthcare'], geo: ['United Kingdom', 'Europe'], minDeal: 100000000, maxDeal: 1500000000 },
    { name: 'NatWest', tier: 3, hq: 'United Kingdom', sectors: ['Real Estate', 'Consumer', 'Infrastructure', 'Energy'], geo: ['United Kingdom', 'Europe'], minDeal: 100000000, maxDeal: 1500000000 },
    { name: 'Rabobank', tier: 3, hq: 'Netherlands', sectors: ['Consumer', 'Real Estate', 'Infrastructure', 'Energy'], geo: ['Europe'], minDeal: 100000000, maxDeal: 1500000000 },
    { name: 'Nordea', tier: 3, hq: 'Finland', sectors: ['Energy', 'Infrastructure', 'Real Estate', 'Consumer'], geo: ['Europe'], minDeal: 100000000, maxDeal: 1500000000 },
    { name: 'SEB', tier: 3, hq: 'Sweden', sectors: ['Energy', 'Infrastructure', 'Real Estate', 'Industrials'], geo: ['Europe'], minDeal: 100000000, maxDeal: 1500000000 },
    { name: 'Danske Bank', tier: 3, hq: 'Denmark', sectors: ['Energy', 'Infrastructure', 'Real Estate', 'Consumer'], geo: ['Europe'], minDeal: 100000000, maxDeal: 1200000000 },
];
var SECTORS = ['Technology', 'Healthcare', 'Energy', 'Industrials', 'Consumer', 'Financial Services', 'Real Estate', 'Telecom', 'Infrastructure', 'Media'];
var DEAL_TYPES = ['Senior Secured Credit Facility', 'Term Loan A', 'Term Loan B', 'Revolving Credit Facility', 'Bridge Loan', 'Acquisition Financing'];
var GEOGRAPHIES = ['United States', 'Europe', 'Asia', 'United Kingdom', 'Latin America'];
var RATINGS = ['AAA', 'AA+', 'AA', 'AA-', 'A+', 'A', 'A-', 'BBB+', 'BBB', 'BBB-', 'BB+', 'BB', 'BB-', 'B+', 'B'];
// Company name generators
var TECH_COMPANIES = ['TechVenture', 'CloudScale', 'DataSync', 'CyberShield', 'AILogic', 'QuantumByte', 'NexGen', 'DigiCore', 'SmartFlow', 'CodeWave'];
var HEALTHCARE_COMPANIES = ['MedLife', 'BioGenix', 'HealthFirst', 'PharmaCore', 'CarePoint', 'VitalMed', 'GenomeTech', 'MedDevice', 'HealthSync', 'BioVita'];
var ENERGY_COMPANIES = ['PowerGrid', 'SolarMax', 'WindForce', 'EnergyOne', 'GreenPower', 'FuelTech', 'OilField', 'GasStream', 'RenewCo', 'EcoEnergy'];
var INDUSTRIAL_COMPANIES = ['SteelWorks', 'MetalCraft', 'BuildPro', 'MachineCore', 'FactoryOne', 'IndustrialTech', 'ManufactPro', 'HeavyDuty', 'PrecisionMfg', 'AutoParts'];
var CONSUMER_COMPANIES = ['RetailMax', 'BrandCo', 'ShopSmart', 'ConsumerFirst', 'MarketPlace', 'TrendStyle', 'FoodChain', 'BeverageCo', 'ApparelGroup', 'HomeGoods'];
var COMPANY_NAMES = {
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
function randomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function generateDealAmount() {
    // Realistic distribution: more deals in $100M-$500M range
    var ranges = [
        { min: 100, max: 300, weight: 30 },
        { min: 300, max: 500, weight: 25 },
        { min: 500, max: 800, weight: 20 },
        { min: 800, max: 1200, weight: 15 },
        { min: 1200, max: 2100, weight: 10 },
    ];
    var totalWeight = ranges.reduce(function (sum, r) { return sum + r.weight; }, 0);
    var random = Math.random() * totalWeight;
    for (var _i = 0, ranges_1 = ranges; _i < ranges_1.length; _i++) {
        var range = ranges_1[_i];
        random -= range.weight;
        if (random <= 0) {
            return randomInt(range.min, range.max) * 1000000;
        }
    }
    return 500000000;
}
function generateBorrowerName(sector, index) {
    var companies = COMPANY_NAMES[sector] || COMPANY_NAMES['Technology'];
    var company = randomElement(companies);
    var suffixes = ['Inc.', 'Corp.', 'Holdings', 'Group', 'LLC', 'Partners'];
    return "".concat(company, " ").concat(randomElement(suffixes));
}
function generatePricing() {
    var spread = randomInt(150, 400);
    return "SOFR + ".concat(spread, " bps");
}
function generateDate(daysAgo) {
    var date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
}
// ============================================
// Seed Functions
// ============================================
function seedBanks() {
    return __awaiter(this, void 0, void 0, function () {
        var bankData, _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('Seeding banks...');
                    bankData = BANKS.map(function (bank) { return ({
                        name: bank.name,
                        tier: bank.tier,
                        headquarters: bank.hq,
                        sectors: bank.sectors,
                        min_deal_size: bank.minDeal,
                        max_deal_size: bank.maxDeal,
                        geographic_focus: bank.geo,
                    }); });
                    return [4 /*yield*/, supabase
                            .from('banks')
                            .upsert(bankData, { onConflict: 'name' })
                            .select()];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        console.error('Error seeding banks:', error);
                        throw error;
                    }
                    console.log("Seeded ".concat((data === null || data === void 0 ? void 0 : data.length) || 0, " banks"));
                    return [2 /*return*/, data];
            }
        });
    });
}
function seedDeals() {
    return __awaiter(this, arguments, void 0, function (count) {
        var deals, i, sector, amount, tenor, daysAgo, batchSize, insertedDeals, i, batch, _a, data, error;
        if (count === void 0) { count = 500; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("Seeding ".concat(count, " deals..."));
                    deals = [];
                    for (i = 0; i < count; i++) {
                        sector = randomElement(SECTORS);
                        amount = generateDealAmount();
                        tenor = randomElement([3, 5, 7, 10]);
                        daysAgo = randomInt(1, 730);
                        deals.push({
                            borrower_name: generateBorrowerName(sector, i),
                            sector: sector,
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
                    batchSize = 100;
                    insertedDeals = [];
                    i = 0;
                    _b.label = 1;
                case 1:
                    if (!(i < deals.length)) return [3 /*break*/, 4];
                    batch = deals.slice(i, i + batchSize);
                    return [4 /*yield*/, supabase
                            .from('deals')
                            .insert(batch)
                            .select()];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        console.error('Error seeding deals batch:', error);
                        throw error;
                    }
                    if (data) {
                        insertedDeals.push.apply(insertedDeals, data);
                    }
                    console.log("Inserted deals ".concat(i + 1, " to ").concat(Math.min(i + batchSize, deals.length)));
                    _b.label = 3;
                case 3:
                    i += batchSize;
                    return [3 /*break*/, 1];
                case 4:
                    console.log("Seeded ".concat(insertedDeals.length, " deals"));
                    return [2 /*return*/, insertedDeals];
            }
        });
    });
}
function seedParticipations(deals, banks) {
    return __awaiter(this, void 0, void 0, function () {
        var participations, bankMap, _loop_1, _i, deals_1, deal, batchSize, totalInserted, i, batch, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Seeding historical participations...');
                    participations = [];
                    bankMap = new Map(banks.map(function (b) { return [b.name, b]; }));
                    _loop_1 = function (deal) {
                        // Each deal has 3-15 participating banks
                        var numParticipants = randomInt(3, 15);
                        // Filter banks that match deal criteria
                        var eligibleBanks = banks.filter(function (bank) {
                            var sectorMatch = bank.sectors.includes(deal.sector);
                            var sizeMatch = deal.amount_usd >= bank.min_deal_size && deal.amount_usd <= bank.max_deal_size;
                            var geoMatch = bank.geographic_focus.includes(deal.geography);
                            return sectorMatch || sizeMatch || geoMatch;
                        });
                        // If not enough eligible banks, use all banks
                        var bankPool = eligibleBanks.length >= numParticipants ? eligibleBanks : banks;
                        // Shuffle and select banks
                        var selectedBanks = __spreadArray([], bankPool, true).sort(function () { return 0.5 - Math.random(); })
                            .slice(0, numParticipants);
                        // Distribute commitment amounts
                        var remainingAmount = deal.amount_usd;
                        selectedBanks.forEach(function (bank, idx) {
                            var role;
                            var commitmentPct;
                            if (idx === 0) {
                                role = 'lead_arranger';
                                commitmentPct = randomInt(15, 25) / 100;
                            }
                            else if (idx < 3) {
                                role = 'co_arranger';
                                commitmentPct = randomInt(10, 15) / 100;
                            }
                            else {
                                role = 'participant';
                                commitmentPct = randomInt(5, 10) / 100;
                            }
                            var commitment = Math.min(Math.floor(deal.amount_usd * commitmentPct), remainingAmount);
                            remainingAmount -= commitment;
                            participations.push({
                                deal_id: deal.id,
                                bank_id: bank.id,
                                role: role,
                                commitment_usd: commitment,
                                participation_date: deal.created_at,
                            });
                        });
                    };
                    for (_i = 0, deals_1 = deals; _i < deals_1.length; _i++) {
                        deal = deals_1[_i];
                        _loop_1(deal);
                    }
                    batchSize = 500;
                    totalInserted = 0;
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < participations.length)) return [3 /*break*/, 4];
                    batch = participations.slice(i, i + batchSize);
                    return [4 /*yield*/, supabase
                            .from('historical_participations')
                            .insert(batch)];
                case 2:
                    error = (_a.sent()).error;
                    if (error) {
                        console.error('Error seeding participations batch:', error);
                        throw error;
                    }
                    totalInserted += batch.length;
                    console.log("Inserted participations ".concat(i + 1, " to ").concat(Math.min(i + batchSize, participations.length)));
                    _a.label = 3;
                case 3:
                    i += batchSize;
                    return [3 /*break*/, 1];
                case 4:
                    console.log("Seeded ".concat(totalInserted, " historical participations"));
                    return [2 /*return*/];
            }
        });
    });
}
// ============================================
// Main Execution
// ============================================
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var banks, deals, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Starting SYNDEX database seed...\n');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 9, , 10]);
                    // Clear existing data (optional - comment out to append)
                    console.log('Clearing existing data...');
                    return [4 /*yield*/, supabase.from('historical_participations').delete().neq('id', '00000000-0000-0000-0000-000000000000')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, supabase.from('deal_invitations').delete().neq('id', '00000000-0000-0000-0000-000000000000')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, supabase.from('deals').delete().neq('id', '00000000-0000-0000-0000-000000000000')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, supabase.from('banks').delete().neq('id', '00000000-0000-0000-0000-000000000000')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, seedBanks()];
                case 6:
                    banks = _a.sent();
                    return [4 /*yield*/, seedDeals(500)];
                case 7:
                    deals = _a.sent();
                    return [4 /*yield*/, seedParticipations(deals, banks)];
                case 8:
                    _a.sent();
                    console.log('\n✅ Database seeding complete!');
                    console.log("   - ".concat((banks === null || banks === void 0 ? void 0 : banks.length) || 0, " banks"));
                    console.log("   - ".concat(deals.length, " deals"));
                    console.log("   - Historical participations generated");
                    return [3 /*break*/, 10];
                case 9:
                    error_1 = _a.sent();
                    console.error('\n❌ Seeding failed:', error_1);
                    process.exit(1);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
main();
