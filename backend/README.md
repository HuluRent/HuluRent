# HuluRent — Backend

Node.js + Express API, modular monolith. This is its own repo (`hulurent-backend`) — see `hulurent-docs`' `ARCHITECTURE.md` §2–3 for the full module structure, layering rules, and database design behind it.

## Setup

```bash
npm install
cp .env.example .env
# point DATABASE_URL at a running Postgres instance, or use docker-compose:
docker-compose up -d db

npx prisma migrate dev
npm run dev
```

Health check: `GET http://localhost:3000/api/health` → `{ "status": "ok" }`

## Structure

- `src/modules/*` — one folder per domain, each following `routes → controller → service → repository`
- `src/shared/` — cross-module middleware, error classes, constants, utils
- `src/routes/index.js` — the only file that changes when a new module is added
- `prisma/schema.prisma` — full database schema
- `prisma/migrations/manual/` — hand-written SQL migrations Prisma can't generate (e.g. the booking overlap exclusion constraint)

Every module file was scaffolded with a one-line comment describing its responsibility, and every `*.routes.js` exports a real (empty) Express router so the app boots — replace the `// TODO: implement` with real code as you build.

## Booking overlap defense (read before touching `bookings/`)

Two layers, both required — see `ARCHITECTURE.md` §3 in `hulurent-docs`:

1. App-level row lock in `bookings.conflict-check.js`
2. DB-level exclusion constraint — apply `prisma/migrations/manual/booking_overlap_constraint.sql` manually after your first `prisma migrate dev`
