# HuluRent — API Reference

This document details all RESTful endpoints, query parameters, request/response bodies, status codes, and WebSocket events for the HuluRent platform.

All API routes are served under the base prefix `/api`. For instance, `/auth/login` maps to `http://localhost:3000/api/auth/login`.

---

## 1. Global Conventions & Standards

### 1.1 Response Envelopes
- **Direct Resource Response**: Single-resource endpoints return the JSON payload directly (no nested `{ data: ... }` wrapping).
  ```json
  {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "email": "user@example.com"
  }
  ```
- **Paginated Collection Envelope**: All paginated list endpoints return an items array along with standard pagination metadata:
  ```json
  {
    "items": [ /* resources */ ],
    "page": 1,
    "limit": 20,
    "total": 57
  }
  ```
  Query parameters: `?page=1&limit=20` (defaults: `page=1`, `limit=20`, max `limit=100`).

### 1.2 Error Responses
Errors follow a uniform structure produced by `shared/middleware/error-handler.js`:
```json
{
  "error": {
    "message": "Human-readable explanation of what went wrong",
    "details": "Optional string, object, or array of field validation errors"
  }
}
```

### 1.3 Standard Status Codes
- `200 OK` — Standard successful GET/PATCH request.
- `201 Created` — Successful resource creation (POST).
- `204 No Content` — Successful deletion with no body (DELETE).
- `400 Bad Request` — Schema or input validation failure (`ValidationError`).
- `401 Unauthorized` — Missing, invalid, or expired JWT token (`UnauthorizedError`).
- `403 Forbidden` — Authenticated, but lacking required role or resource ownership (`ForbiddenError`).
- `404 Not Found` — Resource does not exist (`NotFoundError`).
- `409 Conflict` — State conflict, duplicate key, or booking date collision (`ConflictError`).
- `429 Too Many Requests` — Rate limit exceeded (`rate-limiter.js`).
- `500 Internal Server Error` — Unhandled server failure.

### 1.4 Data Types & Headers
- **IDs**: UUID v4 strings (e.g. `"f47ac10b-58cc-4372-a567-0e02b2c3d479"`).
- **Dates**: Strict ISO 8601 strings in UTC (e.g. `"2026-08-20T14:00:00.000Z"`).
- **Financial Values**: Prisma `Decimal` values are serialized as formatted string decimals (e.g. `"150.00"`) to prevent JavaScript floating-point inaccuracies.
- **Authentication Header**: `Authorization: Bearer <jwt_token>`

---

## 2. Health & Diagnostics

### `GET /health`
**Public.** Verifies API status and connectivity.
```json
// 200 OK
{
  "status": "ok"
}
```

---

## 3. Authentication — `/auth`

### `POST /auth/register`
**Public.** Registers a new user account.
```json
// Request
{
  "email": "alex@example.com",
  "password": "StrongPassword123!",
  "displayName": "Alex Abebe",
  "phone": "+251911223344"
}

// 201 Created Response
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "user": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "email": "alex@example.com",
    "displayName": "Alex Abebe",
    "role": "USER"
  }
}
```
*Errors:* `400` if invalid email/password format; `409` if email or phone is already registered.

### `POST /auth/login`
**Public.** Authenticates user credentials.
```json
// Request
{
  "email": "alex@example.com",
  "password": "StrongPassword123!"
}

// 200 OK Response
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "user": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "email": "alex@example.com",
    "displayName": "Alex Abebe",
    "role": "USER"
  }
}
```
*Errors:* `401` on incorrect credentials (deliberately generic message to prevent email enumeration).

### `GET /auth/me`
**Auth required.** Returns session details for the authenticated user.
```json
// 200 OK Response
{
  "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "email": "alex@example.com",
  "displayName": "Alex Abebe",
  "role": "USER",
  "profile": {
    "bio": "Photographer & outdoor enthusiast in Addis",
    "avatarUrl": "https://storage.hulurent.com/avatars/user1.jpg",
    "city": "Addis Ababa"
  },
  "identityVerification": {
    "status": "VERIFIED"
  }
}
```

### `POST /auth/logout`
**Auth required.** Cleans up server-side session / token invalidation.
```json
// 200 OK Response
{
  "success": true
}
```

---

## 4. Users & Profiles — `/users`

