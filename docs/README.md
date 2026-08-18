# HuluRent Documentation

**A hyper-local peer-to-peer rental marketplace and digital trust layer.**

HuluRent enables individuals to safely rent out physical items they own — cameras, tools, camping gear, event equipment, appliances — to nearby users who need them temporarily. It provides the digital infrastructure that informal borrowing lacks: item listings, availability calendars, binding digital agreements, timestamped condition evidence, transaction history, and two-sided reputation.

Lives in: **`hulurent-docs`** (`README.md`)  
Reference Issue: **`[DOC-01]`** (Team section & comprehensive documentation index)

---

## Table of Contents

- [Organization & Repositories](#organization--repositories)
- [Overview & Value Proposition](#overview--value-proposition)
- [Core Roles & Features](#core-roles--features)
- [Explicit Scope Boundaries](#explicit-scope-boundaries)
- [Tech Stack](#tech-stack)
- [Rental Lifecycle](#rental-lifecycle)
- [Documentation Index](#documentation-index)
- [Getting Started & Local Setup](#getting-started--local-setup)
- [Development Methodology](#development-methodology)
- [Testing & Quality Assurance](#testing--quality-assurance)
- [Security & Privacy Controls](#security--privacy-controls)
- [Monetization Model](#monetization-model)
- [Team & Roles](#team--roles)
- [License](#license)

---

## Organization & Repositories

HuluRent is organized into three clean layers, accessible as independent repositories or within a unified workspace:

| Layer / Repo | Path | Contains |
|---|---|---|
| **`HuluRent-backend`** | `backend/` | Node.js + Express API, Prisma ORM, PostgreSQL schema, migrations, Socket.IO, backend test suites |
| **`HuluRent-frontend`** | `frontend/` | React 18, Vite web client, TanStack Query, React Router 6, component library |
| **`HuluRent-docs`** | `docs/` | System architecture, functional specs, API reference, deployment guides, presentation assets |

- `https://github.com/HuluRent/HuluRent-backend`
- `https://github.com/HuluRent/HuluRent-frontend`
- `https://github.com/HuluRent/HuluRent-docs`

---

## Overview & Value Proposition

Traditional rental platforms focus on high-capital assets such as real estate and vehicles. There is minimal formal infrastructure for ordinary people who want to monetize unused equipment or rent items locally for short-term needs without buying them.

HuluRent fills this gap with an integrated trust platform:

$$\text{Discovery} + \text{Availability} + \text{Agreements} + \text{Condition Evidence} + \text{Transaction History} + \text{Reputation}$$

HuluRent reduces transactional friction and ambiguity. It empowers users with verified information to make safe trust decisions.

---

## Core Roles & Features

A single user account can seamlessly operate in both capacities:

| Role | Capabilities |
|---|---|
| **Owner** | Create & manage listings, configure custom pricing and blackout dates, approve/reject requests, schedule inspections, sign agreements, upload handoff evidence, review renters |
| **Renter** | Search items with geospatial filtering, submit rental requests, negotiate via chat, attend inspections, sign digital agreements, upload pickup/return condition evidence, submit ratings |
| **Admin** | Review flagged reports, moderate inappropriate listings, apply account restrictions, inspect audit trails |

### Core MVP Features
- **User Accounts & Identity Verification**: Secure auth (JWT) with identity verification status.
- **Catalogue & Geospatial Search**: Categorized listings with distance-based discovery (`approxLocation` privacy protection).
- **Dual-Layer Overlap Prevention**: Booking conflict checks at app-level (row locks) and database-level (PostgreSQL exclusion constraint).
- **Digital Rental Agreements**: Versioned terms and liability clauses signed cryptographically by both parties.
- **Physical Inspections**: Pre-rental appointment scheduling and confirmation.
- **Condition Documentation**: Multi-photo condition evidence with notes at pickup and return.
- **Real-Time Messaging**: Transaction-linked chat powered by WebSockets (Socket.IO).
- **Two-Sided Reviews**: Verified ratings and feedback restricted to completed bookings.
- **Moderation & Audit**: Comprehensive audit logging and admin moderation queue.

---

## Explicit Scope Boundaries

HuluRent is a peer-to-peer transaction platform and digital record layer, **not**:
- An insurance underwriter (no automatic compensation for damage or theft).
- A private arbitration service (users retain civil recourse using platform records).
- A delivery logistics provider (physical handoff is coordinated between parties).
- A continuous location tracker (exact physical coordinates are never tracked or shared).

Rentals conducted outside the recorded platform workflow fall outside HuluRent dispute-support and evidence protections. See [`product/trust-and-liability.md`](product/trust-and-liability.md).

---

## Tech Stack

| Layer | Technology | Key Libraries |
|---|---|---|
| **Frontend** | React 18 + Vite | React Router 6, TanStack Query, Axios, Lucide Icons |
| **Backend** | Node.js + Express | Prisma ORM, Socket.IO, Zod, Bcrypt, JsonWebToken, Multer |
| **Database** | PostgreSQL 15+ | `btree_gist` extension for exclusion constraints |
| **Storage** | Object Storage / Disk | Multi-image listing and condition evidence storage |
| **Testing** | Vitest & Supertest | Unit, integration, and end-to-end lifecycle test runners |

---

## Rental Lifecycle

```
[LIST] ──> [SEARCH & DISCOVER] ──> [CHECK AVAILABILITY] ──> [REQUEST BOOKING]
                                                                   │
[CONFIRM AGREEMENT] <── [INSPECT ITEM (Opt.)] <── [ACCEPT REQUEST] <┘
         │
         ▼
[PICKUP EVIDENCE] ──> [ACTIVE RENTAL] ──> [RETURN EVIDENCE] ──> [COMPLETE] ──> [TWO-SIDED REVIEW]
```

**Booking State Machine:**
`REQUESTED` $\rightarrow$ `ACCEPTED` $\rightarrow$ `CONFIRMED` $\rightarrow$ `ACTIVE` $\rightarrow$ `RETURN_PENDING` $\rightarrow$ `COMPLETED`  
*(Terminal / Alternative States: `REJECTED`, `CANCELLED`, `EXPIRED`, `DISPUTED`)*

---

## Documentation Index

| Issue ID | Document | Path | Purpose |
|---|---|---|---|
| **`[DOC-01]`** | **Project Overview & README** | [`README.md`](README.md) | High-level project summary, architecture index, team roles |
| **`[DOC-02]`** | **Open Source License** | [`LICENSE.md`](LICENSE.md) | MIT License terms and INSA copyright notice |
| **`[DOC-03]`** | **Contribution Guidelines** | [`CONTRIBUTING.md`](CONTRIBUTING.md) | Branching strategy, commit conventions, PR workflows |
| **`[DOC-04]`** | **Pitch Deck Outline** | [`presentation/pitch-deck-outline.md`](presentation/pitch-deck-outline.md) | Executive pitch structure, problem, solution, market size, demo |
| **`[DOC-05]`** | **Judge Q&A Preparation** | [`presentation/judge-qa-prep.md`](presentation/judge-qa-prep.md) | Deep-dive answers for competition judges (architecture, security, trust) |
| **`[DOC-06]`** | **Local Setup Guide** | [`guides/local-setup.md`](guides/local-setup.md) | Step-by-step developer setup (Node, Postgres, Prisma, Docker) |
| **`[DOC-07]`** | **Product & Functional Spec** | [`product/spec.md`](product/spec.md) | User personas, stories, functional requirements, state rules |
| **`[DOC-08]`** | **Testing Strategy** | [`technical/testing-strategy.md`](technical/testing-strategy.md) | Unit, integration, E2E, concurrency, and security test plans |
| **`[DOC-09]`** | **Limitations & Roadmap** | [`product/limitations-and-future.md`](product/limitations-and-future.md) | Known MVP boundaries and future roadmap (boosts, IoT lockers) |
| **`[DOC-10]`** | **Installation & Usage Guide** | [`guides/installation-and-usage.md`](guides/installation-and-usage.md) | Evaluation guide for submission examiners with test accounts |
| **`[DOC-11]`** | **Screenshots & Walkthrough** | [`presentation/demo-walkthrough.md`](presentation/demo-walkthrough.md) | Interactive demo script, user walkthrough, UI flows |
| **`[DOC-12]`** | **API Reference** | [`technical/api-reference.md`](technical/api-reference.md) | Complete REST API contract, WebSocket specs, status codes |
| — | **System Architecture** | [`ARCHITECTURE.md`](ARCHITECTURE.md) | Modular monolith architecture, folder trees, DB layer |
| — | **Trust & Liability Model** | [`product/trust-and-liability.md`](product/trust-and-liability.md) | Off-platform policy, evidence model, liability framework |
| — | **14-Day Schedule** | [`planning/schedule.md`](planning/schedule.md) | Milestone schedule, day-by-day plan, scope contingency |
| — | **Prisma Database Schema** | [`prisma/schema.prisma`](prisma/schema.prisma) | Canonical PostgreSQL data models, relations, indices |
| — | **Manual Overlap Migration** | [`booking_overlap_constraint.sql`](booking_overlap_constraint.sql) | PostgreSQL exclusion constraint migration script |

---

## Getting Started & Local Setup

```bash
# 1. Clone repository
git clone https://github.com/HuluRent/HuluRent-main.git
cd HuluRent-main

# 2. Setup Backend
cd backend
npm install
cp .env.example .env
docker-compose up -d db
npx prisma migrate dev
node prisma/seed.js
npm run dev

# 3. Setup Frontend (in a new terminal)
cd ../frontend
npm install
cp .env.example .env
npm run dev
```

For complete step-by-step configuration, see [`guides/local-setup.md`](guides/local-setup.md).

---

## Development Methodology

Agile development organized into 6 core phases:
1. **Phase 1: Foundation**: Monorepo scaffolding, auth, JWT, Prisma schema, DB migrations.
2. **Phase 2: Marketplace**: Category management, listing CRUD, photo uploads, search & filtering.
3. **Phase 3: Rental Lifecycle**: Booking state machine, conflict prevention, acceptance/rejection flow.
4. **Phase 4: Transaction Layer**: Agreements, inspections, WebSockets, condition evidence documentation.
5. **Phase 5: Trust & Governance**: Reviews, reporting, admin moderation, immutable audit trail.
6. **Phase 6: Integration & Release**: End-to-end integration, performance tuning, demo preparation.

---

## Testing & Quality Assurance

- **Unit Testing**: Tests domain logic in isolation (availability rules, pricing calculations, state transitions).
- **Integration Testing**: Validates API endpoints, database interactions, auth guards, and validation errors.
- **Concurrency Testing**: Verifies that parallel booking requests cannot double-book overlapping dates.
- **Security Testing**: OWASP top 10 verification, role authorization, rate limiting, and ownership protection.

Run backend tests: `cd backend && npm test`  
Run frontend tests: `cd frontend && npm test`  
See [`technical/testing-strategy.md`](technical/testing-strategy.md) for full details.

---

## Security & Privacy Controls

- **Data Minimization**: Approximate location strings are displayed publicly; exact coordinates remain private.
- **Password Security**: Salted Bcrypt password hashing (`shared/utils/password.js`).
- **Identity Privacy**: Verification stores validation status ("VERIFIED"), never raw identity documents.
- **Access Control**: Enforced at route boundaries using `authenticate`, `authorize`, and `ownershipGuard`.
- **Immutable Auditing**: Critical moderation and state actions write immutable records to `AuditEvent`.

---

## Monetization Model

In the MVP stage, HuluRent operates free of transaction fees to accelerate network liquidity.

Long-term monetization is structured around **Paid Visibility Boosts** (sponsored listing placements in category browsing and search results). See [`product/trust-and-liability.md`](product/trust-and-liability.md) §4.

---

## Team & Roles

Developed for the **Information Network Security Administration (INSA) CTC Program**.

| Name | Role | CTC ID | Primary Responsibilities |
|---|---|---|---|
| **Kaleab Araya** | **Team Leader / Backend Engineer** | `CTC-140-26` | Overall system architecture, database modeling, conflict prevention, E2E integration |
| **Hawlet Romedan Yesuf** | **System arcthect and frontend engineer** | `CTC-3877-26` | Authentication, user management, booking state machine, PostgreSQL constraints |
| **Mahlet Getnet** | **Frontend Engineer (UI/UX & Core Features)** | `CTC-1238-26` | Responsive design system, listing flows, booking UI, state management |
| **Leoul Zerihun** | **Backend / Security & DevOps Engineer** | `CTC-3644-26` | Digital agreements, condition evidence upload, audit logging, Docker setup |
| **Makbel Temesgen** | **Frontend Engineer and presentation** | `CTC-1418-26` | Geospatial search UI, real-time messaging, reviews, automated testing |

---

## License

This project is licensed under the **MIT License**. See [`LICENSE.md`](LICENSE.md) for full legal text.