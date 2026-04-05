# Durandal - Sanctions Screening Platform

A premium SaaS frontend for sanctions screening, built with Next.js 14+, React, TailwindCSS, and Firebase Authentication.

## Overview

Durandal is a production-grade sanctions screening platform that allows compliance teams, analysts, and investigators to:

- **Search sanctions entities** across multiple sources (OFAC, EU, UN, UK)
- **Inspect grouped and ungrouped matches** with clear match reasons
- **Submit analyst decisions** (Clear / Review / Hit)
- **Manage manual private entities** for your workspace
- **View audit history** of previous searches
- **Manage API keys** for programmatic access
- **Monitor quota and usage** metrics

## Architecture

### Frontend-Only Database Access

**IMPORTANT**: This frontend communicates ONLY with the Backend/BFF API.

- PostgreSQL is **backend-only**
- BigQuery is **backend-only**
- The frontend uses HTTPS calls to the backend API exclusively
- Firebase handles authentication in the browser
- Firebase ID token is attached as Bearer token to all API requests
- The backend resolves workspace/user context from the token

## Tech Stack

- **Next.js 14+** with App Router
- **React 18**
- **TailwindCSS** with custom dark theme
- **Firebase Authentication** (Email/Password + Google OAuth)
- **TanStack Query (React Query)** for API state and caching
- **Zod** for validation
- **Lucide React** icons
- **Framer Motion** for animations
- **shadcn/ui** component patterns
- **Axios** for API client

## Project Structure

```
/app
├── app/
│   ├── login/              # Login page
│   ├── search/             # Sanctions search (main feature)
│   ├── audit/              # Audit history
│   ├── manual-entities/    # Manual entity management
│   ├── api-keys/           # API key management
│   ├── billing/            # Usage & billing
│   ├── settings/           # User settings
│   ├── layout.js           # Root layout with providers
│   ├── page.js             # Home redirect
│   └── globals.css         # Global styles
├── components/
│   ├── layout/             # AppShell, Sidebar, TopBar
│   ├── search/             # Search-related components
│   ├── shared/             # Shared UI components
│   ├── providers/          # React Query provider
│   └── ui/                 # shadcn/ui components
├── contexts/
│   └── AuthContext.js      # Firebase auth context
├── hooks/
│   ├── useSearch.js        # Search mutations/queries
│   ├── useManualEntities.js
│   ├── useApiKeys.js
│   ├── useUsage.js
│   └── useAudit.js
└── lib/
    ├── config.js           # Central configuration
    ├── firebase.js         # Firebase initialization
    ├── api-client.js       # Axios API client with auth
    └── utils.js            # Utility functions
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- Yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd app

# Install dependencies
yarn install
```

### Environment Variables

Copy the example environment file and configure:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Backend/BFF API Configuration
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.com
NEXT_PUBLIC_SEARCH_ENDPOINT=/api/v2/search
NEXT_PUBLIC_ENTITY_DETAIL_ENDPOINT=/api/v2/entities
NEXT_PUBLIC_MANUAL_ENTITY_ENDPOINT=/api/v2/entities/manual
NEXT_PUBLIC_DECISIONS_ENDPOINT=/api/v2/decisions
NEXT_PUBLIC_USAGE_ENDPOINT=/api/usage/me
NEXT_PUBLIC_API_KEYS_ENDPOINT=/api/keys

# Firebase Web Config
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### Development

```bash
# Start development server
yarn dev

# The app will be available at http://localhost:3000
```

### Build for Production

```bash
# Build the application
yarn build

# Start production server
yarn start
```

## Authentication Flow

1. User opens login page
2. User logs in via Email/Password or Google OAuth
3. Frontend obtains Firebase ID token
4. Frontend stores auth state in React context
5. Every API call includes: `Authorization: Bearer <firebase_id_token>`
6. On token refresh, API client automatically uses new token
7. Protected routes redirect unauthenticated users to login

## API Endpoints

The frontend communicates with these backend endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v2/search` | POST | Search sanctions entities |
| `/api/v2/entities/{id}` | GET | Get entity details |
| `/api/v2/entities/manual` | GET/POST | List/create manual entities |
| `/api/v2/entities/manual/{id}` | DELETE | Delete manual entity |
| `/api/v2/decisions` | POST/GET | Submit/get decisions |
| `/api/usage/me` | GET | Get usage statistics |
| `/api/keys` | GET/POST | List/create API keys |
| `/api/keys/{id}` | DELETE | Revoke API key |

## Search Request Format

```json
{
  "name": "string",
  "dob": "YYYY-MM-DD",
  "identifiers": ["string"],
  "sources": ["OFAC", "EU", "UN", "UK", "MANUAL"],
  "entity_types": ["INDIVIDUAL", "ENTITY", "VESSEL", "AIRCRAFT"],
  "regimes": ["string"],
  "countries": ["string"],
  "grouped": true,
  "include_manual": true,
  "page": 1,
  "page_size": 20,
  "min_match_band": "LOW"
}
```

## Decision Workflow

Analysts can mark search results with decisions:

- **CLEAR** - Entity is cleared, no sanctions match
- **REVIEW** - Requires further review
- **HIT** - Confirmed sanctions match

```json
{
  "entity_id": "uuid",
  "source": "OFAC",
  "decision_status": "CLEAR",
  "reviewer_notes": "optional note"
}
```

## Design System

### Colors

- **HIGH** match band: Red (`bg-red-500`)
- **MEDIUM** match band: Amber (`bg-amber-500`)
- **LOW** match band: Gray (`bg-slate-500`)
- **MANUAL** entity: Violet (`bg-violet-500`)
- **CLEAR** decision: Green
- **REVIEW** decision: Amber
- **HIT** decision: Red

### Typography

- Primary font: Inter
- Monospace: System monospace for code/IDs

## Contributing

1. Follow the existing code style
2. Use TypeScript types/interfaces where applicable
3. Test changes thoroughly
4. Update documentation as needed

## License

Proprietary - All rights reserved
