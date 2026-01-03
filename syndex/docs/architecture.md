# SYNDEX Architecture

This document describes the technical architecture of SYNDEX, an AI-powered syndicated loan matching platform.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                           SYNDEX Platform                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐          │
│  │   Next.js    │    │    Clerk     │    │   Supabase   │          │
│  │   Frontend   │◄──►│     Auth     │    │   Database   │          │
│  │   (React)    │    │              │    │  (PostgreSQL)│          │
│  └──────┬───────┘    └──────────────┘    └──────┬───────┘          │
│         │                                        │                   │
│         │         ┌──────────────┐               │                   │
│         └────────►│   Next.js    │◄──────────────┘                   │
│                   │  API Routes  │                                   │
│                   │  (Server)    │                                   │
│                   └──────┬───────┘                                   │
│                          │                                           │
│                   ┌──────▼───────┐                                   │
│                   │   Cerebras   │                                   │
│                   │   Qwen AI    │                                   │
│                   │  (Matching)  │                                   │
│                   └──────────────┘                                   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Next.js 16, React 19 | UI framework |
| Styling | Tailwind CSS v4, Shadcn UI | Component library |
| State | Zustand, Nuqs | Client state management |
| Auth | Clerk | Authentication & organizations |
| Database | Supabase (PostgreSQL) | Data persistence |
| AI | Cerebras Qwen | Lender matching |
| Validation | Zod | Schema validation |
| Forms | React Hook Form | Form handling |
| Tables | TanStack Table | Data tables |
| Error Tracking | Sentry | Monitoring |

---

## Directory Structure

```
syndex/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (marketing)/        # Public marketing pages
│   │   ├── api/                # API routes
│   │   ├── auth/               # Authentication pages
│   │   ├── dashboard/          # Protected dashboard
│   │   │   ├── profile/        # User profile
│   │   │   └── syndex/         # Core application
│   │   │       ├── banks/      # Bank network
│   │   │       └── deals/      # Deal management
│   │   └── home/               # Landing page
│   │
│   ├── components/
│   │   ├── forms/              # Form components
│   │   ├── kbar/               # Command palette
│   │   ├── layout/             # Layout components
│   │   ├── modal/              # Modal dialogs
│   │   ├── syndex/             # SYNDEX-specific components
│   │   └── ui/                 # Shadcn UI components
│   │
│   ├── config/                 # Configuration
│   │   ├── data-table.ts       # Table config
│   │   └── nav-config.ts       # Navigation config
│   │
│   ├── features/               # Feature modules
│   │   ├── auth/               # Auth features
│   │   └── profile/            # Profile features
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── use-data-table.ts
│   │   ├── use-debounce.tsx
│   │   └── use-mobile.tsx
│   │
│   ├── lib/                    # Core utilities
│   │   ├── ai-matcher.ts       # AI matching service
│   │   ├── supabase.ts         # Database client
│   │   └── utils.ts            # Shared utilities
│   │
│   └── types/                  # TypeScript types
│       ├── database.ts         # Database schemas
│       └── index.ts            # Shared types
│
├── scripts/
│   └── seed-database.ts        # Database seeding
│
├── supabase/                   # Supabase config
│
└── docs/                       # Documentation
```

---

## Core Components

### 1. Authentication Layer (Clerk)

```typescript
// Middleware protection
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};
```

**Features:**
- Email/password authentication
- Social login (Google, GitHub)
- Multi-factor authentication
- Organization management
- Role-based access control

### 2. Database Layer (Supabase)

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

**Tables:**
- `banks` - Bank network (50+ institutions)
- `deals` - Loan deals
- `historical_participations` - Past deal participation
- `deal_invitations` - Current deal invitations

### 3. AI Matching Service (Cerebras)

```typescript
// src/lib/ai-matcher.ts
export async function matchLendersForDeal(
  deal: Deal,
  historicalData: HistoricalParticipation[],
  allBanks: Bank[]
): Promise<MatchLendersResult> {
  // 1. Build context from historical data
  // 2. Send to Cerebras Qwen model
  // 3. Parse and validate response
  // 4. Return ranked bank matches
}
```

**Matching Factors:**
- Sector expertise
- Geographic focus
- Deal size fit
- Historical participation patterns
- Bank tier alignment
- Co-lending relationships

---

## Data Models

### Deal

```typescript
interface Deal {
  id: string;
  created_at: string;
  borrower_name: string;
  sector: Sector;
  sub_sector?: string;
  amount_usd: number;
  currency: Currency;
  deal_type: DealType;
  tenor_years: number;
  pricing: string;
  rating_sp?: Rating;
  rating_moodys?: Rating;
  geography: Geography;
  use_of_proceeds?: string;
  status: DealStatus;
  target_close_date?: string;
  created_by?: string;
}
```

