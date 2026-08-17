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
- Kalab Araya — CTC-140-26
- Leoul Zerihun — CTC-3644-26
- Mahlet Getinet — CTC-1238-26
- Makbel Temesgen — CTC-1418-26

---
---

## Table of Contents

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
- [License](#license)

---

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

## Rental Lifecycle

```
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