### `GET /users/:id`
**Public.** Retrieves public profile for a user (omits email/phone for privacy).
```json
// 200 OK Response
{
  "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "displayName": "Alex Abebe",
  "bio": "Photographer & outdoor enthusiast in Addis",
  "avatarUrl": "https://storage.hulurent.com/avatars/user1.jpg",
  "city": "Addis Ababa",
  "memberSince": "2026-08-14T12:00:00.000Z"
}
```
*Errors:* `404` if user not found.

### `PATCH /users/me`
**Auth required.** Updates profile details for the authenticated user.
```json
// Request (all fields optional)
{
  "displayName": "Alex K. Abebe",
  "bio": "Updated bio text",
  "avatarUrl": "https://storage.hulurent.com/avatars/new.jpg",
  "city": "Bole, Addis Ababa",
  "latitude": 9.0102,
  "longitude": 38.7612
}

// 200 OK Response
{
  "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "email": "alex@example.com",
  "displayName": "Alex K. Abebe",
  "role": "USER",
  "profile": {
    "displayName": "Alex K. Abebe",
    "bio": "Updated bio text",
    "avatarUrl": "https://storage.hulurent.com/avatars/new.jpg",
    "city": "Bole, Addis Ababa",
    "latitude": 9.0102,
    "longitude": 38.7612,
    "updatedAt": "2026-08-18T08:00:00.000Z"
  }
}
```

---

## 5. Identity Verification — `/identity-verification`

### `POST /identity-verification`
**Auth required.** Submits identity documents or national ID reference.
```json
// Request
{
  "provider": "Fayda / National ID",
  "reference": "ET-ID-88291039"
}

// 201 Created Response
{
  "id": "c1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c",
  "status": "PENDING",
  "provider": "Fayda / National ID",
  "reference": "ET-ID-88291039",
  "createdAt": "2026-08-18T08:00:00.000Z"
}
```

### `GET /identity-verification/me`
**Auth required.** Checks verification status.
```json
// 200 OK Response
{
  "status": "VERIFIED",
  "verifiedAt": "2026-08-18T09:00:00.000Z"
}
```

---

## 6. Categories — `/categories`

### `GET /categories`
**Public.** Retrieves the complete category taxonomy tree.
```json
// 200 OK Response
{
  "items": [
    {
      "id": "e0b82f9d-1111-2222-3333-444455556666",
      "name": "Cameras & Lenses",
      "slug": "cameras-and-lenses",
      "parentId": null
    },
    {
      "id": "a1b2c3d4-2222-3333-4444-555566667777",
      "name": "Power Tools",
      "slug": "power-tools",
      "parentId": null
    }
  ]
}
```

---

## 7. Listings — `/listings`

### `POST /listings`
**Auth required.** Creates a new item listing in `DRAFT` status.
```json
// Request
{
  "categoryId": "e0b82f9d-1111-2222-3333-444455556666",
  "name": "Sony A7 IV Full-Frame Camera + 24-70mm Lens",
  "description": "Professional 33MP mirrorless camera in mint condition.",
  "pricePerUnit": "1500.00",
  "pricingUnit": "day",
  "depositAmount": "5000.00",
  "latitude": 9.0102,
  "longitude": 38.7612,
  "approxLocation": "Bole, near Edna Mall"
}

// 201 Created Response
{
  "id": "8fa12345-6789-abcd-ef01-234567890abc",
  "ownerId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "categoryId": "e0b82f9d-1111-2222-3333-444455556666",
  "name": "Sony A7 IV Full-Frame Camera + 24-70mm Lens",
  "description": "Professional 33MP mirrorless camera in mint condition.",
  "pricePerUnit": "1500.00",
  "pricingUnit": "day",
  "depositAmount": "5000.00",
  "approxLocation": "Bole, near Edna Mall",
  "status": "DRAFT",
  "images": [],
  "createdAt": "2026-08-18T08:15:00.000Z"
}
```

