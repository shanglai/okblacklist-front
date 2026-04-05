# GCP Deployment Agent Prompt - Durandal Sanctions Screening Platform

## Project Overview
This is a **Next.js 14+ frontend application** for a sanctions screening SaaS platform. It needs to be deployed to GCP and connected to an existing backend API.

---

## Tech Stack
- **Framework**: Next.js 14.2.3 with App Router
- **Runtime**: Node.js 18+
- **Package Manager**: Yarn
- **Authentication**: Firebase Auth (client-side)
- **State Management**: TanStack Query (React Query)
- **Styling**: TailwindCSS

---

## Key Files & Structure

```
/app/
├── app/                          # Next.js App Router pages
│   ├── layout.js                 # Root layout with providers
│   ├── page.js                   # Home redirect
│   ├── globals.css               # Global styles
│   ├── login/page.js             # Login page
│   ├── search/                   # Main search feature
│   │   ├── page.js
│   │   └── layout.js
│   ├── audit/                    # Audit history
│   ├── manual-entities/          # Manual entity management
│   ├── api-keys/                 # API key management
│   ├── billing/                  # Usage dashboard
│   └── settings/                 # User settings
├── components/
│   ├── layout/                   # AppShell, Sidebar, TopBar
│   ├── search/                   # Search components
│   ├── shared/                   # Shared UI components
│   ├── providers/                # React Query provider
│   └── ui/                       # shadcn/ui components
├── contexts/
│   └── AuthContext.js            # Firebase auth context
├── hooks/                        # React Query hooks
│   ├── useSearch.js
│   ├── useManualEntities.js
│   ├── useApiKeys.js
│   ├── useUsage.js
│   └── useAudit.js
├── lib/
│   ├── config.js                 # Central configuration
│   ├── firebase.js               # Firebase initialization
│   ├── api-client.js             # Axios API client with auth
│   └── utils.js                  # Utility functions
├── .env                          # Environment variables
├── .env.local.example            # Environment template
├── package.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

---

## Environment Variables Required

```env
# Backend/BFF API Configuration
NEXT_PUBLIC_API_BASE_URL=https://sanctions-backend-1056991374494.us-central1.run.app
NEXT_PUBLIC_SEARCH_ENDPOINT=/api/v2/search
NEXT_PUBLIC_ENTITY_DETAIL_ENDPOINT=/api/v2/entities
NEXT_PUBLIC_MANUAL_ENTITY_ENDPOINT=/api/v2/entities/manual
NEXT_PUBLIC_DECISIONS_ENDPOINT=/api/v2/decisions
NEXT_PUBLIC_USAGE_ENDPOINT=/api/usage/me
NEXT_PUBLIC_API_KEYS_ENDPOINT=/api/keys

# Firebase Web Config
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDCVCqVRm91eaMnALmpie5P-lVPW_3-mmY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=durandal-484622.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=durandal-484622
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=durandal-484622.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1056991374494
NEXT_PUBLIC_FIREBASE_APP_ID=1:1056991374494:web:15c1010d07d6b22fd9df8f
```

---

## Backend API Endpoints

The frontend connects to these backend endpoints. All requests include:
- Header: `Authorization: Bearer <firebase_id_token>`
- Header: `Content-Type: application/json`

### Search
```
POST ${NEXT_PUBLIC_API_BASE_URL}/api/v2/search
```
Request body:
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

### Entity Details
```
GET ${NEXT_PUBLIC_API_BASE_URL}/api/v2/entities/{id}
```

### Manual Entities
```
GET  ${NEXT_PUBLIC_API_BASE_URL}/api/v2/entities/manual
POST ${NEXT_PUBLIC_API_BASE_URL}/api/v2/entities/manual
DELETE ${NEXT_PUBLIC_API_BASE_URL}/api/v2/entities/manual/{id}
```

### Decisions
```
POST ${NEXT_PUBLIC_API_BASE_URL}/api/v2/decisions
GET  ${NEXT_PUBLIC_API_BASE_URL}/api/v2/decisions
```
Request body for POST:
```json
{
  "entity_id": "uuid",
  "source": "OFAC",
  "decision_status": "CLEAR|REVIEW|HIT",
  "reviewer_notes": "optional note"
}
```

### Usage/Quota
```
GET ${NEXT_PUBLIC_API_BASE_URL}/api/usage/me
```

### API Keys
```
GET    ${NEXT_PUBLIC_API_BASE_URL}/api/keys
POST   ${NEXT_PUBLIC_API_BASE_URL}/api/keys
DELETE ${NEXT_PUBLIC_API_BASE_URL}/api/keys/{id}
```

### Audit History
```
GET ${NEXT_PUBLIC_API_BASE_URL}/api/v2/audit
```

---

## Authentication Flow

1. **Firebase Auth** handles authentication client-side
2. User signs in via Email/Password or Google OAuth
3. Frontend obtains Firebase ID token
4. Every API request includes: `Authorization: Bearer <firebase_id_token>`
5. Backend validates token and resolves workspace/user context
6. Token auto-refreshes via Firebase SDK

### Key Auth Files:
- `/app/lib/firebase.js` - Firebase initialization and auth helpers
- `/app/contexts/AuthContext.js` - React context for auth state
- `/app/lib/api-client.js` - Axios interceptor attaches token to requests

---

## GCP Deployment Options

### Option 1: Cloud Run (Recommended)
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

### Option 2: App Engine
```yaml
# app.yaml
runtime: nodejs18
env: standard
instance_class: F2

env_variables:
  NEXT_PUBLIC_API_BASE_URL: "https://your-backend-url"
  # ... other env vars

handlers:
  - url: /.*
    script: auto
    secure: always
```

### Option 3: Firebase Hosting + Cloud Functions
Deploy static assets to Firebase Hosting with SSR via Cloud Functions.

---

## Build Commands

```bash
# Install dependencies
yarn install

# Development
yarn dev

# Production build
yarn build

# Start production server
yarn start
```

---

## Firebase Console Configuration Required

1. **Authorized Domains** - Add your GCP domain to:
   - Firebase Console → Authentication → Settings → Authorized domains
   
2. **OAuth Redirect URIs** - For Google OAuth:
   - Google Cloud Console → APIs & Services → Credentials
   - Add authorized redirect URI: `https://your-domain.com/__/auth/handler`

---

## Important Architecture Notes

- **Frontend NEVER connects directly to PostgreSQL or BigQuery**
- All database access is through the backend API only
- Firebase handles auth; backend validates tokens
- Workspace context is enforced by backend based on JWT claims

---

## Configuration Files to Review

1. **`/app/lib/config.js`** - Central config, reads all env vars
2. **`/app/lib/api-client.js`** - API base URL and auth interceptor
3. **`/app/lib/firebase.js`** - Firebase project configuration
4. **`/app/next.config.js`** - Next.js configuration
5. **`/app/package.json`** - Dependencies and scripts

---

## Health Check / Smoke Test

After deployment, verify:
1. `https://your-domain.com/login` - Login page loads
2. Firebase Auth works (add domain to authorized list first)
3. API calls reach backend (check network tab for 200s or expected errors)
4. Demo mode works (click "Try Demo" button)

---

## Current Backend URL
```
https://sanctions-backend-1056991374494.us-central1.run.app
```

This is the existing Cloud Run backend. The frontend can be deployed anywhere and pointed to this URL, or the URL can be updated if the backend moves.
