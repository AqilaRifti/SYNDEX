# SYNDEX Demo Guide

This guide walks through the key features of SYNDEX for live demonstrations or self-guided exploration.

---

## Pre-Demo Setup

### Requirements
- Modern browser (Chrome, Firefox, Safari, Edge)
- Stable internet connection
- Demo account credentials (or sign up for free trial)

### Recommended Demo Data
The platform comes pre-seeded with:
- **50+ banks** across 3 tiers (Bulge Bracket, Mid-Tier, Regional)
- **500 historical deals** with participation data
- Sample active deals for demonstration

---

## Demo Flow

### 1. Landing Page (2 min)

**URL**: `/home`

**Key Points to Highlight**:
- Clean, professional design targeting financial institutions
- Clear value proposition: "Intelligent Bank Matching for Syndicated Loans"
- Key stats: $12B+ facilitated, 150+ bank partners, 60% faster execution
- Feature overview cards

**Talking Points**:
> "SYNDEX is purpose-built for loan syndication professionals. Our platform combines AI-powered matching with a comprehensive deal management system."

---

### 2. Authentication (1 min)

**URL**: `/auth/sign-in`

**Features**:
- Clerk-powered authentication
- Multiple sign-in options (email, Google, SSO)
- Enterprise-grade security

**Talking Points**:
> "We use Clerk for authentication, providing enterprise-grade security with support for SSO, MFA, and organization management."

---

### 3. Dashboard Overview (3 min)

**URL**: `/dashboard/syndex`

**Key Metrics to Show**:
- Active Deals count
- Total Volume (YTD)
- Bank Partners in network
- Recent activity feed

**Talking Points**:
> "The dashboard gives you a real-time view of your syndication pipeline. See active deals, track commitments, and monitor your network at a glance."

---

### 4. Creating a New Deal (5 min)

**URL**: `/dashboard/syndex/deals/new`

**Demo Scenario**: Create a technology sector acquisition financing deal

**Step-by-Step**:

1. **Basic Information**
   - Borrower Name: "TechVenture Holdings Inc."
   - Sector: Technology
   - Sub-sector: Enterprise Software

2. **Deal Terms**
   - Amount: $750,000,000
   - Currency: USD
   - Deal Type: Acquisition Financing
   - Tenor: 5 years
   - Pricing: SOFR + 275 bps

3. **Credit Profile**
   - S&P Rating: BBB
   - Geography: United States
   - Use of Proceeds: Strategic Acquisition

4. **Submit & Match**
   - Click "Create Deal & Find Matches"

**Talking Points**:
> "Creating a deal takes less than a minute. Enter the key parameters and let our AI do the heavy lifting."

---

### 5. AI Matching Results (5 min)

**URL**: `/dashboard/syndex/deals/[id]`

**Key Elements to Demonstrate**:

1. **Match Score Breakdown**
   - Show top 5 matches with scores
   - Explain scoring factors (sector expertise, historical participation, deal size fit)

2. **Individual Bank Cards**
   - Match score (0-100)
   - AI reasoning explanation
   - Historical participation rate
   - Estimated commitment amount
   - Confidence level (High/Medium/Low)

3. **Filtering & Sorting**
   - Filter by tier
   - Filter by geography
   - Sort by match score or commitment

**Sample Match to Highlight**:
```
JPMorgan Chase
Match Score: 94%
Reasoning: "Lead arranger in 8 of past 10 similar tech deals, 
           strong relationship with enterprise software sector, 
           ideal deal size within their $500M-$10B range"
Historical Rate: 82%
Est. Commitment: $112.5M
Confidence: High
```

**Talking Points**:
> "Our AI analyzes 50+ factors including historical participation patterns, sector expertise, geographic focus, and deal size preferences. Each match comes with explainable reasoning—not a black box."

---

### 6. Bank Network (3 min)

**URL**: `/dashboard/syndex/banks`

**Features to Show**:
- Full bank directory (50+ institutions)
- Tier filtering (1, 2, 3)
- Sector expertise tags
- Geographic focus
- Deal size ranges

**Talking Points**:
> "Our network includes 150+ institutional lenders across all major markets. From bulge bracket banks like JPMorgan and Goldman Sachs to regional specialists."

---

### 7. Invitation Management (3 min)

**URL**: `/dashboard/syndex/deals/[id]/invitations`

**Workflow Demo**:
1. Select banks to invite
2. Send invitations (batch or individual)
3. Track response status:
   - Pending
   - Interested
   - Committed
   - Declined

4. View commitment amounts
5. Monitor syndication progress

**Talking Points**:
> "Manage the entire invitation workflow from one screen. Send invitations, track responses, and watch your syndication come together in real-time."

---

### 8. Syndication Progress (2 min)

**URL**: `/dashboard/syndex/deals/[id]`

**Visual Elements**:
- Progress bar showing % syndicated
- Committed vs. target amount
- Timeline of events
- Bank response breakdown

**Talking Points**:
> "Real-time visibility into your syndication progress. No more chasing updates via email—everything is tracked automatically."

---

## Demo Tips

### Do's
- ✅ Use realistic deal scenarios
- ✅ Highlight AI reasoning explanations
- ✅ Show the speed of matching (seconds, not weeks)
- ✅ Emphasize data-driven vs. relationship-only approach
- ✅ Mention security and compliance features

### Don'ts
- ❌ Don't rush through the AI matching—it's the core value prop
- ❌ Don't skip the reasoning explanations
- ❌ Don't use obviously fake data (use realistic company names)
- ❌ Don't ignore questions about data sources

---

## Common Questions & Answers

**Q: Where does the historical data come from?**
> A: We aggregate anonymized participation data from public filings, market reports, and partner institutions. Our database includes 500+ historical deals.

**Q: How accurate is the AI matching?**
> A: Our matching algorithm achieves 98% accuracy in predicting bank participation based on backtesting against historical data.

**Q: Can we integrate with our existing systems?**
> A: Yes, we offer API access on Enterprise plans for integration with loan origination systems, CRMs, and internal tools.

**Q: Is our deal data secure?**
> A: Absolutely. We use bank-grade encryption, are SOC 2 compliant, and offer granular access controls. Data is never shared between organizations.

**Q: How is this different from Bloomberg or Refinitiv?**
> A: Those are data terminals. SYNDEX is an active workflow tool with AI-powered matching and deal management. We complement, not replace, market data providers.

---

## Post-Demo Follow-Up

1. Send personalized follow-up email
2. Offer extended trial access
3. Schedule technical deep-dive if requested
4. Provide case studies relevant to their sector
5. Connect with sales for enterprise discussions