### `GET /listings/:id`
**Public.** Retrieves full listing details.
```json
// 200 OK Response
{
  "id": "8fa12345-6789-abcd-ef01-234567890abc",
  "name": "Sony A7 IV Full-Frame Camera + 24-70mm Lens",
  "description": "Professional 33MP mirrorless camera in mint condition.",
  "pricePerUnit": "1500.00",
  "pricingUnit": "day",
  "depositAmount": "5000.00",
  "approxLocation": "Bole, near Edna Mall",
  "status": "PUBLISHED",
  "owner": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "displayName": "Alex Abebe",
    "avatarUrl": "https://storage.hulurent.com/avatars/user1.jpg"
  },
  "category": {
    "id": "e0b82f9d-1111-2222-3333-444455556666",
    "name": "Cameras & Lenses",
    "slug": "cameras-and-lenses"
  },
  "images": [
    { "id": "img-01", "url": "https://storage.hulurent.com/listings/sony1.jpg", "position": 0 }
  ],
  "availabilities": [],
  "createdAt": "2026-08-18T08:15:00.000Z"
}
```
*Errors:* `404` if not found; `403` if `status: "DRAFT"` and caller is not the owner.

### `PATCH /listings/:id`
**Auth required, owner only.** Updates editable fields or toggles status (`PUBLISHED`, `UNAVAILABLE`).
```json
// Request (partial update)
{
  "pricePerUnit": "1400.00",
  "status": "PUBLISHED"
}

// 200 OK Response: full updated listing object
```

### `DELETE /listings/:id`
**Auth required, owner only.** Soft-deletes the listing by marking status `ARCHIVED` (preserves historical bookings).
```
// 204 No Content
```

### `GET /listings/mine`
**Auth required.** Returns paginated list of listings owned by the authenticated caller.
```json
// Query: ?page=1&limit=20&status=PUBLISHED
// 200 OK Response
{
  "items": [ /* listing objects */ ],
  "page": 1,
  "limit": 20,
  "total": 3
}
```

### `POST /listings/:id/images`
**Auth required, owner only.** Uploads item gallery images.
- Request: `multipart/form-data` with form field `images` (array of image files).
```json
// 201 Created Response
{
  "images": [
    { "id": "img-01", "url": "https://storage.hulurent.com/listings/photo1.jpg", "position": 0 },
    { "id": "img-02", "url": "https://storage.hulurent.com/listings/photo2.jpg", "position": 1 }
  ]
}
```

---

## 8. Search & Discovery — `/search`

### `GET /search`
**Public.** Search listings across keywords, categories, price range, and geographic location.
- **Query Parameters**:
  - `q`: Text search across listing title and description
  - `categoryId`: UUID of the selected category
  - `minPrice`, `maxPrice`: Numeric filter bounds
  - `lat`, `lng`: Latitude / longitude coordinates
  - `radiusKm`: Radius in kilometers (default: 25 km)
  - `page`, `limit`: Pagination parameters
```json
// 200 OK Response
{
  "items": [
    {
      "id": "8fa12345-6789-abcd-ef01-234567890abc",
      "name": "Sony A7 IV Full-Frame Camera + 24-70mm Lens",
      "pricePerUnit": "1500.00",
      "pricingUnit": "day",
      "approxLocation": "Bole · ~2.1 km away",
      "distanceKm": 2.1,
      "thumbnailUrl": "https://storage.hulurent.com/listings/sony1.jpg",
      "owner": {
        "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        "displayName": "Alex Abebe"
      }
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 14
}
```

---

## 9. Availability — `/availability`

### `POST /availability`
**Auth required, item owner only.** Sets custom blackout ranges.
```json
// Request
{
  "itemId": "8fa12345-6789-abcd-ef01-234567890abc",
  "startDate": "2026-08-25T00:00:00.000Z",
  "endDate": "2026-08-28T23:59:59.000Z"
}

// 201 Created Response
{
  "id": "avail-123",
  "itemId": "8fa12345-6789-abcd-ef01-234567890abc",
  "startDate": "2026-08-25T00:00:00.000Z",
  "endDate": "2026-08-28T23:59:59.000Z"
}
```

### `GET /availability/:itemId`
**Public.** Retrieves all booked and blackout dates for an item.
```json
// 200 OK Response
{
  "items": [
    {
      "id": "avail-123",
      "startDate": "2026-08-25T00:00:00.000Z",
      "endDate": "2026-08-28T23:59:59.000Z"
    }
  ]
}
```

### `DELETE /availability/:id`
**Auth required, owner only.** Removes a blackout range.
```
// 204 No Content
```

---

## 10. Bookings & Rental Lifecycle — `/bookings`

