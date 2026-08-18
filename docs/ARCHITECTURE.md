# HuluRent — Architecture Reference

HuluRent is built as a **modular monolith** with a **Node.js + Express** backend (layered into `routes → controller → service → repository`) and a **React + Vite** single-page frontend.

---

## 1. System Topology & Workspace Structure

HuluRent is designed around clear separation of concerns. In production / version control, components can be maintained in three dedicated repositories or organized in a unified monorepo workspace:

| Layer / Repo | Path | Technology Stack | Responsibility |
|---|---|---|---|
| **Backend API** | `backend/` (`HuluRent-backend`) | Node.js, Express, Prisma ORM, PostgreSQL, Socket.IO | REST API, WebSocket server, DB migrations, state machines, conflict checking, scheduled cron jobs |
| **Frontend Web** | `frontend/` (`HuluRent-frontend`) | React 18, Vite, React Router 6, TanStack Query, Axios | Responsive web application, customer flows, owner management, admin moderation, real-time chat |
| **Documentation** | `docs/` (`HuluRent-docs`) | Markdown, SQL, Prisma Schema | System architecture, functional specs, API reference, deployment guides, presentation assets |

### Architectural Principles
1. **Layered Monolith**: Each domain module is isolated into routes, controller, service, and repository. Controllers never talk to Prisma directly; business rules live in services.
2. **Dual-Layer Concurrency & Overlap Protection**: Double-booking is strictly prohibited via an application-level row-lock check (`bookings.conflict-check.js`) backed by a PostgreSQL exclusion constraint (`EXCLUDE USING gist`) in manual migrations.
3. **Data Minimization & Approximate Geolocation**: Exact physical addresses are kept private; only approximate neighborhood locations (e.g., "Bole · ~2.4 km away") and calculated bounding-box distances are exposed publicly.
4. **Client as Presentation Only**: Role guards and client checks provide UX convenience, but every incoming write and mutation is independently validated and authorized on the backend (`authenticate`, `authorize`, `ownershipGuard`).

---

## 2. Backend Architecture (`backend/`)

