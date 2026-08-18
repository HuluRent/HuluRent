# HuluRent — Installation & Examiner Usage Guide

---

## 1. Executive Evaluation Overview

This guide enables examiners to install, execute, and verify the full HuluRent application end-to-end within 5 minutes.

---

## 2. 4-Step Quickstart Installation

### Step 1: Clone & Configure
```bash
git clone https://github.com/HuluRent/HuluRent-main.git
cd HuluRent-main
```

### Step 2: Boot Backend & Database
```bash
cd backend
npm install
cp .env.example .env
docker-compose up -d db
npx prisma migrate dev
node prisma/seed.js
npm run dev
```
*Backend runs on `http://localhost:3000`.*

### Step 3: Boot Frontend Web Client
In a separate terminal tab:
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 3. Evaluation User Credentials

The database is pre-seeded with 3 fully configured test accounts:

| Role | Email | Password | Pre-seeded State |
|---|---|---|---|
| **Renter Account** | `renter@hulurent.com` | `Renter123!` | Identity verified; ready to search and rent |
| **Owner Account** | `owner@hulurent.com` | `Owner123!` | Active listings for Camera, Power Drill, Camping Tent |
| **Administrator** | `admin@hulurent.com` | `Admin123!` | Full admin privileges; access to reports queue and audit logs |

---

## 4. Step-by-Step Examiner Walkthrough Script

### Flow A: The Renter Journey
1. Open `http://localhost:5173` in a standard browser window.
2. Click **Login** and sign in with `renter@hulurent.com` / `Renter123!`.
3. On the homepage, explore the **Featured Listings** or use the search bar to search for `"Sony"`.
4. Click on the **Sony A7 IV Camera** listing.
5. In the booking widget, select rental dates (e.g. 3 days starting tomorrow) and click **Request Booking**.
6. You will be redirected to the **Booking Detail Page** showing `Status: REQUESTED`.

### Flow B: The Owner Journey (Use Incognito Window)
1. Open a new **Incognito / Private Window** and navigate to `http://localhost:5173`.
2. Log in with `owner@hulurent.com` / `Owner123!`.
3. Navigate to **My Bookings** from the navbar menu.
4. Open the newly received booking request and click **Accept Request**.
5. The booking transitions to `ACCEPTED`.
6. Open the **Digital Agreement Tab**, review terms, and click **Sign Agreement as Owner**.

### Flow C: Finalizing the Rental & Condition Documentation
1. Return to the Renter's window: refresh and click **Sign Agreement as Renter**.
2. With both signatures recorded, the booking transitions to `CONFIRMED`.
3. Open the **Condition Documentation Tab**:
   - Upload 1–2 test photos for **Pickup Condition** and add a note (*"Tested and working perfectly"*).
   - Click **Submit Pickup Evidence** $\rightarrow$ booking transitions to `ACTIVE`.
4. At the end of the rental period:
   - Upload test photos for **Return Condition** and click **Submit Return Evidence** $\rightarrow$ transitions to `RETURN_PENDING`.
5. In the Owner window: verify return photos and click **Complete Booking** $\rightarrow$ transitions to `COMPLETED`.
6. Both parties can now submit mutual **5-star reviews and comments**.

### Flow D: Administrator Moderation & Audit Trail
1. Log in as `admin@hulurent.com` / `Admin123!`.
2. Navigate to `/admin` to view the **Admin Dashboard**.
3. Inspect user accounts, review pending moderation reports, and view immutable **Audit Events**.

---

## 5. Verification Commands

```bash
# Run backend test suite (unit + integration + state machine)
cd backend && npm test

# Run frontend test suite
cd frontend && npm test
```