### `POST /bookings`
**Auth required.** Creates a rental request in `REQUESTED` status.
```json
// Request
{
  "itemId": "8fa12345-6789-abcd-ef01-234567890abc",
  "startDate": "2026-08-20T09:00:00.000Z",
  "endDate": "2026-08-22T18:00:00.000Z"
}

// 201 Created Response
{
  "id": "bkg-998877",
  "itemId": "8fa12345-6789-abcd-ef01-234567890abc",
  "ownerId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "renterId": "11223344-5566-7788-99aa-bbccddeeff00",
  "startDate": "2026-08-20T09:00:00.000Z",
  "endDate": "2026-08-22T18:00:00.000Z",
  "agreedPrice": "4500.00",
  "status": "REQUESTED",
  "createdAt": "2026-08-18T08:30:00.000Z"
}
```
*Errors:* `409 ConflictError` if the dates overlap an existing active booking.

### `GET /bookings/:id`
**Auth required, owner or renter.** Retrieves booking status with nested summaries.
```json
// 200 OK Response
{
  "id": "bkg-998877",
  "itemId": "8fa12345-6789-abcd-ef01-234567890abc",
  "startDate": "2026-08-20T09:00:00.000Z",
  "endDate": "2026-08-22T18:00:00.000Z",
  "agreedPrice": "4500.00",
  "status": "ACCEPTED",
  "item": {
    "id": "8fa12345-6789-abcd-ef01-234567890abc",
    "name": "Sony A7 IV Full-Frame Camera"
  },
  "owner": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "displayName": "Alex Abebe"
  },
  "renter": {
    "id": "11223344-5566-7788-99aa-bbccddeeff00",
    "displayName": "Sara Tadesse"
  }
}
```

### `GET /bookings/mine`
**Auth required.** Retrieves user bookings filtered by role (`role=owner` or `role=renter`).
```json
// Query: ?role=renter&status=CONFIRMED&page=1&limit=20
// 200 OK Response
{
  "items": [ /* booking objects */ ],
  "page": 1,
  "limit": 20,
  "total": 2
}
```

### Booking State Mutations
All state mutation routes require authentication and return the updated booking object (`200 OK`):
- `PATCH /bookings/:id/accept` — Owner accepts request (`REQUESTED → ACCEPTED`).
- `PATCH /bookings/:id/reject` — Owner rejects request (`REQUESTED → REJECTED`).
- `PATCH /bookings/:id/confirm` — Renter confirms agreement (`ACCEPTED → CONFIRMED`). *Executes PostgreSQL exclusion check.*
- `PATCH /bookings/:id/cancel` — Owner or renter cancels pre-active booking (`→ CANCELLED`).

---

## 11. Digital Agreements — `/agreements`

### `GET /agreements/:bookingId`
**Auth required, participant only.** Retrieves the latest versioned rental agreement.
```json
// 200 OK Response
{
  "id": "agr-101",
  "bookingId": "bkg-998877",
  "version": 1,
  "terms": {
    "pricePerUnit": "1500.00",
    "pricingUnit": "day",
    "depositAmount": "5000.00",
    "permittedUse": "General photography. No sub-leasing or extreme conditions.",
    "cancellationPolicy": "Free cancellation up to 24h before start.",
    "offPlatformHandoffClause": "HuluRent protections apply solely to transactions conducted via the recorded platform flow."
  },
  "ownerAccepted": true,
  "renterAccepted": false,
  "createdAt": "2026-08-18T08:35:00.000Z"
}
```

### `POST /agreements/:bookingId/accept`
**Auth required, participant only.** Records party agreement acknowledgement.
```json
// 200 OK Response: returns updated agreement object with party flags updated.
```

---

## 12. Inspections — `/inspections`

### `POST /inspections`
**Auth required, participant only.** Schedules a pre-rental physical inspection.
```json
// Request
{
  "bookingId": "bkg-998877",
  "scheduledAt": "2026-08-19T10:00:00.000Z",
  "notes": "Meet at Bole Medhanialem Mall lobby."
}

// 201 Created Response
{
  "id": "insp-501",
  "bookingId": "bkg-998877",
  "scheduledAt": "2026-08-19T10:00:00.000Z",
  "status": "REQUESTED",
  "notes": "Meet at Bole Medhanialem Mall lobby."
}
```