```
backend/
├── Dockerfile
├── docker-compose.yml
├── package.json
├── package-lock.json
├── prisma.config.js
├── backend_issues.json
├── import_backend_issues.py
├── README.md
│
├── prisma/
│   ├── schema.prisma
│   ├── seed.js
│   ├── manual-migrations/
│   │   └── booking_overlap_constraint.sql
│   └── migrations/
│       ├── migration_lock.toml
│       └── 20260814124355_init/
│           └── migration.sql
│
└── src/
    ├── app.js                          # Express application initialization & middleware stack
    ├── server.js                       # HTTP + Socket.IO server startup & port binding
    │
    ├── config/
    │   ├── constants.js                # App-wide configuration constants
    │   ├── cors.js                     # CORS origins and whitelist settings
    │   ├── database.js                 # PrismaClient singleton instance
    │   ├── env.js                      # Environment variable validation and loading
    │   ├── logger.js                   # Structured logging (console / Pino / Winston)
    │   └── storage.js                  # Object storage client (S3-compatible / disk)
    │
    ├── jobs/
    │   ├── expire-inspection-requests.job.js   # Background task: auto-expire stale inspection requests
    │   ├── expire-pending-bookings.job.js      # Background task: auto-expire unaccepted booking requests
    │   └── scheduler.js                        # Cron job runner initialization
    │
    ├── sockets/
    │   └── index.js                    # Socket.IO connection handler & authentication
    │
    ├── routes/
    │   └── index.js                    # Central API router mounting all domain routers under /api
    │
    ├── shared/
    │   ├── constants/
    │   │   ├── booking-states.js       # REQUESTED, ACCEPTED, CONFIRMED, ACTIVE, etc.
    │   │   ├── evidence-types.js       # PICKUP, RETURN
    │   │   ├── inspection-states.js    # REQUESTED, CONFIRMED, COMPLETED, CANCELLED
    │   │   ├── listing-states.js       # DRAFT, PUBLISHED, UNAVAILABLE, SUSPENDED, ARCHIVED
    │   │   └── roles.js                # USER, ADMIN
    │   │
    │   ├── errors/
    │   │   ├── AppError.js             # Base application error
    │   │   ├── ConflictError.js        # 409 Conflict (booking collisions, duplicates)
    │   │   ├── ForbiddenError.js       # 403 Forbidden (authorization / ownership)
    │   │   ├── NotFoundError.js        # 404 Not Found
    │   │   ├── UnauthorizedError.js    # 401 Unauthorized (invalid / missing JWT)
    │   │   └── ValidationError.js      # 400 Bad Request (schema validation failure)
    │   │
    │   ├── middleware/
    │   │   ├── authenticate.js         # JWT Bearer token validation -> req.user
    │   │   ├── authorize.js            # Role-based guard (e.g., ADMIN only)
    │   │   ├── error-handler.js        # Global error-handling middleware
    │   │   ├── not-found.js            # 404 catch-all handler
    │   │   ├── ownership-guard.js      # Resource ownership validator (req.user.id == owner)
    │   │   ├── rate-limiter.js         # Express rate limiter for write/auth routes
    │   │   ├── request-logger.js       # HTTP request/response logging
    │   │   ├── upload.js               # Multer multipart file upload handler
    │   │   └── validate-request.js     # Zod / Joi validation middleware
    │   │
    │   └── utils/
    │       ├── async-handler.js        # Wraps async controller routes to catch errors
    │       ├── date.js                 # ISO date parsing and date range overlap helpers
    │       ├── geo.js                  # Haversine distance and bounding box calculations
    │       ├── jwt.js                  # JWT token signing and verification
    │       ├── pagination.js           # Standard query parser (page, limit, skip)
    │       ├── password.js             # Bcrypt password hashing and verification
    │       └── response.js             # Standard envelope helper (e.g. paginated)
    │
    └── modules/
        ├── admin/
        │   ├── admin.routes.js         # /api/admin/reports, /api/admin/users
        │   ├── admin.controller.js
        │   ├── admin.service.js        # User restrictions, report reviews, audit triggers
        │   └── admin.repository.js
        │
        ├── agreements/
        │   ├── agreements.routes.js    # /api/agreements/:bookingId, /accept
        │   ├── agreements.controller.js
        │   ├── agreements.service.js   # Versioned agreement generation & signing
        │   ├── agreements.validation.js
        │   ├── agreements.repository.js
        │   └── agreement-template.js   # Terms generator & liability disclosures
        │
        ├── audit/
        │   ├── audit.service.js        # Immutable audit trail writer
        │   └── audit.repository.js
        │
        ├── auth/
        │   ├── auth.routes.js          # /api/auth/register, /login, /me, /logout
        │   ├── auth.controller.js
        │   ├── auth.service.js         # Authentication, registration, token generation
        │   ├── auth.validation.js
        │   └── auth.repository.js
        │
        ├── availability/
        │   ├── availability.routes.js  # /api/availability
        │   ├── availability.controller.js
        │   ├── availability.service.js # Item blackout dates & availability rules
        │   ├── availability.validation.js
        │   └── availability.repository.js
        │
        ├── bookings/
        │   ├── bookings.routes.js      # /api/bookings, /accept, /reject, /confirm, /cancel
        │   ├── bookings.controller.js
        │   ├── bookings.service.js     # Rental workflow orchestrator
        │   ├── bookings.validation.js
        │   ├── bookings.repository.js
        │   ├── bookings.state-machine.js # Legal lifecycle transitions validator
        │   └── bookings.conflict-check.js # Concurrent date overlap checker (SELECT FOR UPDATE)
        │
        ├── categories/
        │   ├── categories.routes.js    # /api/categories
        │   ├── categories.controller.js
        │   ├── categories.service.js
        │   ├── categories.validation.js
        │   └── categories.repository.js
        │
        ├── evidence/
        │   ├── evidence.routes.js      # /api/evidence, /acknowledge
        │   ├── evidence.controller.js
        │   ├── evidence.service.js     # Condition documentation (pickup/return photos & notes)
        │   ├── evidence.validation.js
        │   ├── evidence.repository.js
        │   └── evidence.upload.js      # Image processing and object storage persistence
        │
        ├── identity-verification/
        │   ├── identity.routes.js      # /api/identity-verification, /me
        │   ├── identity.controller.js
        │   ├── identity.service.js     # Verification submissions and status tracking
        │   ├── identity.validation.js
        │   └── identity.repository.js
        │
        ├── inspections/
        │   ├── inspections.routes.js   # /api/inspections, /confirm, /cancel
        │   ├── inspections.controller.js
        │   ├── inspections.service.js  # Item pre-rental inspection appointment scheduler
        │   ├── inspections.validation.js
        │   └── inspections.repository.js
        │
        ├── listings/
        │   ├── listings.routes.js      # /api/listings, /mine, /:id/images
        │   ├── listings.controller.js
        │   ├── listings.service.js     # Item listing CRUD & lifecycle management
        │   ├── listings.validation.js
        │   ├── listings.repository.js
        │   └── listing-images.service.js # Multi-photo association & ordering
        │
        ├── messaging/
        │   ├── messaging.routes.js     # /api/messaging/conversations
        │   ├── messaging.controller.js
        │   ├── messaging.service.js    # Transaction-linked chat message storage
        │   ├── messaging.validation.js
        │   ├── messaging.repository.js
        │   └── messaging.socket.js     # Real-time WebSocket event broadcaster
        │
        ├── notifications/
        │   ├── notifications.routes.js # /api/notifications, /:id/read
        │   ├── notifications.controller.js
        │   ├── notifications.service.js # In-app notification dispatcher
        │   └── notifications.repository.js
        │
        ├── reports/
        │   ├── reports.routes.js       # /api/reports
        │   ├── reports.controller.js
        │   ├── reports.service.js      # User and listing reporting system
        │   ├── reports.validation.js
        │   └── reports.repository.js
        │
        ├── reviews/
        │   ├── reviews.routes.js       # /api/reviews, /user/:userId
        │   ├── reviews.controller.js
        │   ├── reviews.service.js      # Two-sided review system for COMPLETED bookings
        │   ├── reviews.validation.js
        │   └── reviews.repository.js
        │
        ├── search/
        │   ├── search.routes.js        # /api/search
        │   ├── search.controller.js
        │   ├── search.service.js       # Keyword, category, price, and geo-distance search
        │   └── search.repository.js
        │
        └── users/
            ├── users.routes.js         # /api/users/:id, /me
            ├── users.controller.js
            ├── users.service.js        # User profiles & location settings
            ├── users.validation.js
            └── users.repository.js
```

