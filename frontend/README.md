# HuluRent — Frontend

React + Vite web client. See the [`ARCHITECTURE.md`](../docs/ARCHITECTURE.md) §3 for the full structure and reasoning behind it.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Structure

- `src/api/` — one file per backend module, thin wrappers around `client.js`
- `src/features/` — feature-first: `hooks/`, `components/`, `pages/` per domain
- `src/components/` — shared, cross-feature UI only
- `src/context/` — `AuthContext` (session) and `SocketContext` (live connection)
- `src/routes/router.jsx` — route table

Each file was scaffolded with a one-line comment describing its responsibility — replace the `// TODO: implement` with real code as you build.
