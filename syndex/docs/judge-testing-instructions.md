# SYNDEX - Judge Testing Instructions

**CONFIDENTIAL - For Hackathon Judges Only**

---

## Live Demo URL

**Production**: https://syndex.vercel.app

---

## Getting Started

**No pre-made account needed!** Simply sign up with your email:

1. Click "Get Started" or "Sign Up"
2. Enter any email address
3. Create a password
4. You're in!

Clerk handles authentication - signup takes 30 seconds.

---

## Quick Start Testing Flow

### 1. Landing Page (2 min)
- Visit the home page at `/home`
- Review the value proposition and feature highlights
- Click "Get Started" or "Sign In"

### 2. Sign In (1 min)
- Create your own account
- You'll be redirected to the dashboard after login

### 3. Dashboard Overview (2 min)
- View the main dashboard at `/dashboard/syndex`
- See active deals, bank network stats, and recent activity

### 4. Create a New Deal (3 min)
- Navigate to Deals → New Deal
- Fill in sample deal:
  - Borrower: "TechVenture Holdings Inc."
  - Sector: Technology
  - Amount: $500,000,000
  - Deal Type: Acquisition Financing
  - Tenor: 5 years
  - Pricing: SOFR + 275 bps
  - Rating: BBB
  - Geography: United States
- Click "Create Deal & Find Matches"

### 5. Review AI Matches (3 min)
- View the ranked list of matched banks
- Note the match scores (0-100) and AI reasoning
- Each match shows:
  - Bank name and tier
  - Match score with explanation
  - Historical participation rate
  - Estimated commitment amount
  - Confidence level (High/Medium/Low)

### 6. Explore Bank Network (2 min)
- Navigate to Banks section
- Filter by tier (1, 2, 3)
- View bank details: sectors, geography, deal size range

---

## Key Features to Test

| Feature | Where to Find | What to Look For |
|---------|---------------|------------------|
| AI Matching | Create new deal | Ranked banks with explainable reasoning |
| Bank Network | /dashboard/syndex/banks | 50+ banks with detailed profiles |
| Deal Management | /dashboard/syndex/deals | Create, view, track deals |
| Authentication | Sign in/up | Clerk-powered secure auth |
| Responsive UI | Resize browser | Mobile-friendly design |

---

## Sample Test Scenarios

### Scenario A: Tech Sector Deal
- Sector: Technology
- Amount: $750M
- Geography: United States
- Expected: JPMorgan, Goldman Sachs, Morgan Stanley ranked high

### Scenario B: Energy Infrastructure Deal
- Sector: Energy
- Amount: $1.2B
- Geography: Europe
- Expected: HSBC, BNP Paribas, Barclays ranked high

### Scenario C: Small Regional Deal
- Sector: Healthcare
- Amount: $150M
- Geography: United States
- Expected: Regional banks (Tier 3) ranked higher

---

## Technical Notes

- **AI Model**: Cerebras Qwen (235B parameters)
- **Response Time**: AI matching typically completes in 3-8 seconds
- **Fallback**: If AI fails, heuristic matching provides results
- **Data**: Pre-seeded with 50+ banks and 500 historical deals

---

## Known Limitations

1. AI matching requires internet connection to Cerebras API
2. First match request may be slower (cold start)
3. Demo data is synthetic but realistic

---

## Support

If you encounter any issues during testing:
- Email: aqilarifti@gmail.com
- The app includes error handling and will show user-friendly messages

---
