-- ============================================
-- SYNDEX Database Schema
-- Supabase PostgreSQL
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Deals Table
-- Stores loan syndication deals
-- ============================================
CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  borrower_name TEXT NOT NULL,
  sector TEXT NOT NULL,
  sub_sector TEXT,
  amount_usd BIGINT NOT NULL,
  currency TEXT DEFAULT 'USD',
  deal_type TEXT NOT NULL,
  tenor_years INTEGER NOT NULL,
  pricing TEXT NOT NULL,
  rating_sp TEXT,
  rating_moodys TEXT,
  geography TEXT NOT NULL,
  use_of_proceeds TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'closed')),
  target_close_date DATE,
  created_by TEXT
);

-- ============================================
-- Banks Table
-- Stores financial institution profiles
-- ============================================
CREATE TABLE IF NOT EXISTS banks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  tier INTEGER CHECK (tier IN (1, 2, 3)),
  headquarters TEXT,
  sectors JSONB DEFAULT '[]'::jsonb,
  min_deal_size BIGINT DEFAULT 0,
  max_deal_size BIGINT DEFAULT 10000000000,
  geographic_focus JSONB DEFAULT '[]'::jsonb,
  logo_url TEXT
);

-- ============================================
-- Historical Participations Table
-- Stores past deal participation records for AI training
-- ============================================
CREATE TABLE IF NOT EXISTS historical_participations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
  bank_id UUID REFERENCES banks(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('lead_arranger', 'co_arranger', 'participant')),
  commitment_usd BIGINT NOT NULL,
  participation_date DATE DEFAULT CURRENT_DATE
);

-- ============================================
-- Deal Invitations Table
-- Tracks bank invitations and responses for active deals
-- ============================================
CREATE TABLE IF NOT EXISTS deal_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
  bank_id UUID REFERENCES banks(id) ON DELETE CASCADE,
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'interested', 'committed', 'declined')),
  commitment_amount BIGINT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ai_match_score NUMERIC(5,2),
  ai_reasoning TEXT,
  UNIQUE(deal_id, bank_id)
);

-- ============================================
-- Indexes for Performance
-- ============================================

-- Deals indexes
CREATE INDEX IF NOT EXISTS idx_deals_sector ON deals(sector);
CREATE INDEX IF NOT EXISTS idx_deals_status ON deals(status);
CREATE INDEX IF NOT EXISTS idx_deals_geography ON deals(geography);
CREATE INDEX IF NOT EXISTS idx_deals_created_at ON deals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_deals_amount ON deals(amount_usd);

-- Banks indexes
CREATE INDEX IF NOT EXISTS idx_banks_tier ON banks(tier);
CREATE INDEX IF NOT EXISTS idx_banks_name ON banks(name);

-- Historical participations indexes
CREATE INDEX IF NOT EXISTS idx_participations_bank ON historical_participations(bank_id);
CREATE INDEX IF NOT EXISTS idx_participations_deal ON historical_participations(deal_id);
CREATE INDEX IF NOT EXISTS idx_participations_role ON historical_participations(role);

-- Deal invitations indexes
CREATE INDEX IF NOT EXISTS idx_invitations_deal ON deal_invitations(deal_id);
CREATE INDEX IF NOT EXISTS idx_invitations_bank ON deal_invitations(bank_id);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON deal_invitations(status);
CREATE INDEX IF NOT EXISTS idx_invitations_score ON deal_invitations(ai_match_score DESC);

-- ============================================
-- Triggers for updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_deal_invitations_updated_at
  BEFORE UPDATE ON deal_invitations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Row Level Security (RLS) Policies
-- Enable for production use
-- ============================================

-- For demo purposes, we'll allow all operations
-- In production, you'd want proper RLS policies

ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE historical_participations ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_invitations ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users (demo mode)
CREATE POLICY "Allow all for deals" ON deals FOR ALL USING (true);
CREATE POLICY "Allow all for banks" ON banks FOR ALL USING (true);
CREATE POLICY "Allow all for historical_participations" ON historical_participations FOR ALL USING (true);
CREATE POLICY "Allow all for deal_invitations" ON deal_invitations FOR ALL USING (true);

-- ============================================
-- Views for Common Queries
-- ============================================

-- Deal summary with invitation stats
CREATE OR REPLACE VIEW deal_summary AS
SELECT 
  d.*,
  COUNT(di.id) as invitation_count,
  COUNT(CASE WHEN di.status = 'committed' THEN 1 END) as committed_count,
  COUNT(CASE WHEN di.status = 'interested' THEN 1 END) as interested_count,
  COALESCE(SUM(CASE WHEN di.status = 'committed' THEN di.commitment_amount ELSE 0 END), 0) as committed_amount
FROM deals d
LEFT JOIN deal_invitations di ON d.id = di.deal_id
GROUP BY d.id;

-- Bank participation history summary
CREATE OR REPLACE VIEW bank_participation_summary AS
SELECT 
  b.*,
  COUNT(hp.id) as total_participations,
  COUNT(CASE WHEN hp.role = 'lead_arranger' THEN 1 END) as lead_count,
  COALESCE(SUM(hp.commitment_usd), 0) as total_committed
FROM banks b
LEFT JOIN historical_participations hp ON b.id = hp.bank_id
GROUP BY b.id;
