# HuluRent — Pitch Deck Outline

Program: **INSA CTC Software Development Program**  
Presentation Duration: **7–10 Minutes + Q&A**

---

## Slide 1: Title & Vision
- **Header**: HuluRent — The Hyper-Local Peer-to-Peer Rental Marketplace & Digital Trust Layer
- **Subtitle**: Monetizing idle assets through verified trust, binding agreements, and condition evidence.
- **Presenter Team**:
  - Kaleab Araya (Team Lead / Architect)
  - Hawlet Romedan (Backend Engineer)
  - Mahlet Getnet (Frontend Engineer)
  - Leoul Zerihun (Security & DevOps)
  - Makbel Temesgen (QA & Integration)
- **Tagline**: *"Why buy what you only need for a day? Why store what can earn for a lifetime?"*

---

## Slide 2: The Problem
1. **Asset Inefficiency**: Millions of high-value tools, cameras, camping equipment, and event gear sit idle in urban homes >95% of the year.
2. **High Friction & Acquisition Cost**: Buying specialty equipment for one-off use is financially wasteful for students, freelancers, and small businesses.
3. **The "Trust Barrier" in Informal Lending**: Informal borrowing between acquaintances leads to disputes over damage, late returns, and unclear terms without written records or evidence.
4. **Market Void in Ethiopia**: Traditional rental platforms only serve cars and real estate. Ordinary people have no secure platform to monetize physical items.

---

## Slide 3: The Solution — HuluRent
A full-stack, hyper-local marketplace that provides the essential trust infrastructure:
- **Discovery**: Hyper-local search with approximate distance filtering.
- **Real-Time Availability**: Conflict-free scheduling with dual-layer overlap prevention.
- **Binding Digital Agreements**: Dynamic, versioned rental contracts with custom terms and liability disclaimers.
- **Condition Evidence Layer**: Immutable timestamped photo documentation at pickup and return.
- **Two-Sided Reputation**: Verified rating system restricted exclusively to completed transactions.

---

## Slide 4: Target Market & Opportunity
- **Geographic Focus**: Urban centers starting with Addis Ababa (Bole, Kazanchis, CMC, Piassa).
- **Core User Personas**:
  1. **Content Creators & Videographers**: Renting cameras, lenses, lighting, and gimbals.
  2. **DIY Enthusiasts & Contractors**: Power drills, generators, pressure washers, welding kits.
  3. **Outdoor & Event Organizers**: Tents, camping gear, projectors, sound systems.
- **Market Dynamics**: Young, digitally connected urban population with rising demand for flexible access over asset ownership.

---

## Slide 5: The End-to-End User Experience (Demo Flow)
1. **Discover**: Renter searches for "Sony A7 IV Camera" near Bole and checks verified availability.
2. **Request**: Renter selects dates; system locks availability and notifies owner in real time.
3. **Approve & Inspect**: Owner accepts; parties optionally schedule a pre-rental physical inspection.
4. **Sign Digital Agreement**: Both parties review versioned rental terms and sign digitally.
5. **Pickup Documentation**: Renter and owner take timestamped condition photos at handoff.
6. **Return & Complete**: Item returned, condition re-verified, booking completed.
7. **Two-Sided Review**: Both parties submit mutual ratings and feedback.

---

## Slide 6: System Architecture & Technical Highlights
- **Modular Monolith**: Node.js + Express API cleanly layered into `Routes → Controllers → Services → Repositories`.
- **Infallible Overlap Defense**: Dual-layer booking protection combining application-level row locks (`SELECT FOR UPDATE`) with a PostgreSQL `EXCLUDE USING gist` constraint.
- **Location Privacy by Design**: Precise GPS coordinates are kept private; users see approximate neighborhood tags and calculated distances.
- **Real-Time Communication**: WebSocket-powered chat with Socket.IO for real-time negotiation and status updates.

---

## Slide 7: Trust, Liability & Off-Platform Strategy
- **Platform Scope**: HuluRent provides digital transaction recording and verified evidence — not insurance underwriting.
- **Off-Platform Handoff Policy**: HuluRent protections (agreements, condition evidence, dispute records) apply **exclusively** to transactions completed on-platform.
- **Incentive Alignment**: Because HuluRent charges zero transaction fees in MVP, users are incentivized to stay on-platform purely for the legal protection and reputation building.

---

## Slide 8: Monetization Strategy
- **Phase 1 (MVP / Traction)**: 100% Free listings and free transactions to maximize user acquisition and network liquidity.
- **Phase 2 (Post-Traction)**: **Paid Visibility Boosts** (sponsored listing rankings in category browsing and search results).
- **Phase 3 (Enterprise & Partnerships)**: Third-party damage protection add-ons and merchant verification tiers.

---

## Slide 9: Competitive Advantage & Moat
| Feature | Informal Borrowing | Classified Ads (Telegram / Facebook) | HuluRent |
|---|---|---|---|
| **Conflict-Free Booking** | ❌ No | ❌ No | ✅ Automated & Guaranteed |
| **Binding Legal Agreements**| ❌ No | ❌ No | ✅ Digital & Versioned |
| **Pickup/Return Evidence** | ❌ No | ❌ No | ✅ Timestamped Photos |
| **Verified Reputation** | ❌ No | ❌ No | ✅ Closed-Loop Reviews |
| **Location Privacy** | ❌ Exposes Address | ❌ High Risk | ✅ Approximate Geo |

---

## Slide 10: Product Roadmap
- **Q4 2026**: Mobile Applications (React Native for iOS and Android).
- **Q1 2027**: Automated National ID (Fayda) integration for automated KYC.
- **Q2 2027**: Smart IoT Lockers for contactless 24/7 key and equipment handoffs.
- **Q3 2027**: Telebirr and Chapa integrated escrow security deposit holds.

---

## Slide 11: Team & Project Execution
- 5-person multidisciplinary engineering team.
- 14-day rapid delivery under INSA CTC program guidelines.
- Clean separation of concerns with full automated test coverage and comprehensive documentation.

---

## Slide 12: Call to Action & Live Demo
- **Live Demo Presentation**: Executing the 7-minute full rental cycle.
- **Repository Links**:
  - `https://github.com/HuluRent/HuluRent-backend`
  - `https://github.com/HuluRent/HuluRent-frontend`
  - `https://github.com/HuluRent/HuluRent-docs`
- **Open for Questions!**
