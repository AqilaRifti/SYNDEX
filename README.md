# SYNDEX

AI-powered syndicated loan origination and bank matching platform.

## Overview

SYNDEX streamlines syndicated loan workflows by intelligently matching deals with the most suitable banking partners. Built with Next.js 16, Clerk authentication, and a Bloomberg-terminal inspired dark UI.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Auth**: Clerk (with Organizations & Billing)
- **Styling**: Tailwind CSS v4 + Shadcn UI
- **State**: Zustand + Nuqs (URL state)
- **Database**: Supabase
- **Forms**: React Hook Form + Zod
- **Animations**: Motion (Framer Motion)

## Getting Started

```bash
cd frontend

# Install dependencies
bun install

# Set up environment
cp env.example.txt .env.local
# Add your Clerk and Supabase keys

# Run development server
bun run dev
```

Visit http://localhost:3000

## Project Structure

```
frontend/src/
├── app/
│   ├── home/           # Landing page
│   ├── auth/           # Sign in/up pages
│   ├── dashboard/      # Protected dashboard routes
│   │   ├── syndex/     # Main SYNDEX features
│   │   │   ├── deals/  # Deal management
│   │   │   └── banks/  # Bank directory
│   │   └── profile/    # User profile
│   └── api/            # API routes
├── components/
│   ├── ui/             # Shadcn UI components
│   ├── layout/         # Layout components
│   └── syndex/         # SYNDEX-specific components
├── features/           # Feature modules
├── hooks/              # Custom React hooks
├── lib/                # Utilities
└── config/             # App configuration
```

## User Flow

1. **Landing** (`/home`) - Marketing page with features and CTAs
2. **Auth** (`/auth/sign-in`, `/auth/sign-up`) - Clerk authentication
3. **Dashboard** (`/dashboard/syndex`) - Main deal management interface
4. **New Deal** (`/dashboard/syndex/deals/new`) - Create syndicated loan deals
5. **Bank Matching** - AI-powered bank recommendations
6. **Banks Directory** (`/dashboard/syndex/banks`) - Browse banking partners

## Features

- AI-powered bank matching for syndicated loans
- Deal lifecycle management
- Real-time syndication progress tracking
- Multi-tenant workspaces (Clerk Organizations)
- Role-based access control
- Dark mode Bloomberg-terminal aesthetic

## Environment Variables

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Scripts

```bash
bun run dev      # Development server
bun run build    # Production build
bun run start    # Start production
bun run lint     # ESLint
bun run format   # Prettier
bun run seed     # Seed database
```

## License

MIT
