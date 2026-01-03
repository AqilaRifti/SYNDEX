# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Browser                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Next.js 16 App Router                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Pages     │  │   API       │  │   Server Actions    │  │
│  │   (RSC)     │  │   Routes    │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│    Clerk      │    │   Supabase    │    │    Sentry     │
│  (Auth/Org)   │    │  (Database)   │    │   (Errors)    │
└───────────────┘    └───────────────┘    └───────────────┘
```

## Directory Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication routes
│   │   ├── (dashboard)/       # Dashboard routes (protected)
│   │   └── api/               # API endpoints
│   │
│   ├── components/            # Shared components
│   │   ├── ui/               # Shadcn UI primitives
│   │   └── layout/           # Layout components
│   │
│   ├── features/             # Feature modules
│   │   └── [feature]/
│   │       ├── components/   # Feature-specific components
│   │       ├── actions/      # Server actions
│   │       ├── schemas/      # Zod validation schemas
│   │       └── utils/        # Feature utilities
│   │
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Core utilities
│   ├── stores/               # Zustand state stores
│   └── types/                # TypeScript definitions
│
├── public/                   # Static assets
├── scripts/                  # Database seeding scripts
└── docs/                     # Documentation
```

## Key Architectural Decisions

### 1. Feature-Based Organization

Each feature is self-contained with its own components, actions, and schemas. This enables:
- Clear ownership and boundaries
- Easy feature addition/removal
- Parallel development

### 2. Server Components First

React Server Components (RSC) are used by default:
- Reduced client-side JavaScript
- Direct database access
- Better SEO and initial load

Client components are used only when needed (interactivity, hooks).

### 3. Authentication Layer

Clerk handles all authentication concerns:
- User sign-in/sign-up
- Session management
- Organization/workspace management
- Billing and subscriptions

### 4. Client-Side RBAC Navigation

Navigation filtering is handled client-side for performance:
- Zero server calls for nav visibility
- Instant filtering using Clerk hooks
- Security enforced at page/API level

### 5. State Management

| Scope | Solution |
|-------|----------|
| Server state | React Server Components |
| URL state | Nuqs (type-safe search params) |
| Client state | Zustand |
| Form state | React Hook Form |

## Data Flow

### Authentication Flow
```
User → Clerk Sign-in → Session Created → Middleware Check → Protected Route
```

### Organization Flow
```
User → Select/Create Org → Clerk Organization → RBAC Check → Feature Access
```

### Data Fetching
```
Page Request → Server Component → Database Query → Render → Stream to Client
```

## Security Model

1. **Authentication**: Clerk middleware protects all `/dashboard` routes
2. **Authorization**: Server-side `has()` checks for plans/features
3. **Navigation**: Client-side filtering (UX only, not security)
4. **API Routes**: Server-side permission validation

## Performance Optimizations

- Parallel routes for independent loading
- Streaming with React Suspense
- Image optimization with Next.js Image
- Client-side navigation caching
