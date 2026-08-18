# HuluRent — Judge Q&A Preparation Guide

Lives in: **`hulurent-docs`** (`presentation/judge-qa-prep.md`)  
Reference Issue: **`[DOC-05]`** (Write judge Q&A prep doc)  
Audience: **INSA CTC Evaluation Committee & Technical Judges**

This document provides rigorous, technical, and strategic answers to anticipated questions from competition judges regarding architecture, security, concurrency, business model, and legal liability.

---

## 1. Technical & Architectural Questions

### Q1: "How do you guarantee that two users cannot double-book the same item for overlapping dates in a high-concurrency race condition?"
> **Answer**:  
> We employ a **dual-layer overlap defense**:
> 1. **Application-Level Row Lock**: In `bookings.conflict-check.js`, every booking creation and confirmation runs inside an interactive Prisma database transaction. We lock the target item's active booking records using `SELECT ... FOR UPDATE` and verify that `startDate < existing.endDate AND endDate > existing.startDate`. If an overlap is detected, an explicit `ConflictError (409)` is thrown with a clear client message.
> 2. **Database-Level Exclusion Constraint**: As an infallible backstop against application bugs or distributed race conditions, we enforce a PostgreSQL GiST exclusion constraint (`EXCLUDE USING gist ("itemId" WITH =, tsrange("startDate", "endDate") WITH &&)` for statuses `IN ('CONFIRMED', 'ACTIVE')`). If a duplicate slip occurs, PostgreSQL raises an `exclusion_violation`, which our backend catches and maps to the identical 409 error envelope.

### Q2: "Why choose a Modular Monolith instead of Microservices for this project?"
> **Answer**:  
> For a 14-day rapid build by a 5-person team, microservices introduce distributed system failure modes (network latency, distributed transactions, cross-service auth overhead, complex deployment orchestration) with no initial scalability benefit.  
> Our **modular monolith** strictly isolates business logic into 17 distinct domain modules using a 4-layer architecture (`routes → controller → service → repository`). Modules communicate via internal service boundaries. This delivers rapid development and immediate in-memory transactions today, while maintaining clean domain boundaries that can be extracted into standalone microservices when traffic scale demands it.

### Q3: "How do you protect user location privacy while enabling geographic discovery?"
> **Answer**:  
> We enforce **Data Minimization and Approximate Geolocation**:
> - Exact latitude and longitude coordinates are stored securely in the database and are **never** returned in public API listing responses.
> - The backend calculates the Haversine distance between the searching user and the item, returning an approximate label (e.g., `"Bole · ~2.4 km away"`) and a computed `distanceKm` float.
> - Exact physical addresses and pickup locations are only shared via the private, transaction-linked chat after the booking has been approved.

### Q4: "How is condition evidence stored and protected against tampering?"
> **Answer**:  
> - Multi-photo condition uploads at pickup and return are processed through `evidence.upload.js` with strict MIME-type checking and file size limits before being persisted to object storage.
> - The database stores immutable metadata (`Evidence` model) with foreign keys to `bookingId` and `submittedById`.
> - Crucially, our schema enforces that condition photos cannot be edited or deleted after submission. Both parties must review and acknowledge the condition record (`PATCH /api/evidence/:id/acknowledge`), creating a two-party verified timestamped baseline.

---

## 2. Product, Trust & Legal Liability Questions

### Q5: "What prevents users from meeting up and transacting offline to bypass your platform?"
> **Answer**:  
> - HuluRent charges **0% transaction fee** in our MVP. Unlike take-rate marketplaces (e.g., Airbnb, Uber), off-platform transactions do not cause a revenue leak.
> - Users who transact offline **forfeit all platform protections**: they have no binding digital agreement, no timestamped condition evidence photos, no verified dispute records, and receive no reputation credit.
> - Our user research shows that the primary barrier in P2P rentals is *fear of property loss or damage*. The platform's value proposition is trust and legal evidence, giving users a direct personal incentive to record the transaction on-platform.

### Q6: "What happens if a renter damages or refuses to return an item?"
> **Answer**:  
> - **Platform Positioning**: HuluRent is a digital transaction-recording platform, not an insurance underwriter or private court.
> - When damage or theft occurs, the owner has a complete, legally robust audit trail:
>   1. Digital Rental Agreement signed by both parties with explicit permitted-use terms and liability clauses.
>   2. High-resolution pickup condition photos acknowledged by the renter before taking possession.
>   3. Timestamped return condition photos proving new damage.
>   4. Full transaction chat logs.
> - This structured evidence package provides indisputable documentation for local police reports, insurance claims, or civil court claims under Ethiopian law.

### Q7: "How do you prevent fake reviews and rating manipulation?"
> **Answer**:  
> We enforce a **closed-loop review model**:
> - Reviews cannot be posted freely on user profiles. The API endpoint (`POST /api/reviews`) strictly verifies that the caller was a participant on a booking whose status is `COMPLETED`.
> - The database enforces `@@unique([bookingId, authorId])`, ensuring that each party can submit exactly one review per completed rental transaction.

---

## 3. Business & Monetization Questions

### Q8: "How will HuluRent monetize if listings and transactions are free?"
> **Answer**:  
> We utilize a **Paid Visibility Boost** model (sponsored listing placements), which is intentionally scheduled for post-MVP rollout:
> - In early stages, marketplace liquidity (lots of items and active renters) is the critical success factor. Charging fees creates friction that kills early network effects.
> - Once organic transaction volume is established, item visibility in search results and category browsing becomes scarce and valuable. Owners pay small daily/weekly fees to boost their items to the top of search rankings.
> - Future expansion includes optional deposit escrow holds (partnering with Telebirr / Chapa) and premium commercial merchant dashboards.

### Q9: "How does identity verification work in the Ethiopian context?"
> **Answer**:  
> In our MVP, users submit verification references (such as Fayda National ID, Kebele ID, or Passport references) via `POST /api/identity-verification`. The system tracks status as `PENDING`, `VERIFIED`, or `REJECTED`. In our production roadmap, this hooks directly into the **Fayda e-KYC API** for real-time biometric and credential verification.
