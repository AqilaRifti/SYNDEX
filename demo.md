# Demo Guide

## Live Demo

🔗 **[View Live Demo](https://dub.sh/shadcn-dashboard)**

## Demo Walkthrough

### 1. Authentication

**Sign Up / Sign In**
- Navigate to the demo URL
- Create an account or sign in with existing credentials
- Supports email/password and social logins via Clerk

### 2. Dashboard Overview

**Analytics Page** (`/dashboard`)
- View key metrics cards
- Interactive charts powered by Recharts
- Parallel route loading for independent sections

### 3. Data Tables

**Product List** (`/dashboard/product`)
- Server-side pagination
- Column filtering and sorting
- Search with URL state persistence (Nuqs)
- Create new products with validated forms

### 4. Workspaces (Organizations)

**Workspace Management** (`/dashboard/workspaces`)
- Create new organizations
- Switch between workspaces
- View organization list

**Team Management** (`/dashboard/workspaces/team`)
- Invite team members
- Manage roles and permissions
- Configure organization settings

### 5. Billing

**Subscription Management** (`/dashboard/billing`)
- View available plans
- Subscribe to a plan
- Manage existing subscription

**Exclusive Content** (`/dashboard/exclusive`)
- Example of plan-gated content
- Only accessible to Pro plan subscribers

### 6. Additional Features

**Kanban Board** (`/dashboard/kanban`)
- Drag-and-drop task management
- Persistent state with Zustand

**Profile** (`/dashboard/profile`)
- User account settings
- Security configuration

**Command Palette** (⌘+K / Ctrl+K)
- Quick navigation
- Search across the app

## Testing Scenarios

### Test Authentication
1. Sign up with a new email
2. Sign out and sign back in
3. Try accessing `/dashboard` without authentication

### Test Organizations
1. Create a new organization
2. Invite a team member (use a second email)
3. Switch between organizations
4. Check navigation changes based on org context

### Test RBAC
1. As org admin, verify all nav items visible
2. As org member, verify restricted items hidden
3. Try direct URL access to restricted pages

### Test Billing (Development Mode)
1. Navigate to billing page
2. Select a plan
3. Use Stripe test card: `4242 4242 4242 4242`
4. Verify plan-gated content access

## Local Demo Setup

```bash
# Clone and install
git clone https://github.com/Kiranism/next-shadcn-dashboard-starter.git
cd next-shadcn-dashboard-starter/frontend
bun install

# Configure environment
cp env.example.txt .env.local
# Add your Clerk keys to .env.local

# Seed sample data (optional)
bun run seed

# Start the app
bun run dev
```

## Screenshots

Dashboard overview, data tables, and workspace management screenshots are available in the main README.

## Support

For issues or questions:
- Open a GitHub issue
- Check existing documentation in `/docs`