### Bank

```typescript
interface Bank {
  id: string;
  name: string;
  tier: BankTier;           // 1, 2, or 3
  headquarters: string;
  sectors: Sector[];
  min_deal_size: number;
  max_deal_size: number;
  geographic_focus: Geography[];
  logo_url?: string;
}
```

### Bank Match (AI Output)

```typescript
interface BankMatch {
  bank_name: string;
  bank_id?: string;
  match_score: number;      // 0-100
  reasoning: string;        // AI explanation
  historical_participation_rate: string;
  estimated_commitment: number;
  confidence: 'high' | 'medium' | 'low';
}
```

---

## API Routes

### Deal Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/deals` | List all deals |
| POST | `/api/deals` | Create new deal |
| GET | `/api/deals/[id]` | Get deal details |
| PUT | `/api/deals/[id]` | Update deal |
| DELETE | `/api/deals/[id]` | Delete deal |

### AI Matching

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/deals/[id]/match` | Run AI matching |
| GET | `/api/deals/[id]/matches` | Get match results |

### Bank Network

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/banks` | List all banks |
| GET | `/api/banks/[id]` | Get bank details |

### Invitations

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/deals/[id]/invite` | Send invitations |
| PUT | `/api/invitations/[id]` | Update invitation status |

---

## AI Matching Pipeline

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Deal      │     │  Historical │     │    Bank     │
│   Input     │     │    Data     │     │   Network   │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                    ┌──────▼──────┐
                    │   Context   │
                    │   Builder   │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Cerebras   │
                    │  Qwen API   │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Response   │
                    │   Parser    │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Validator  │
                    │  & Ranker   │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   Ranked    │
                    │   Matches   │
                    └─────────────┘
```

### Matching Algorithm

1. **Context Building**
   - Summarize historical participation patterns
   - Filter relevant banks by sector/geography
   - Calculate participation statistics

2. **AI Analysis**
   - Send structured prompt to Cerebras Qwen
   - Include deal details, historical patterns, bank profiles
   - Request ranked matches with reasoning

3. **Response Processing**
   - Parse JSON response
   - Validate bank names against database
   - Normalize scores (0-100)
   - Add confidence levels

4. **Fallback Handling**
   - If AI fails, use heuristic matching
   - Score based on sector, geography, deal size fit
   - Return with error flag for transparency

---

## State Management

### Client State (Zustand)

```typescript
// Dashboard state
interface DashboardStore {
  selectedDeal: Deal | null;
  filters: FilterState;
  setSelectedDeal: (deal: Deal) => void;
  setFilters: (filters: FilterState) => void;
}
```

### URL State (Nuqs)

```typescript
// Search params state
const [search, setSearch] = useQueryState('search');
const [sector, setSector] = useQueryState('sector');
const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
```

---

## Security

### Authentication
- Clerk handles all auth flows
- JWT tokens for API authentication
- Session management with secure cookies

### Authorization
- Route-level protection via middleware
- Organization-based access control
- Role-based permissions (admin, member, viewer)

### Data Security
- Supabase Row Level Security (RLS)
- API keys stored in environment variables
- HTTPS enforced in production

### API Security
- Rate limiting on AI endpoints
- API key rotation for Cerebras
- Input validation with Zod schemas

---

## Performance

### Optimizations
- React Server Components for initial load
- Streaming for AI responses
- Database indexes on frequently queried columns
- Connection pooling for Supabase

### Caching
- Next.js built-in caching
- Supabase query caching
- AI response caching (planned)

### Monitoring
- Sentry for error tracking
- Performance metrics via Vercel Analytics
- Database query monitoring via Supabase

---

## Deployment

### Production Stack
- **Hosting**: Vercel
- **Database**: Supabase (managed PostgreSQL)
- **Auth**: Clerk (managed)
- **AI**: Cerebras Cloud API
- **CDN**: Vercel Edge Network

### Environment Configuration

```env
# Production
NODE_ENV=production
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_SUPABASE_URL=https://prod.supabase.co
```

### CI/CD Pipeline
1. Push to `main` branch
2. Vercel builds and deploys
3. Database migrations via Supabase CLI
4. Sentry release tracking

---

## Scalability Considerations

### Current Limits
- 50+ banks in network
- 500+ historical deals
- Single-region deployment

### Future Scaling
- Multi-region database replication
- Redis caching layer
- Dedicated AI inference endpoints
- Horizontal scaling via Vercel

---

## Integration Points

### Current Integrations
- Clerk (Auth)
- Supabase (Database)
- Cerebras (AI)
- Sentry (Monitoring)

### Planned Integrations
- Bloomberg/Refinitiv (Market data)
- Salesforce (CRM)
- DocuSign (Document signing)
- Slack/Teams (Notifications)
