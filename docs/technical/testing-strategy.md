# HuluRent — Comprehensive Testing Strategy

---

## 1. Testing Pyramid & Objectives

```
         / \
        / E2E \         Full Rental Lifecycle (Register -> Book -> Complete -> Review)
       /───────\
      /  Integ. \       API Routes, Auth Guards, Database Repositories, Constraints
     /───────────\
    /    Unit     \     State Machines, Pricing Calculators, Geo Utils, Overlap Math
   /───────────────\
```

### Objectives
1. **Zero Double-Bookings**: Verify that conflicting booking requests cannot be committed concurrently.
2. **Strict Authorization**: Verify that unauthorized users cannot mutate listings, bookings, or evidence belonging to other parties.
3. **Data Integrity**: Verify that agreement versions, condition evidence, and audit logs are immutably preserved.
4. **Lifecycle Reliability**: Ensure legal state transitions proceed smoothly across all stages.

---

## 2. Unit Testing Strategy

Unit tests focus on pure functions and isolated service business logic without external network or database dependencies.

### Target Areas
- **`shared/utils/date.js`**: Range overlap calculations (`isRangeOverlapping(a, b)`).
  - *Cases*: Fully overlapping, adjacent (touching start/end without overlap), disjoint ranges.
- **`shared/utils/geo.js`**: Haversine distance calculations and bounding-box formulas.
- **`modules/bookings/bookings.state-machine.js`**:
  - *Cases*: Valid transitions (`REQUESTED → ACCEPTED → CONFIRMED`), invalid transitions (`REQUESTED → COMPLETED` throws error).
- **`modules/agreements/agreement-template.js`**: Generates versioned contract terms and liability disclaimers.

---

## 3. Integration Testing Strategy

Integration tests evaluate Express route handlers, middleware pipelines, and PostgreSQL Prisma queries against a live test database.

### Target Areas
- **Authentication & Middleware**:
  - `POST /api/auth/register` (valid registration $\rightarrow$ `201`, duplicate email $\rightarrow$ `409`).
  - `POST /api/auth/login` (valid credentials $\rightarrow$ `200`, invalid password $\rightarrow$ `401`).
  - Protected routes without JWT $\rightarrow$ `401 Unauthorized`.
  - Admin routes with standard user token $\rightarrow$ `403 Forbidden`.
  - Mutating another user's listing $\rightarrow$ `403 Forbidden` via `ownership-guard.js`.
- **Listings & Geospatial Search**:
  - Filtering by category, price bounds, and latitude/longitude radius.
  - Verification that `DRAFT` listings are hidden from public search.
- **Digital Agreements & Condition Evidence**:
  - Version increments when terms are renegotiated.
  - Multi-photo upload and acknowledgement flags.

---

## 4. Concurrency & Race-Condition Testing

A dedicated test suite validates the dual-layer booking overlap defense:

### Concurrency Test Scenarios
```javascript
describe('Booking Concurrency & Overlap Prevention', () => {
  it('rejects simultaneous booking attempts for the same item over conflicting dates', async () => {
    const item = await createTestItem();
    const dates = {
      startDate: new Date('2026-09-01T09:00:00Z'),
      endDate: new Date('2026-09-05T18:00:00Z')
    };

    // Simulate simultaneous requests from two distinct renters
    const [resA, resB] = await Promise.allSettled([
      requestBooking(renterA, item.id, dates),
      requestBooking(renterB, item.id, dates)
    ]);

    // Exactly one must succeed and the other must receive ConflictError (409)
    const statuses = [resA.value?.status, resB.value?.status];
    expect(statuses).toContain(201);
    expect(statuses).toContain(409);
  });
});
```

---

## 5. Security & Access Control Test Suite

- **SQL / Query Injection**: Verifies Prisma parameterized query safety.
- **XSS & Content Sniffing**: Verifies sanitized input on condition notes and chat messages.
- **File Upload Security**:
  - Rejection of executable extensions (`.exe`, `.sh`, `.php`).
  - Enforcement of file size limits (max 5MB per image).
  - Validation of image MIME types (`image/jpeg`, `image/png`, `image/webp`).

---

## 6. End-to-End (E2E) Lifecycle Test Suite

Validates the complete happy-path lifecycle:
1. **User A** registers as Owner and lists a Camera.
2. **User B** registers as Renter and searches for the Camera nearby.
3. **User B** creates a booking request for Sept 10–12.
4. **User A** accepts the booking request.
5. **Both Users** sign the generated Digital Rental Agreement.
6. Booking transitions to `CONFIRMED`.
7. **User A & B** submit pickup condition photos. Booking transitions to `ACTIVE`.
8. **User A & B** submit return condition photos. Booking transitions to `RETURN_PENDING`.
9. **User A** completes the booking $\rightarrow$ `COMPLETED`.
10. **Both Users** submit 5-star reviews $\rightarrow$ ratings update on respective profiles.

---

## 7. Test Execution Commands

```bash
# Run backend test suite
cd backend
npm test

# Run backend tests with coverage report
npm run test:coverage

# Run frontend test suite
cd frontend
npm test
```