---

## 3. Frontend Architecture (`frontend/`)

```
frontend/
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── vite.config.js
├── frontend_issues.json
├── import_frontend_issues.py
├── README.md
│
├── public/                             # Static assets, logos, favicons
│
└── src/
    ├── main.jsx                        # React root entry point
    ├── App.jsx                         # App shell with providers (QueryClient, Auth, Socket, Router)
    │
    ├── config/
    │   ├── constants.js                # Shared constants (booking states, roles, categories)
    │   └── env.js                      # Vite environment variables (VITE_API_URL, VITE_SOCKET_URL)
    │
    ├── context/
    │   ├── AuthContext.jsx             # User authentication state, token storage, login/logout
    │   └── SocketContext.jsx           # Global Socket.IO connection manager
    │
    ├── api/
    │   ├── client.js                   # Axios client with JWT interceptor & 401 error handler
    │   ├── admin.api.js                # Reports moderation & user restrictions
    │   ├── agreements.api.js           # Agreement fetching & acceptance
    │   ├── auth.api.js                 # Login, register, me, logout
    │   ├── availability.api.js         # Availability blackout range endpoints
    │   ├── bookings.api.js             # Booking requests & status mutations
    │   ├── catagories.api.js           # Category tree fetching
    │   ├── evidence.api.js             # Pickup/return condition evidence upload & acknowledge
    │   ├── inspections.api.js          # Inspection scheduling & confirmation
    │   ├── listings.api.js             # Listing CRUD, image uploads, owner listings
    │   ├── messaging.api.js            # Chat conversations & message history
    │   ├── notifications.api.js        # Notification listing & mark-as-read
    │   ├── reports.api.js              # Report submission
    │   ├── reviews.api.js              # Review submission & user reviews
    │   ├── search.api.js               # Search with filters & geo parameters
    │   └── users.api.js                # Profile retrieval & patch
    │
    ├── components/
    │   ├── EmptyState.jsx              # Fallback UI for empty lists
    │   ├── ErrorBoundary.jsx           # Top-level React error boundary
    │   ├── LoadingSpinner.jsx          # Reusable loading spinner
    │   ├── Pagination.jsx              # Reusable pagination controls
    │   ├── ProtectedRoute.jsx          # Route wrapper requiring valid JWT authentication
    │   ├── RoleGuard.jsx               # Route wrapper requiring specific role (e.g. ADMIN)
    │   └── layout/
    │       ├── AppShell.jsx            # Common application layout wrapper
    │       ├── Navbar.jsx              # Header navigation bar with search & user menu
    │       ├── Navbar.css
    │       ├── Footer.jsx              # Application footer with links & trust info
    │       └── Footer.css
    │
    ├── hooks/
    │   ├── useAuth.js                  # Convenient hook for AuthContext
    │   ├── useDebounce.js              # Input debounce hook for search queries
    │   └── useGeolocation.js           # Browser HTML5 geolocation getter
    │
    ├── utils/
    │   ├── formatCurrency.js           # Decimal string / number currency formatter
    │   ├── formatDate.js               # ISO string to human date/time formatter
    │   ├── geo.js                      # Client-side distance calculations
    │   └── validators.js               # Form input validation rules
    │
    ├── styles/
    │   ├── globals.css                 # Global CSS variables, reset, typography
    │   └── theme.js                    # Design tokens (colors, spacing, shadows)
    │
    ├── routes/
    │   └── router.jsx                  # React Router 6 configuration and route definitions
    │
    └── features/
        ├── home/
        │   ├── components/
        │   │   ├── CategorySection.jsx
        │   │   ├── CategorySection.css
        │   │   ├── FeaturedListingCard.jsx
        │   │   ├── FeaturedListingCard.css
        │   │   ├── FeaturedListings.jsx
        │   │   ├── FeaturedListings.css
        │   │   ├── FinalCTA.jsx
        │   │   ├── FinalCTA.css
        │   │   ├── HeroSection.jsx
        │   │   ├── HeroSection.css
        │   │   ├── TrustSafety.jsx
        │   │   └── TrustSafety.css
        │   ├── data/
        │   │   └── featuredListings.js
        │   └── pages/
        │       ├── HomePage.jsx
        │       └── __tests__/
        │           └── HomePage.test.jsx
        │
        ├── auth/
        │   ├── hooks/
        │   │   ├── useLogin.js
        │   │   ├── useRegister.js
        │   │   └── useSession.js
        │   └── pages/
        │       ├── Auth.css
        │       ├── LoginPage.jsx
        │       └── RegisterPage.jsx
        │
        ├── profile/
        │   ├── hooks/
        │   │   └── useProfile.js
        │   └── pages/
        │       ├── ProfilePage.jsx
        │       ├── ProfilePage.css
        │       ├── EditProfilePage.jsx
        │       └── EditProfilePage.css
        │
        ├── listings/
        │   ├── hooks/
        │   │   ├── useListing.js
        │   │   ├── useCreateListing.js
        │   │   └── useMyListings.js
        │   ├── components/
        │   │   ├── ListingCard.jsx
        │   │   ├── ListingForm.jsx
        │   │   ├── ListingGallery.jsx
        │   │   └── AvailabilityCalendar.jsx
        │   └── pages/
        │       ├── ListingBrowsePage.jsx
        │       ├── ListingCreatePage.jsx
        │       ├── ListingDetailPage.jsx
        │       ├── ListingEditPage.jsx
        │       └── MyListingsPage.jsx
        │
        ├── search/
        │   ├── hooks/
        │   │   ├── useSearchListings.js
        │   │   └── useFilters.js
        │   ├── components/
        │   │   ├── SearchBar.jsx
        │   │   ├── FilterPanel.jsx
        │   │   └── ResultsGrid.jsx
        │   └── pages/
        │       └── SearchPage.jsx
        │
        ├── bookings/
        │   ├── hooks/
        │   │   ├── useBooking.js
        │   │   ├── useCreateBooking.js
        │   │   └── useMyBookings.js
        │   ├── components/
        │   │   ├── BookingRequestForm.jsx
        │   │   ├── BookingStatusBadge.jsx
        │   │   └── BookingTimeline.jsx
        │   └── pages/
        │       ├── BookingRequestPage.jsx
        │       ├── BookingDetailPage.jsx
        │       └── MyBookingsPage.jsx
        │
        ├── agreements/
        │   ├── hooks/
        │   │   └── useAgreement.js
        │   ├── components/
        │   │   └── AgreementViewer.jsx
        │   └── pages/
        │       └── AgreementReviewPage.jsx
        │
        ├── inspections/
        │   ├── hooks/
        │   │   └── useInspection.js
        │   ├── components/
        │   │   └── InspectionScheduler.jsx
        │   └── pages/
        │       └── InspectionPage.jsx
        │
        ├── messaging/
        │   ├── hooks/
        │   │   ├── useConversations.js
        │   │   ├── useMessages.js
        │   │   └── useSocket.js
        │   ├── components/
        │   │   ├── ConversationList.jsx
        │   │   ├── MessageThread.jsx
        │   │   └── MessageInput.jsx
        │   └── pages/
        │       └── ChatPage.jsx
        │
        ├── evidence/
        │   ├── hooks/
        │   │   └── useUploadEvidence.js
        │   ├── components/
        │   │   ├── PhotoUploader.jsx
        │   │   └── ConditionForm.jsx
        │   └── pages/
        │       ├── PickupDocumentationPage.jsx
        │       └── ReturnDocumentationPage.jsx
        │
        ├── reviews/
        │   ├── hooks/
        │   │   └── useSubmitReview.js
        │   ├── components/
        │   │   └── ReviewForm.jsx
        │   └── pages/
        │       └── ReviewSubmitPage.jsx
        │
        ├── reports/
        │   ├── hooks/
        │   │   └── useSubmitReport.js
        │   ├── components/
        │   │   └── ReportForm.jsx
        │   └── pages/
        │       └── ReportPage.jsx
        │
        ├── admin/
        │   ├── hooks/
        │   │   └── useAdminReports.js
        │   ├── components/
        │   │   ├── ModerationQueue.jsx
        │   │   └── AuditLogTable.jsx
        │   └── pages/
        │       ├── AdminDashboardPage.jsx
        │       ├── AdminReportsPage.jsx
        │       └── AdminUsersPage.jsx
        │
        └── notifications/
            ├── hooks/
            │   └── useNotifications.js
            ├── components/
            │   └── NotificationBell.jsx
            └── pages/
                └── NotificationsPage.jsx
```