### `PATCH /inspections/:id/confirm`
**Auth required, other party only.** Confirms the inspection appointment (`REQUESTED → CONFIRMED`).

### `PATCH /inspections/:id/cancel`
**Auth required, participant only.** Cancels inspection appointment (`→ CANCELLED`).

---

## 13. Messaging & Real-Time Chat — `/messaging`

### `GET /messaging/conversations`
**Auth required.** Returns conversation threads for the user.
```json
// 200 OK Response
{
  "items": [
    {
      "id": "conv-100",
      "bookingId": "bkg-998877",
      "otherParty": {
        "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        "displayName": "Alex Abebe",
        "avatarUrl": "https://storage.hulurent.com/avatars/user1.jpg"
      },
      "lastMessage": {
        "content": "Sounds good! See you tomorrow.",
        "createdAt": "2026-08-18T09:00:00.000Z"
      }
    }
  ]
}
```

### `GET /messaging/conversations/:bookingId/messages`
**Auth required, participant only.** Paginated conversation message history.
```json
// Query: ?page=1&limit=50
// 200 OK Response
{
  "items": [
    {
      "id": "msg-01",
      "conversationId": "conv-100",
      "senderId": "11223344-5566-7788-99aa-bbccddeeff00",
      "content": "Hi Alex, is the 24-70mm lens included?",
      "createdAt": "2026-08-18T08:45:00.000Z"
    }
  ],
  "page": 1,
  "limit": 50,
  "total": 1
}
```

### `POST /messaging/conversations/:bookingId/messages`
**Auth required, participant only.** Sends a new chat message. Also emits `message:receive` via WebSocket.
```json
// Request
{
  "content": "Yes, both lens caps and carry case are included!"
}

// 201 Created Response
{
  "id": "msg-02",
  "conversationId": "conv-100",
  "senderId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "content": "Yes, both lens caps and carry case are included!",
  "createdAt": "2026-08-18T08:50:00.000Z"
}
```

---

## 14. Condition Evidence — `/evidence`

### `POST /evidence`
**Auth required, participant only.** Submits condition photos and documentation at pickup or return.
- Request: `multipart/form-data` with files `photos` and form fields:
  - `bookingId`: UUID
  - `type`: `"PICKUP"` or `"RETURN"`
  - `conditionNotes`: Text describing physical condition / existing scuffs
```json
// 201 Created Response
{
  "id": "evi-777",
  "bookingId": "bkg-998877",
  "submittedById": "11223344-5566-7788-99aa-bbccddeeff00",
  "type": "PICKUP",
  "photoUrls": [
    "https://storage.hulurent.com/evidence/pickup_front.jpg",
    "https://storage.hulurent.com/evidence/pickup_lens.jpg"
  ],
  "conditionNotes": "Minor surface scuff near battery door, lens glass pristine.",
  "acknowledgedByOwner": false,
  "acknowledgedByRenter": true,
  "createdAt": "2026-08-20T09:30:00.000Z"
}
```

### `GET /evidence/:bookingId`
**Auth required, participant only.** Retrieves pickup and return evidence records.
```json
// 200 OK Response
{
  "items": [ /* evidence objects */ ]
}
```

### `PATCH /evidence/:id/acknowledge`
**Auth required, counter-party only.** Acknowledges uploaded evidence condition record.
```json
// 200 OK Response: returns updated evidence object with acknowledged flag set to true.
```

---

## 15. Reviews & Ratings — `/reviews`

### `POST /reviews`
**Auth required, participant on `COMPLETED` booking.**
```json
// Request
{
  "bookingId": "bkg-998877",
  "rating": 5,
  "comment": "Camera was in perfect condition and Alex was super helpful!"
}

// 201 Created Response
{
  "id": "rev-333",
  "bookingId": "bkg-998877",
  "authorId": "11223344-5566-7788-99aa-bbccddeeff00",
  "subjectId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "rating": 5,
  "comment": "Camera was in perfect condition and Alex was super helpful!",
  "createdAt": "2026-08-23T10:00:00.000Z"
}
```
*Errors:* `409 ConflictError` if booking is not `COMPLETED` or if user already submitted a review for this booking.

