# HuluRent — Live Demo Walkthrough Script & UI Flow

Lives in: **`hulurent-docs`** (`presentation/demo-walkthrough.md`)  
Reference Issue: **`[DOC-11]`** (Add screenshots and demo walkthrough)  
Duration: **5–7 Minutes Live Demonstration**  
Setup: **Split-screen browser (Left: Owner Alex, Right: Renter Sara)**

---

## 1. Demo Setup & Persona Roles

```
┌──────────────────────────────────────────────┬──────────────────────────────────────────────┐
│ LEFT SCREEN: Owner (Alex)                    │ RIGHT SCREEN: Renter (Sara)                  │
│ Account: owner@hulurent.com                  │ Account: renter@hulurent.com                 │
│ Goal: Monetize idle camera gear safely       │ Goal: Rent camera gear for a 2-day shoot     │
└──────────────────────────────────────────────┴──────────────────────────────────────────────┘
```

---

## 2. Act-by-Act Walkthrough Script

### Act 1: Discovery & Hyper-Local Search (0:00 – 1:15)
- **Speaker**: *"Let's begin from the perspective of Sara, a videographer looking for equipment near Bole."*
- **Action on Screen**:
  1. Sara opens the HuluRent Homepage (`http://localhost:5173`).
  2. Types `"Sony"` in the search bar with location set to `"Bole"`.
  3. Applies price filters and selects the category **Cameras & Lenses**.
  4. Search results display with approximate distance tags (*"Bole · ~2.1 km away"*).
- **Key Talking Point**: *"Notice our privacy-by-design approach: exact addresses are kept private, but Sara can see approximate neighborhood distances."*

```
┌────────────────────────────────────────────────────────────────────────┐
│  [HuluRent Logo]   Search: [ Sony Camera        ] [All Categories ▼]  │
│  ────────────────────────────────────────────────────────────────────  │
│  Results in Bole (Within 5 km):                                        │
│  ┌─────────────────────────┐  ┌─────────────────────────┐              │
│  │ [Photo: Sony A7 IV]     │  │ [Photo: Canon R6]       │              │
│  │ Sony A7 IV 33MP Camera  │  │ Canon EOS R6 Body       │              │
│  │ ETB 1,500 / day         │  │ ETB 1,800 / day         │              │
│  │ 📍 Bole · ~2.1 km away  │  │ 📍 Kazanchis · ~4.0 km  │              │
│  └─────────────────────────┘  └─────────────────────────┘              │
└────────────────────────────────────────────────────────────────────────┘
```

---

### Act 2: Booking Request & Conflict-Free Scheduling (1:15 – 2:30)
- **Speaker**: *"Sara opens the listing detail page and checks the availability calendar."*
- **Action on Screen**:
  1. Sara selects the date range: **Sept 1st to Sept 3rd**.
  2. The system dynamically computes the total price (3 days × ETB 1,500 = ETB 4,500) and displays the required deposit.
  3. Sara clicks **Request Booking**.
  4. Instant notification alert triggers on Alex's screen via WebSockets.
- **Key Talking Point**: *"Our dual-layer booking lock ensures no overlapping reservation can be accepted for these dates."*

---

### Act 3: Owner Approval & Real-Time Negotiation (2:30 – 3:30)
- **Speaker**: *"Alex receives the request on his dashboard."*
- **Action on Screen**:
  1. Alex reviews Sara's verified profile badge and clicks **Accept Request**.
  2. The booking status transitions from `REQUESTED` to `ACCEPTED`.
  3. Sara opens the transaction-linked chat: *"Hi Alex, does this include the dual-battery charger?"*
  4. Alex replies in real time: *"Yes, charger and a 128GB SD card are included."*

---

### Act 4: Digital Rental Agreement Signing (3:30 – 4:30)
- **Speaker**: *"Before handoff, HuluRent generates a binding, versioned digital agreement."*
- **Action on Screen**:
  1. Both parties view the agreement terms (dates, replacement value, cancellation terms, and off-platform disclaimers).
  2. Alex clicks **Sign Agreement as Owner** (Timestamp recorded).
  3. Sara clicks **Sign Agreement as Renter** (Timestamp recorded).
  4. System validates both signatures and transitions status to `CONFIRMED`.

```
┌────────────────────────────────────────────────────────────────────────┐
│  DIGITAL RENTAL AGREEMENT #AGR-101 (Version 1)                         │
│  ────────────────────────────────────────────────────────────────────  │
│  Item: Sony A7 IV Full-Frame Camera  | Total: ETB 4,500.00             │
│  Deposit: ETB 5,000.00               | Dates: 2026-09-01 to 2026-09-03 │
│                                                                        │
│  Terms & Disclosures:                                                  │
│  1. Permitted Use: General video and photography production.           │
│  2. Off-Platform Clause: HuluRent protections apply solely to          │
│     transactions conducted via the recorded platform workflow.         │
│                                                                        │
│  Owner Signature:  [✓ SIGNED - Alex Abebe (2026-08-18 08:35 UTC)]     │
│  Renter Signature: [✓ SIGNED - Sara Tadesse (2026-08-18 08:36 UTC)]    │
└────────────────────────────────────────────────────────────────────────┘
```

---

### Act 5: Condition Evidence & Handoff (4:30 – 5:30)
- **Speaker**: *"At pickup, condition photos establish an undeniable baseline."*
- **Action on Screen**:
  1. Sara uploads photos of the camera body and sensor, typing: *"Minor cosmetic scratch near tripod mount, sensor spotless."*
  2. Sara submits pickup evidence $\rightarrow$ booking transitions to `ACTIVE`.
  3. At return: return photos are uploaded $\rightarrow$ booking transitions to `RETURN_PENDING`.
  4. Alex inspects the gear and clicks **Complete Booking** $\rightarrow$ `COMPLETED`.

---

### Act 6: Two-Sided Review & Admin Moderation (5:30 – 6:30)
- **Speaker**: *"Finally, both users submit closed-loop reviews, and admins monitor system safety."*
- **Action on Screen**:
  1. Sara rates Alex 5 stars: *"Great gear, smooth handoff!"*
  2. Alex rates Sara 5 stars: *"Returned clean and on time!"*
  3. Switch to Admin account: show the **Admin Moderation Queue** and immutable **Audit Log Table**.

---

## 3. Key Takeaways for Judges
- **Complete Working Lifecycle**: From registration to review submission.
- **Dual-Layer Concurrency Defense**: Prevents all double-bookings.
- **Digital Trust Layer**: Binding contracts + timestamped evidence photos transform peer-to-peer sharing into a secure, viable market.