---

## 4. Database Schema & Concurrency Model

### 4.1 Database Models
The PostgreSQL database managed by Prisma defines 15 distinct entities:
- `User`, `Profile`, `IdentityVerification`: Identity and user profiles
- `Category`, `Item`, `ItemImage`, `Availability`: Marketplace catalogue and owner availability
- `Booking`, `RentalAgreement`, `Inspection`: Rental lifecycle and binding agreements
- `Conversation`, `ConversationParticipant`, `Message`: Direct messaging and negotiations
- `Evidence`: Timestamped photo and condition documentation
- `Review`: Post-rental feedback and ratings
- `Report`, `AuditEvent`, `Notification`: Platform governance and moderation

### 4.2 Booking Overlap Concurrency Prevention
Preventing simultaneous bookings for the same item over conflicting dates uses a dual-layer strategy:
1. **Application-Level Row Lock** (`bookings.conflict-check.js`):
   When creating or confirming a booking, the backend opens an interactive Prisma transaction, locks relevant item rows with `SELECT ... FOR UPDATE`, and calculates range overlap (`startDate < existing.endDate AND endDate > existing.startDate`).
2. **Database-Level Exclusion Constraint** (`booking_overlap_constraint.sql`):
   As an infallible backstop, a PostgreSQL `EXCLUDE USING gist` constraint on the `tsrange(startDate, endDate)` column ensures that even in extreme race conditions, conflicting `CONFIRMED` or `ACTIVE` rows cannot be committed.

---

## 5. Security & Cross-Cutting Controls

- **Authentication**: Stateless JSON Web Tokens (JWT) stored in HTTP client memory / secure local storage.
- **Authorization**: Role-based access control (`USER` vs `ADMIN`) enforced through `authorize.js`.
- **Ownership Verification**: Resource-level security via `ownership-guard.js` ensures users can only mutate their own listings, bookings, or profile.
- **Input Validation**: Request payloads validated at the route boundary using schema validation middleware before entering controller functions.
- **Rate Limiting**: Rate limiting applied to authentication endpoints and write operations to protect against brute-force attacks and abuse.