### `GET /reviews/user/:userId`
**Public.** Retrieves reviews received by a user.
```json
// Query: ?page=1&limit=20
// 200 OK Response
{
  "items": [
    {
      "id": "rev-333",
      "author": {
        "id": "11223344-5566-7788-99aa-bbccddeeff00",
        "displayName": "Sara Tadesse",
        "avatarUrl": "https://storage.hulurent.com/avatars/sara.jpg"
      },
      "rating": 5,
      "comment": "Camera was in perfect condition and Alex was super helpful!",
      "createdAt": "2026-08-23T10:00:00.000Z"
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 1
}
```

---

## 16. Reports & Platform Governance — `/reports`

### `POST /reports`
**Auth required.** Files a report against a user or listing.
```json
// Request
{
  "subjectId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "reason": "Item not matching description",
  "details": "Item arrived with missing accessory listed in description."
}

// 201 Created Response
{
  "id": "rep-404",
  "authorId": "11223344-5566-7788-99aa-bbccddeeff00",
  "subjectId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "reason": "Item not matching description",
  "details": "Item arrived with missing accessory listed in description.",
  "status": "OPEN",
  "createdAt": "2026-08-23T11:00:00.000Z"
}
```

---

## 17. Administration — `/admin`

All admin endpoints require `Authorization: Bearer <jwt>` from an account with `role: "ADMIN"`.

### `GET /admin/reports`
**Admin only.** Returns paginated reports queue.
```json
// Query: ?status=OPEN&page=1&limit=20
// 200 OK Response
{
  "items": [
    {
      "id": "rep-404",
      "author": { "id": "1122...", "displayName": "Sara Tadesse" },
      "subject": { "id": "f47a...", "displayName": "Alex Abebe" },
      "reason": "Item not matching description",
      "details": "Item arrived with missing accessory listed in description.",
      "status": "OPEN",
      "createdAt": "2026-08-23T11:00:00.000Z"
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 1
}
```

### `PATCH /admin/reports/:id`
**Admin only.** Updates report resolution status and writes an `AuditEvent`.
```json
// Request
{
  "status": "RESOLVED"
}

// 200 OK Response: returns updated report object
```

### `GET /admin/users`
**Admin only.** Lists all users with pagination and search.
```json
// Query: ?q=alex&role=USER&page=1&limit=20
// 200 OK Response
{
  "items": [
    {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "email": "alex@example.com",
      "displayName": "Alex Abebe",
      "role": "USER",
      "createdAt": "2026-08-14T12:00:00.000Z"
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 1
}
```

### `PATCH /admin/users/:id/restrict`
**Admin only.** Restricts an account and logs an `AuditEvent`.
```json
// Request
{
  "restricted": true,
  "reason": "Multiple unresolved damage reports."
}

// 200 OK Response
{
  "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "restricted": true
}
```

---

## 18. Notifications — `/notifications`

### `GET /notifications`
**Auth required.** Returns paginated notifications for the user.
```json
// Query: ?page=1&limit=20
// 200 OK Response
{
  "items": [
    {
      "id": "notif-01",
      "type": "BOOKING_ACCEPTED",
      "payload": { "bookingId": "bkg-998877", "message": "Your booking request was accepted!" },
      "readAt": null,
      "createdAt": "2026-08-18T08:35:00.000Z"
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 1
}
```

### `PATCH /notifications/:id/read`
**Auth required, recipient only.** Marks notification as read.
```json
// 200 OK Response
{
  "id": "notif-01",
  "readAt": "2026-08-18T08:40:00.000Z"
}
```

---

## 19. Real-Time WebSocket Events (Socket.IO)

The backend provides real-time event broadcasting over Socket.IO authenticated via token handshake:

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: { token: 'Bearer <jwt_token>' }
});
```

### Client Emitted Events
- `join_conversation({ bookingId })`: Joins the room for the specified booking's conversation.
- `leave_conversation({ bookingId })`: Leaves the conversation room.
- `send_message({ bookingId, content })`: Sends a message to the active conversation.

### Server Emitted Events
- `message:receive({ id, conversationId, senderId, content, createdAt })`: Broadcast to conversation participants when a new message arrives.
- `notification({ id, type, payload, createdAt })`: Pushed to user when an event occurs (e.g. booking state update, inspection request).
- `booking_updated({ bookingId, status })`: Pushed to booking parties when status changes.
