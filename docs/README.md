<<<<<<< HEAD
# HuluRent

**A hyper-local peer-to-peer rental marketplace and digital trust layer.**

HuluRent lets people rent out physical items they already own — cameras, tools, camping gear, event equipment, appliances — to nearby users who need them temporarily. It provides the structure that informal borrowing lacks: listings, availability, agreements, condition evidence, transaction history, and reputation.

> An item sitting unused by one person can be useful to another person for a limited period of time.

## INSA CTC Student Details

| | |
|---|---|
| **Project Title** | HuluRent |
| **Classroom Number** | Block 57 3-004 |
| **Collaborator Handle** | `insa-ctc-devhub` |

**Team**
- Hawlet Romedan - CTC-3877-26
- Kalab Araya — CTC-140-26
- Leoul Zerihun — CTC-3644-26
- Mahlet Getinet — CTC-1238-26
- Makbel Temesgen — CTC-1418-26

---
=======
# HuluRent Documentation

**A hyper-local peer-to-peer rental marketplace and digital trust layer.**

HuluRent enables individuals to safely rent out physical items they own — cameras, tools, camping gear, event equipment, appliances — to nearby users who need them temporarily. It provides the digital infrastructure that informal borrowing lacks: item listings, availability calendars, binding digital agreements, timestamped condition evidence, transaction history, and two-sided reputation.

Lives in: **`hulurent-docs`** (`README.md`)  
Reference Issue: **`[DOC-01]`** (Team section & comprehensive documentation index)

>>>>>>> docs
---

## Table of Contents

