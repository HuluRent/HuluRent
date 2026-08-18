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
        ├── admin/                  # User restrictions, report reviews, audit triggers
        ├── agreements/             # Versioned agreement generation & signing
        ├── audit/                  # Immutable audit trail writer
        ├── auth/                   # Authentication, registration, token generation
        ├── availability/           # Item blackout dates & availability rules
        ├── bookings/               # Rental workflow orchestrator & conflict checking
        ├── categories/             # Marketplace categories
        ├── evidence/               # Condition documentation (pickup/return photos & notes)
        ├── identity-verification/  # Verification submissions and status tracking
        ├── inspections/            # Item pre-rental inspection appointment scheduler
        ├── listings/               # Item listing CRUD & lifecycle management
        ├── messaging/              # Transaction-linked chat message storage
        ├── notifications/          # In-app notification dispatcher
        ├── reports/                # User and listing reporting system
        ├── reviews/                # Two-sided review system for COMPLETED bookings
        ├── search/                 # Keyword, category, price, and geo-distance search
        └── users/                  # User profiles & location settings
        
        *Note: Each module follows a standard layered structure:*
        - `*.routes.js`
        - `*.controller.js`
        - `*.service.js`
        - `*.repository.js`
        - `*.validation.js` (optional)
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
    └── features/
        ├── admin/                  # Moderation queue, user management, audit logs
        ├── agreements/             # Agreement review & acceptance UI
        ├── auth/                   # Login, register, session management
        ├── bookings/               # Booking requests, timelines, and details
        ├── evidence/               # Condition photos uploader and documentation
        ├── home/                   # Landing page, featured listings, category browser
        ├── inspections/            # Pre-rental inspection scheduler
        ├── listings/               # Listing creation, gallery, and detail views
        ├── messaging/              # Real-time chat threads and conversations
        ├── notifications/          # In-app notification drop-down and list
        ├── profile/                # User profile display and editing
        ├── reports/                # Item/user reporting UI
        ├── reviews/                # Post-rental rating submission
        └── search/                 # Geospatial search bar, filters, and results grid
        
        *Note: Each feature follows a standard structure:*
        - `hooks/` (e.g., `useLogin.js`)
        - `components/` (feature-specific UI)
        - `pages/` (routed views)
        - `data/` (optional mock/static data)
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