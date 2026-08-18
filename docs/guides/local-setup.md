# HuluRent — Local Development Setup Guide

Lives in: **`hulurent-docs`** (`guides/local-setup.md`)  
Reference Issue: **`[DOC-06]`** (Write full-stack local setup guide)

This guide provides end-to-end instructions for spinning up the complete HuluRent development environment on your local workstation.

---

## 1. Prerequisites

Ensure the following tools are installed on your machine:
- **Node.js**: `v18.0.0` or higher (`node -v`)
- **npm**: `v9.0.0` or higher (`npm -v`)
- **Docker & Docker Compose**: For running the PostgreSQL database container (`docker compose version`)
- **Git**: For version control (`git -v`)

---

## 2. Clone the Repository

Clone the unified project repository:
```bash
git clone https://github.com/HuluRent/HuluRent-main.git
cd HuluRent-main
```

---

## 3. Backend Setup

### 3.1 Install Dependencies
```bash
cd backend
npm install
```

### 3.2 Configure Environment Variables
Copy the sample environment file:
```bash
cp .env.example .env
```
Ensure your `.env` contains the required configuration:
```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hulurent_dev?schema=public"
JWT_SECRET="super-secret-development-jwt-key-32-chars-long"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="http://localhost:5173"
UPLOAD_DIR="./uploads"
```

### 3.3 Start the Database
Start the PostgreSQL container via Docker Compose:
```bash
docker-compose up -d db
```
*Note: If you have a local PostgreSQL instance already running on port 5432, you can create a database named `hulurent_dev` and update the `DATABASE_URL` credentials accordingly.*

### 3.4 Apply Prisma Migrations
Run Prisma migrations to create all database tables:
```bash
npx prisma migrate dev
```

### 3.5 Apply Manual Booking Overlap Exclusion Constraint
Prisma cannot generate PostgreSQL `EXCLUDE` constraints natively. Apply the manual SQL constraint:
```bash
# Using psql inside Docker:
docker exec -i hulurent-db psql -U postgres -d hulurent_dev < prisma/manual-migrations/booking_overlap_constraint.sql

# OR via npm script if configured:
npm run db:manual-migration
```

### 3.6 Seed Initial Database Records
Populate initial categories, demo users (admin, owner, renter), and sample listings:
```bash
node prisma/seed.js
```

### 3.7 Start Backend Server
```bash
npm run dev
```
The API will start at **`http://localhost:3000`**.  
Verify by visiting: **`http://localhost:3000/api/health`** $\rightarrow$ `{"status":"ok"}`.

---

## 4. Frontend Setup

Open a **new terminal tab** and navigate to the `frontend/` directory:

### 4.1 Install Dependencies
```bash
cd frontend
npm install
```

### 4.2 Configure Environment Variables
Copy the sample environment file:
```bash
cp .env.example .env
```
Ensure your `.env` contains:
```env
VITE_API_URL="http://localhost:3000/api"
VITE_SOCKET_URL="http://localhost:3000"
```

### 4.3 Start Frontend Development Server
```bash
npm run dev
```
The client will be running at **`http://localhost:5173`**.

---

## 5. Seeded Test Credentials

The database seed provides ready-to-use test accounts:

| Role | Email | Password | Purpose |
|---|---|---|---|
| **Admin** | `admin@hulurent.com` | `Admin123!` | Moderate reports, restrict users, view audit logs |
| **Owner** | `owner@hulurent.com` | `Owner123!` | Owns sample camera, tool, and camping listings |
| **Renter** | `renter@hulurent.com` | `Renter123!` | Ready to browse, request rentals, and sign agreements |

---

## 6. Running Automated Tests

### Run Backend Tests
```bash
cd backend
npm test
```

### Run Frontend Tests
```bash
cd frontend
npm test
```

---

## 7. Troubleshooting Common Issues

### Issue 1: Port 5432 Conflict
- **Symptom**: `docker-compose up -d db` fails because port 5432 is already bound.
- **Fix**: Stop any existing local PostgreSQL service or adjust the host port mapping in `docker-compose.yml` (e.g. `"5433:5432"` and update `DATABASE_URL` port).

### Issue 2: `btree_gist` Extension Missing
- **Symptom**: Error applying exclusion constraint migration.
- **Fix**: Ensure your PostgreSQL user has superuser privileges to run `CREATE EXTENSION IF NOT EXISTS btree_gist;`.

### Issue 3: CORS Policy Errors in Browser Console
- **Symptom**: `Access to fetch at 'http://localhost:3000/api/...' has been blocked by CORS policy`.
- **Fix**: Check that `CORS_ORIGIN="http://localhost:5173"` in `backend/.env` matches the exact port Vite is running on.
