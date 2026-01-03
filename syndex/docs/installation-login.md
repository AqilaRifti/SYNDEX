# SYNDEX Installation & Login Guide

This guide covers setting up SYNDEX for local development and configuring authentication.

---

## Prerequisites

- **Node.js** 18.x or higher
- **Bun** (recommended) or npm/yarn
- **Git**
- **Supabase** account (for database)
- **Clerk** account (for authentication)
- **Cerebras** API key (for AI matching)

---

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/syndex.git
cd syndex
```

### 2. Install Dependencies

```bash
# Using Bun (recommended)
bun install

# Or using npm
npm install

# Or using yarn
yarn install
```

### 3. Environment Setup

Copy the example environment file:

```bash
cp env.example.txt .env.local
```

### 4. Configure Environment Variables

Edit `.env.local` with your credentials:

```env
# ===========================================
# Authentication (Clerk)
# ===========================================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Redirect URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/auth/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/auth/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard/syndex"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard/syndex"

# ===========================================
# Database (Supabase)
# ===========================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...

# ===========================================
# AI Matching (Cerebras)
# ===========================================
CEREBRAS_API_KEY_1=csk-...
# Optional: Add more keys for load balancing
CEREBRAS_API_KEY_2=csk-...
CEREBRAS_API_KEY_3=csk-...

# ===========================================
# Error Tracking (Sentry) - Optional
# ===========================================
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
NEXT_PUBLIC_SENTRY_ORG=your-org
NEXT_PUBLIC_SENTRY_PROJECT=syndex
SENTRY_AUTH_TOKEN=sntrys_...
```

### 5. Start Development Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Detailed Setup

### Clerk Authentication Setup

#### Step 1: Create Clerk Application

1. Go to [clerk.com](https://clerk.com) and sign up
2. Create a new application
3. Choose authentication methods (Email, Google, etc.)
4. Copy your API keys

#### Step 2: Configure Clerk Dashboard

1. Navigate to **User & Authentication** → **Email, Phone, Username**
2. Enable desired sign-in methods
3. Navigate to **Organizations** (optional)
4. Enable organizations for multi-tenant support

#### Step 3: Configure Redirect URLs

In Clerk Dashboard → **Paths**:

| Setting | Value |
|---------|-------|
| Sign-in URL | `/auth/sign-in` |
| Sign-up URL | `/auth/sign-up` |
| After sign-in URL | `/dashboard/syndex` |
| After sign-up URL | `/dashboard/syndex` |

#### Keyless Mode (Development)

Clerk supports keyless mode for quick development:
- Leave `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` empty
- A Clerk popup will appear at the bottom of the screen
- Click to claim your application and get API keys

---

### Supabase Database Setup

#### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Wait for database provisioning

#### Step 2: Get API Keys

In Supabase Dashboard → **Settings** → **API**:

- **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`
- **anon public key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role key**: `SUPABASE_SERVICE_KEY` (keep secret!)

#### Step 3: Create Database Schema

Run the following SQL in Supabase SQL Editor:

```sql
-- Banks table
CREATE TABLE banks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    tier INTEGER NOT NULL CHECK (tier IN (1, 2, 3)),
    headquarters TEXT NOT NULL,
    sectors TEXT[] NOT NULL,
    min_deal_size BIGINT NOT NULL,
    max_deal_size BIGINT NOT NULL,
    geographic_focus TEXT[] NOT NULL,
    logo_url TEXT
);

-- Deals table
CREATE TABLE deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
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
    status TEXT DEFAULT 'draft',
    target_close_date DATE,
    created_by TEXT
);

-- Historical participations table
CREATE TABLE historical_participations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
    bank_id UUID REFERENCES banks(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    commitment_usd BIGINT NOT NULL,
    participation_date DATE NOT NULL
);

-- Deal invitations table
CREATE TABLE deal_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
    bank_id UUID REFERENCES banks(id) ON DELETE CASCADE,
    invited_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'pending',
    commitment_amount BIGINT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    ai_match_score INTEGER NOT NULL,
    ai_reasoning TEXT NOT NULL,
    UNIQUE(deal_id, bank_id)
);

-- Indexes for performance
CREATE INDEX idx_deals_sector ON deals(sector);
CREATE INDEX idx_deals_status ON deals(status);
CREATE INDEX idx_participations_deal ON historical_participations(deal_id);
CREATE INDEX idx_participations_bank ON historical_participations(bank_id);
CREATE INDEX idx_invitations_deal ON deal_invitations(deal_id);
CREATE INDEX idx_invitations_status ON deal_invitations(status);
```

#### Step 4: Seed Database

Run the seed script to populate sample data:

```bash
bun run seed
# or
npx tsx scripts/seed-database.ts
```

This creates:
- 50+ banks (Tier 1, 2, 3)
- 500 historical deals
- Historical participation records

---

### Cerebras AI Setup

#### Step 1: Get API Key

1. Go to [cerebras.ai](https://cerebras.ai) and sign up
2. Navigate to API settings
3. Generate an API key

#### Step 2: Configure Keys

Add to `.env.local`:

```env
CEREBRAS_API_KEY_1=csk-your-key-here
```

#### Optional: Load Balancing

For high-volume usage, add multiple API keys:

```env
CEREBRAS_API_KEY_1=csk-key-1
CEREBRAS_API_KEY_2=csk-key-2
CEREBRAS_API_KEY_3=csk-key-3
```

The system automatically rotates through keys in round-robin fashion.

---

## Login Flow

### User Registration

1. Navigate to `/auth/sign-up`
2. Enter email and password (or use social login)
3. Verify email if required
4. Redirected to `/dashboard/syndex`

### User Login

1. Navigate to `/auth/sign-in`
2. Enter credentials
3. Complete MFA if enabled
4. Redirected to dashboard

### Organization Setup (Optional)

1. Navigate to `/dashboard/workspaces`
2. Create new organization
3. Invite team members
4. Switch between organizations

---

## Troubleshooting

### Common Issues

#### "Missing Supabase environment variables"

Ensure all three Supabase variables are set:
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_KEY=...
```

#### "Clerk authentication not working"

1. Check API keys are correct
2. Verify redirect URLs match your domain
3. Ensure Clerk application is in development mode

#### "AI matching returns fallback results"

1. Verify Cerebras API key is valid
2. Check API rate limits
3. Review console for error messages

#### "Database tables not found"

Run the SQL schema creation script in Supabase SQL Editor.

### Getting Help

- Check [GitHub Issues](https://github.com/your-org/syndex/issues)
- Review [Clerk Documentation](https://clerk.com/docs)
- Review [Supabase Documentation](https://supabase.com/docs)

---

## Production Deployment

### Vercel (Recommended)

1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

### Environment Variables for Production

Ensure all environment variables are set in your hosting platform:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_KEY
CEREBRAS_API_KEY_1
```

### Security Checklist

- [ ] Use production Clerk keys (not test keys)
- [ ] Enable Supabase Row Level Security (RLS)
- [ ] Configure CORS for your domain
- [ ] Enable Sentry for error tracking
- [ ] Set up webhook secrets
