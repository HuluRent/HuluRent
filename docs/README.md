# HuluRent Documentation

**A hyper-local peer-to-peer rental marketplace and digital trust layer.**

HuluRent enables individuals to safely rent out physical items they own — cameras, tools, camping gear, event equipment, appliances — to nearby users who need them temporarily. It provides the digital infrastructure that informal borrowing lacks: item listings, availability calendars, binding digital agreements, timestamped condition evidence, transaction history, and two-sided reputation.

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

## Getting Started

```bash
# 1. Setup Backend
cd backend
npm install
cp .env.example .env
docker-compose up -d db
npx prisma migrate dev
node prisma/seed.js
npm run dev

# 2. Setup Frontend (in a new terminal)
cd frontend
npm install
cp .env.example .env
npm run dev
```

For complete step-by-step configuration, see [`guides/local-setup.md`](guides/local-setup.md).

---

## Testing & Quality Assurance

- Run backend tests: `cd backend && npm test`  
- Run frontend tests: `cd frontend && npm test`  
See [`technical/testing-strategy.md`](technical/testing-strategy.md) for full details.

---

## Security & Privacy Controls

- **Data Minimization**: Approximate location strings are displayed publicly; exact coordinates remain private.
- **Password Security**: Salted Bcrypt password hashing (`shared/utils/password.js`).
- **Access Control**: Enforced at route boundaries using `authenticate`, `authorize`, and `ownershipGuard`.
- **Immutable Auditing**: Critical moderation and state actions write immutable records to `AuditEvent`.

---

## Team & Roles

Developed for the **Information Network Security Administration (INSA) CTC Program**.

| Name                     | Role                                                   | Primary Responsibilities                                                                                                                         |
| ------------------------ | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Mahlet Getnet**        | **Team Leader / System Architect & Frontend Engineer** | Overall system architecture, technical coordination, frontend architecture, UI/UX, core frontend features, API integration, and state management |
| **Hawlet Romedan Yesuf** | **Frontend Support & Documentation**                   | Frontend support, authentication and user management interfaces, documentation, and technical specifications                                     |
| **Kaleab Araya**         | **Backend Engineer**                                   | Database modeling, backend services, conflict prevention, and E2E integration                                                                    |
| **Leoul Zerihun**        | **Backend / Security & DevOps Engineer**               | Backend services, digital agreements, evidence handling, security, audit logging, and Docker setup                                               |
| **Makbel Temesgen**      | **Frontend Support & Presentation**                    | Frontend support, geospatial search UI, messaging, reviews, automated testing, and project presentation                                          |

## License

This project is licensed under the **MIT License**. See [`LICENSE.md`](LICENSE.md) for full legal text.