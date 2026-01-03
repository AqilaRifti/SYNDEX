# SYNDEX

**Intelligent Bank Matching for Syndicated Loans**

---

## Inspiration

The syndicated loan market moves $5+ trillion annually, yet the process of matching deals with banking partners is stuck in the past. Relationship managers spend weeks making calls, sending emails, and tracking responses in spreadsheets. 40-60% of invited banks decline because there's no intelligent way to predict which lenders actually want specific deal types.

We saw an opportunity to apply AI to a massive, underserved market. What if we could analyze historical participation patterns, sector expertise, and deal preferences to predict which banks are most likely to participate? What if we could turn weeks of manual outreach into seconds of intelligent matching?

That's SYNDEX.

---

## What it does

SYNDEX is an AI-powered platform that intelligently matches syndicated loan deals with the optimal banking partners.

**Core Features:**

- **AI-Powered Matching**: Enter deal details and get ranked recommendations of banks most likely to participate, with explainable reasoning for each match
- **Bank Network**: Access a curated database of 50+ institutional lenders with their sector expertise, geographic focus, and deal size preferences
- **Deal Management**: Create, track, and manage syndicated loan deals through the entire lifecycle
- **Invitation Tracking**: Send invitations to matched banks and monitor responses in real-time
- **Syndication Progress**: Visual dashboards showing commitment progress and deal status

**How Matching Works:**

1. User enters deal parameters (borrower, sector, amount, geography, terms)
2. AI analyzes 50+ factors against 500+ historical deals
3. Returns top 20 bank matches with scores, reasoning, and estimated commitments
4. Each match includes confidence level and historical participation rate

---

## How we built it

**Tech Stack:**

- **Frontend**: Next.js 16 with React 19, Tailwind CSS v4, Shadcn UI components
- **Authentication**: Clerk for secure auth with organization/team support
- **Database**: Supabase (PostgreSQL) for deals, banks, and historical participation data
- **AI**: Cerebras Qwen (235B parameter model) for intelligent bank matching
- **State Management**: Zustand for client state, Nuqs for URL state
- **Forms & Validation**: React Hook Form with Zod schemas
- **Error Tracking**: Sentry for monitoring

**AI Architecture:**

The matching algorithm builds context from:
- Historical participation patterns (which banks participated in similar deals)
- Bank mandates (sectors, deal sizes, geographies they prefer)
- Co-lending relationships (which banks often syndicate together)
- Deal characteristics (sector, size, rating, geography)

We use prompt engineering to get structured JSON responses with match scores, reasoning, and confidence levels. The system includes fallback heuristic matching if the AI fails.

**Data Model:**

- 50+ banks across 3 tiers (Bulge Bracket, Mid-Tier, Regional)
- 500 historical deals with realistic sector/geography distribution
- Historical participation records linking banks to past deals
- Deal invitations tracking current syndication status

---

## Challenges we ran into

**1. AI Response Consistency**

Getting the LLM to return consistently structured JSON was tricky. We implemented robust parsing that handles markdown-wrapped responses, validates bank names against our database, and normalizes scores. Added retry logic with exponential backoff and fallback to heuristic matching.

**2. Realistic Data Generation**

Creating believable synthetic data for 500 deals and 50+ banks required careful thought. We built weighted distributions for deal sizes, realistic company name generators by sector, and participation patterns that reflect actual market dynamics.

**3. API Rate Limits**

Cerebras API has rate limits, so we implemented API key rotation with round-robin load balancing across multiple keys. This lets us handle concurrent matching requests without hitting limits.

**4. Type Safety Across the Stack**

Maintaining type consistency between Supabase, the API layer, and React components required careful schema design. We created comprehensive TypeScript interfaces that mirror the database schema and are shared across the codebase.

**5. Real-time UI Updates**

Showing syndication progress and invitation status updates required thoughtful state management. We used Zustand for local state and optimistic updates to keep the UI responsive.

---

## Accomplishments that we're proud of

**1. Explainable AI**

Every bank match comes with human-readable reasoning. Not a black box - users understand WHY each bank is recommended. This builds trust and helps relationship managers have informed conversations.

**2. Production-Ready Architecture**

This isn't a hackathon prototype - it's built with production patterns: proper error handling, type safety, authentication, organization support, and monitoring. Ready to scale.

**3. Comprehensive Data Model**

We modeled the full syndicated loan workflow: deals, banks, historical participations, invitations, and status tracking. The schema supports real-world complexity.

**4. Beautiful UI**

Clean, professional design that financial institutions would actually use. Dark theme with accent colors, responsive layouts, and smooth animations via Framer Motion.

**5. AI Fallback System**

If the AI fails (rate limits, API issues), the system gracefully falls back to heuristic matching based on sector, geography, and deal size fit. Users always get results.

---

## What we learned

**1. Prompt Engineering is Critical**

The difference between good and great AI responses comes down to prompt design. Structured prompts with clear examples, explicit output formats, and relevant context dramatically improve results.

**2. Financial Data is Complex**

Syndicated loans have nuanced terminology, multiple stakeholder roles, and complex relationships. Understanding the domain deeply was essential to building something useful.

**3. LLMs Need Guardrails**

You can't trust raw LLM output. Validation, parsing, normalization, and fallbacks are essential for production systems. The AI is powerful but needs structure around it.

**4. Type Safety Saves Time**

Investing in comprehensive TypeScript types upfront prevented countless bugs. When your database schema, API responses, and UI components share types, refactoring is safe.

**5. Start with Real Workflows**

We focused on the actual workflow: create deal → match banks → send invitations → track responses. Building around real user journeys made the product coherent.

---

## What's next for SYNDEX

**Short Term (Next 3 months):**

- **Enhanced AI Model**: Fine-tune on more historical data for better accuracy
- **Mobile App**: iOS/Android apps for on-the-go deal tracking
- **Notifications**: Email/Slack alerts for invitation responses
- **Analytics Dashboard**: Market trends, success rates, bank performance metrics

**Medium Term (6-12 months):**

- **API Platform**: Let banks and borrowers integrate SYNDEX into their systems
- **Document Management**: Upload and share deal documents securely
- **Secondary Trading**: Extend to loan trading and secondary market
- **Multi-Currency**: Support EUR, GBP, and other currencies

**Long Term Vision:**

- **Full Ecosystem**: Connect borrowers, arrangers, and investors on one platform
- **Predictive Analytics**: Forecast market conditions and optimal timing
- **Regulatory Compliance**: Built-in reporting for regulatory requirements
- **Global Expansion**: Localized versions for APAC, EMEA, LATAM markets

---

**SYNDEX**: *Intelligent Bank Matching for Syndicated Loans*

Built with Next.js, Cerebras AI, Supabase, and Clerk.