<<<<<<< HEAD
- [Overview](#overview)
- [Core Concept](#core-concept)
- [Features (MVP Scope)](#features-mvp-scope)
- [Explicitly Out of Scope](#explicitly-out-of-scope)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Rental Lifecycle](#rental-lifecycle)
- [Repository Structure](#repository-structure)
- [Documentation](#documentation)
- [Getting Started](#getting-started)
- [Development Methodology](#development-methodology)
- [Testing](#testing)
- [Security & Privacy](#security--privacy)
- [Monetization](#monetization)
- [Team](#team)
=======
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
>>>>>>> docs
- [License](#license)

---

<<<<<<< HEAD
## Overview

Traditional rental platforms focus on established categories — cars, houses, commercial equipment. There's little infrastructure for ordinary people who want to rent out their own belongings, or who need something for a day and don't want to buy it, ask around, or trust an informal handshake deal.

HuluRent fills that gap with a structured marketplace built around:

**Discovery + Communication + Agreements + Condition Evidence + Transaction History + Reputation**

It reduces ambiguity without pretending to eliminate all risk. HuluRent gives users better information to make trust decisions — it doesn't replace trust itself.

## Core Concept

Two roles, one account type:

| Role | Can do |
|---|---|
| **Owner** | Create listings, set prices & availability, accept/reject requests, arrange handoffs, document condition, review renters |
| **Renter** | Search & filter items, request rentals, arrange inspections, document pickup/return, review owners |

A single user can act as both.

## Features (MVP Scope)

- User accounts, profiles, identity-verification status
- Item listings with categories, photos, pricing, availability
- Location-aware search and filtering
- Rental requests and owner approval flow
- Booking with conflict prevention (no double-booking)
- Transaction-linked chat
- Inspection appointments
- Digital rental agreements (versioned, acknowledged by both parties)
- Pickup and return condition documentation (photos, notes, timestamps)
- Rental history, reviews, and ratings
- Reporting, listing moderation, account restrictions

## Explicitly Out of Scope

HuluRent is a marketplace and transaction-recording platform — not:

- An insurer (no automatic compensation for damage/theft)
- A legal arbitration service (no determination of private liability)
- An escrow institution (no custody of disputed funds)
- A delivery service (handoff is arranged by the parties)
- A smart-locker network *(future possibility)*
- A blockchain platform
- An AI pricing engine (owners set their own prices)
- A continuous location tracker

Rentals or handoffs conducted **outside** the recorded HuluRent flow (agreement, pickup/return evidence) fall outside the platform's dispute-support and evidence protections. This is a deliberate design choice, not an oversight — see [`docs/product/trust-and-liability.md`](docs/product/trust-and-liability.md).

## Tech Stack

| Layer | Choice |
|---|---|
| Client | Flutter (mobile/web, single codebase) |
| API | REST, with WebSocket for real-time messaging |
| Backend | Modular monolith (single deployable, domain-separated modules) |
| Database | PostgreSQL |
| File/Media Storage | Object storage (images, evidence) — metadata only in Postgres |
| Auth | Server-side authorization, role-based (Standard User / Administrator) |

**Why a modular monolith?** Simpler deployment, faster iteration within the project timeline, easier debugging — with clear module boundaries so it can be split into services later if scale demands it. See [`docs/technical/architecture.md`](docs/technical/architecture.md).

## Architecture

```
                    HuluRent Client
                  Flutter Mobile/Web
                          │
                          │ HTTPS
                          ▼
                     REST API (+ WebSocket)
                          │
              ┌───────────┴───────────┐
              │    Application Core    │
              │                        │
              │ Authentication         │
              │ Users & Profiles       │
              │ Listings & Search      │
              │ Bookings               │
              │ Agreements             │
              │ Messaging              │
              │ Evidence               │
              │ Reviews                │
              │ Reports & Admin        │
              └───────────┬───────────┘
                          │
                ┌─────────┴─────────┐
                ▼                   ▼
           PostgreSQL          Object Storage
            Database          Images / Evidence
```

Business-critical rules (booking validation, ownership checks, pricing) live entirely on the backend — the client handles presentation and interaction only, so nothing can be bypassed by modifying client-side behavior.
=======
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
>>>>>>> docs

## Rental Lifecycle

```
<<<<<<< HEAD
List → Discover → Check Availability → Communicate → Request → Accept
  → Book → Arrange Handoff → Inspect → Agree → Pickup → Rent → Return
  → Complete → Review
```

**Booking states:**

```
REQUESTED → ACCEPTED → CONFIRMED → ACTIVE → RETURN_PENDING → COMPLETED
                  (also: REJECTED · CANCELLED · EXPIRED · DISPUTED)
```

MVP completion is defined as: a user can carry an item from `Create Account` through `Review Submitted` reliably, end to end. Additional features do not delay this primary flow.

## Repository Structure

```
huluRent/
├── mobile/                 # Flutter client
├── backend/                # API + business logic (modular monolith)
│   ├── auth/
│   ├── users/
│   ├── listings/
│   ├── bookings/
│   ├── agreements/
│   ├── messaging/
│   ├── evidence/
│   ├── reviews/
│   └── admin/
├── docs/
│   ├── product/             # Product & functional specification, trust model
│   ├── technical/           # Architecture, DB schema, API design
│   ├── planning/            # Schedule, phases, MVP criteria
│   └── presentation/        # Pitch deck, judge Q&A prep
└── README.md
```

## Documentation

| Doc | Purpose |
|---|---|
| [`docs/product/spec.md`](docs/product/spec.md) | Full product & functional specification |
| [`docs/technical/proposal.md`](docs/technical/proposal.md) | Full technical proposal (architecture, DB, security) |
| [`docs/technical/db-schema.md`](docs/technical/db-schema.md) | Entity relationships and constraints |
| [`docs/planning/schedule.md`](docs/planning/schedule.md) | 14-day implementation schedule |
| [`docs/product/trust-and-liability.md`](docs/product/trust-and-liability.md) | Off-platform handoff policy, evidence & liability model |

## Getting Started

> Fill in once the repo scaffolding lands (Days 1–2 of the schedule).

```bash
# Backend
cd backend
# install deps, configure .env, run migrations, start dev server

# Mobile
cd mobile
flutter pub get
flutter run
```

Sensitive configuration (DB credentials, API keys, secrets) is provided via environment variables and **must never be committed**.

## Development Methodology

Agile, short iterations, organized by functional module rather than isolated screens. Each completed module is integrated into the working app as early as possible — no waiting until the final days to combine work.

| Phase | Focus |
|---|---|
| 1 — Foundation | Repo, backend init, DB schema, auth |
| 2 — Marketplace | Categories, listings, images, search, availability |
| 3 — Rental Lifecycle | Requests, approval, booking, conflict prevention |
| 4 — Transaction Layer | Messaging, inspection, agreements, evidence |
| 5 — Trust & Governance | Reviews, reports, moderation, audit records |
| 6 — Integration & Release | E2E + security testing, UI polish, deployment, demo prep |

**Hard deadline: August 24, 2026.** See [`docs/planning/schedule.md`](docs/planning/schedule.md) for the day-by-day breakdown.

## Testing

- **Unit** — availability validation, booking rules, state transitions, authorization, pricing, input validation
- **Integration** — API ↔ DB, auth ↔ authorization, listings ↔ availability, bookings ↔ agreements/evidence, reviews ↔ completed transactions
- **End-to-end** — the full rental lifecycle, register through review submission
- **Security** — unauthorized access, invalid auth, privilege escalation, invalid bookings, file-upload vulnerabilities, cross-user evidence access, admin authorization

## Security & Privacy

- Data minimization and purpose limitation throughout
- Passwords hashed, HTTPS/TLS everywhere, server-side authorization on every write
- Listings show **approximate location** (e.g. "Bole · ~2.4 km away") — exact addresses are never publicly exposed
- Identity verification stores a **result** ("Identity Verified"), not the underlying documents; other users never see another user's ID
- Evidence (pickup/return photos, condition notes) is access-controlled, encrypted at rest, and transaction-linked — described as timestamped and audit-linked, not "tamper-proof"
- Informed by OWASP guidance and relevant ISO/IEC privacy principles

## Monetization

HuluRent does not take a transaction fee. Listing is free; owners can optionally pay for **boosted visibility** (e.g. a daily/monthly promotion tier) to surface their items higher in search and discovery. This keeps supply-side friction at zero — critical for solving cold start — while giving the platform a low-liability revenue stream that doesn't require custodying rental payments.

Because there's no take rate, off-platform arrangement isn't a direct revenue leak — it's addressed instead through the value users forgo (evidence, agreements, dispute support) by transacting outside the recorded flow. See [`docs/product/trust-and-liability.md`](docs/product/trust-and-liability.md) for the full reasoning.



## License

TBD.
=======
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
>>>>>>> docs
