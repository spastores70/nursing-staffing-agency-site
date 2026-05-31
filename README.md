# NurseConnect — Healthcare Staffing Platform

A production-ready full-stack nursing staffing platform built with **Next.js 15**, **TypeScript**, **Prisma**, **PostgreSQL**, **Stripe**, and **Tailwind CSS**.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [User Roles](#user-roles)
- [API Routes](#api-routes)
- [Docker Deployment](#docker-deployment)
- [Vercel Deployment](#vercel-deployment)
- [Demo Credentials](#demo-credentials)

---

## Features

### Nurse Portal
- Professional profile with bio, specializations, experience
- Upload and manage certifications (RN, LPN, CNA, NP, etc.)
- Browse and search thousands of job listings with filters
- One-click job applications with cover letters
- Real-time application tracking dashboard
- Interview scheduling with video meeting links
- Save favorite jobs for later
- Email & in-app notifications

### Facility Portal
- Post unlimited job listings with rich descriptions
- Advanced nurse search with specialization, location, experience filters
- Full ATS (Applicant Tracking System) with pipeline management
- Interview scheduling with automated candidate notifications
- Application status management (Pending → Shortlisted → Offered → Accepted)
- Billing and subscription management via Stripe
- Invoice generation and download

### Admin Dashboard
- User management (approve, suspend, activate accounts)
- Registration approval workflow with email notifications
- Platform analytics (users, revenue, jobs, applications)
- Revenue dashboard with payment history
- Activity logging
- System settings management

### Authentication & Security
- Email/password registration and login
- Google OAuth integration
- Password reset via secure email tokens
- Role-based access control (NURSE / FACILITY / ADMIN)
- JWT sessions with NextAuth.js
- Rate limiting on auth and API endpoints
- Input validation with Zod
- Secure password hashing with bcrypt

### Payments (Stripe)
- Monthly and annual subscription plans
- 14-day free trial for all paid plans
- Checkout sessions via Stripe
- Webhook handling for subscription lifecycle
- Payment history and receipt URLs
- Customer portal for billing management

### Notifications
- In-app notification system
- Email notifications for key events:
  - Welcome email
  - Account approved
  - Application received
  - Application status updates
  - Interview scheduled
  - Password reset

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Framer Motion |
| Database | PostgreSQL 16 |
| ORM | Prisma 5 |
| Auth | NextAuth.js v4 |
| Payments | Stripe |
| Email | Nodemailer |
| Forms | React Hook Form + Zod |
| Data Fetching | TanStack Query |
| UI Components | Radix UI primitives |
| Icons | Lucide React |
| Charts | Recharts |
| Deployment | Docker / Vercel |

---

## Project Structure

```
nursing-staffing-platform/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Sample data seeder
├── src/
│   ├── app/
│   │   ├── (auth)/            # Auth pages (login, register, reset)
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── reset-password/
│   │   ├── (dashboard)/       # Protected dashboard routes
│   │   │   ├── nurse/         # Nurse portal
│   │   │   ├── facility/      # Facility portal
│   │   │   └── admin/         # Admin dashboard
│   │   ├── api/               # REST API routes
│   │   │   ├── auth/          # NextAuth + register + reset
│   │   │   ├── nurses/        # Nurse profiles & search
│   │   │   ├── jobs/          # Job CRUD + save
│   │   │   ├── applications/  # Apply + status updates
│   │   │   ├── interviews/    # Schedule interviews
│   │   │   ├── payments/      # Stripe checkout + webhook
│   │   │   ├── notifications/ # Notification management
│   │   │   └── admin/         # Admin-only routes
│   │   ├── layout.tsx
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   ├── dashboard/         # Sidebar, Topbar, StatsCard
│   │   ├── landing/           # Landing page sections
│   │   └── providers.tsx      # Session + Query providers
│   ├── hooks/
│   │   └── use-toast.ts
│   ├── lib/
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── db.ts              # Prisma client singleton
│   │   ├── email.ts           # Nodemailer email functions
│   │   ├── rate-limit.ts      # API rate limiting
│   │   ├── stripe.ts          # Stripe client + helpers
│   │   ├── utils.ts           # Utility functions
│   │   └── validators.ts      # Zod validation schemas
│   ├── middleware.ts           # Auth & role middleware
│   └── types/
│       └── index.ts           # TypeScript type declarations
├── public/
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── next.config.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 16+ (or Docker)
- npm or yarn

### 1. Clone and Install

```bash
git clone https://github.com/your-org/nursing-staffing-platform.git
cd nursing-staffing-platform
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your values (see [Environment Variables](#environment-variables)).

### 3. Database Setup

```bash
# Push schema to database
npm run db:push

# Seed sample data
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `NEXTAUTH_URL` | App URL (http://localhost:3000 for dev) | ✅ |
| `NEXTAUTH_SECRET` | Random 32+ char secret for JWT | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Optional |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Optional |
| `STRIPE_SECRET_KEY` | Stripe secret key (sk_test_...) | Optional |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Optional |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook endpoint secret | Optional |
| `SMTP_HOST` | SMTP server host | Optional |
| `SMTP_PORT` | SMTP port (587) | Optional |
| `SMTP_USER` | SMTP username/email | Optional |
| `SMTP_PASSWORD` | SMTP password or app password | Optional |
| `EMAIL_FROM` | From email address | Optional |
| `NEXT_PUBLIC_APP_URL` | Public app URL | Optional |

### Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs

### Stripe Setup

1. Create account at [stripe.com](https://stripe.com)
2. Get test keys from Dashboard > Developers > API keys
3. Create products and prices in Dashboard > Products
4. Set up webhook endpoint: `https://yourdomain.com/api/payments/webhook`
5. Add events: `checkout.session.completed`, `customer.subscription.*`, `invoice.*`

---

## Database Setup

### Development

```bash
# Generate Prisma client
npm run db:generate

# Push schema (no migration files)
npm run db:push

# Create migration files (production)
npm run db:migrate

# Seed sample data
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

### Production

```bash
# Apply migrations
npm run db:migrate:prod

# Seed if needed
npm run db:seed
```

---

## User Roles

### NURSE
- Create and manage professional profile
- Browse job listings with advanced filters
- Apply to jobs with cover letters
- Track application status in real-time
- Schedule and manage interviews
- Save favorite jobs
- Receive email and in-app notifications

### FACILITY
- Create facility profile with accreditations
- Post job listings (draft/open/paused/closed)
- Search and filter verified nurse profiles
- Manage applicant pipeline with ATS
- Schedule interviews with meeting links
- Manage Stripe subscription and billing
- View invoices and payment history

### ADMIN
- Approve or reject user registrations
- Manage all users (activate/suspend)
- View platform-wide analytics
- Monitor revenue and payments
- Access all facility and nurse data
- Manage system settings

---

## API Routes

### Authentication
| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/[...nextauth]` | NextAuth handler |
| POST | `/api/auth/forgot-password` | Send password reset email |
| POST | `/api/auth/reset-password` | Reset password with token |

### Nurses
| Method | Route | Description |
|---|---|---|
| GET | `/api/nurses` | Search nurses (Facility/Admin only) |
| GET | `/api/nurses/profile` | Get current nurse's profile |
| PUT | `/api/nurses/profile` | Update nurse profile |

### Jobs
| Method | Route | Description |
|---|---|---|
| GET | `/api/jobs` | List/search jobs (public) |
| POST | `/api/jobs` | Create job (Facility only) |
| GET | `/api/jobs/[id]` | Get job details |
| PATCH | `/api/jobs/[id]` | Update job |
| DELETE | `/api/jobs/[id]` | Delete job |
| POST | `/api/jobs/[id]/save` | Save job (Nurse only) |
| DELETE | `/api/jobs/[id]/save` | Unsave job |

### Applications
| Method | Route | Description |
|---|---|---|
| GET | `/api/applications` | List applications (role-filtered) |
| POST | `/api/applications` | Submit application (Nurse only) |
| PATCH | `/api/applications/[id]/status` | Update status (Facility only) |

### Interviews
| Method | Route | Description |
|---|---|---|
| POST | `/api/interviews` | Schedule interview (Facility only) |

### Payments
| Method | Route | Description |
|---|---|---|
| POST | `/api/payments/create-checkout` | Create Stripe checkout session |
| POST | `/api/payments/webhook` | Stripe webhook handler |

### Notifications
| Method | Route | Description |
|---|---|---|
| GET | `/api/notifications` | Get user notifications |
| PATCH | `/api/notifications` | Mark as read |

### Admin
| Method | Route | Description |
|---|---|---|
| PATCH | `/api/admin/users/[id]/status` | Update user status |
| GET | `/api/admin/analytics` | Platform analytics |

---

## Docker Deployment

### Build and Run

```bash
# Copy and configure environment
cp .env.example .env
# Edit .env with production values

# Build and start services
docker-compose up -d

# Run migrations and seed (first time)
docker-compose --profile migrate up migrate

# View logs
docker-compose logs -f app
```

### Services

- **postgres** — PostgreSQL 16 database on port 5432
- **app** — Next.js application on port 3000
- **migrate** — One-time migration/seed runner (profile: migrate)

---

## Vercel Deployment

### 1. Connect Repository

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) and import the project

### 2. Configure Environment Variables

Add all variables from `.env.example` in Vercel Dashboard > Settings > Environment Variables.

### 3. Database (Vercel Postgres or Neon)

```bash
# Using Neon (recommended)
# 1. Create project at neon.tech
# 2. Copy connection string to DATABASE_URL
# 3. Add ?sslmode=require to the connection string
```

### 4. Deploy

```bash
vercel --prod
```

### 5. Post-deploy Database Setup

```bash
# Set DATABASE_URL environment variable locally pointing to prod DB
npm run db:migrate:prod
npm run db:seed  # Optional: seed sample data
```

---

## Demo Credentials

After running `npm run db:seed`:

| Role | Email | Password |
|---|---|---|
| Admin | admin@nurseconnect.com | Admin@123456 |
| Facility | contact@citymedical.com | Facility@123 |
| Nurse | sarah.johnson@email.com | Nurse@123 |

> **Note:** Seeded accounts have `ACTIVE` status and bypass approval flow.

---

## Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to DB (dev)
npm run db:migrate   # Create migration (dev)
npm run db:migrate:prod  # Apply migrations (prod)
npm run db:seed      # Seed sample data
npm run db:studio    # Open Prisma Studio
npm run db:reset     # Reset database
```

---

## Security Features

- **Rate Limiting** — Auth endpoints (5 req/min), API (100 req/min), password reset (3 req/15 min)
- **Input Validation** — All inputs validated with Zod before processing
- **Password Security** — bcrypt hashing with 12 rounds
- **JWT Security** — Signed sessions with NextAuth, 30-day expiry
- **Role Enforcement** — Middleware + API route guards for all protected resources
- **SQL Injection Prevention** — Prisma ORM with parameterized queries
- **CORS** — Next.js default CORS handling
- **Webhook Verification** — Stripe signature verification on all webhook events
- **Email Enumeration Prevention** — Password reset always returns same response

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

Built with ❤️ for healthcare staffing teams.
