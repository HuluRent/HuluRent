# Contributing to HuluRent


Thank you for contributing to **HuluRent**! This guide outlines our development standards, branching strategies, commit conventions, and review processes to keep our codebases and documentation aligned.

---

## 1. Codebase Organization & Repositories

HuluRent consists of three core repositories (also managed in a unified monorepo):
1. **`HuluRent-backend`** (`backend/`): Node.js + Express REST API, Prisma ORM, PostgreSQL.
2. **`HuluRent-frontend`** (`frontend/`): React 18, Vite, React Router, TanStack Query.
3. **`HuluRent-docs`** (`docs/`): Architecture, functional specs, API reference, presentation docs.

---

## 2. Branching & Git Workflow

We follow a structured Git feature-branch workflow:

### Branch Naming Conventions
- `feature/<issue-id>-<short-description>` (e.g. `feature/BE-04-ownership-guard`, `feature/FE-08-booking-form`)
- `fix/<issue-id>-<short-description>` (e.g. `fix/BE-12-date-overlap-bug`)
- `docs/<issue-id>-<short-description>` (e.g. `docs/DOC-03-contributing-guide`)
- `chore/<short-description>` (e.g. `chore/update-dependencies`)

### Workflow Steps
1. **Create Branch**: Always branch from the latest `main` branch.
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/BE-08-listing-service
   ```
2. **Implement & Test**: Write unit and integration tests covering the new functionality.
3. **Commit Changes**: Use Conventional Commits (detailed below).
4. **Push & Open PR**: Push to GitHub and open a Pull Request targeting `main`.
5. **Issue Linking**: Include `Resolves #<issue_number>` or `Closes #<issue_number>` in your PR description.

---

## 3. Commit Message Conventions

We adhere to **Conventional Commits**:

```
<type>(<scope>): <short description in present tense>

[optional body explaining rationale and background]

[optional footer: Resolves #issue_id]
```

### Types
- `feat`: New feature or user-facing capability
- `fix`: Bug fix
- `docs`: Documentation updates or additions
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding or modifying automated tests
- `chore`: Tooling, dependency updates, configuration changes

### Scopes
- Backend: `auth`, `bookings`, `listings`, `agreements`, `inspections`, `messaging`, `evidence`, `reviews`, `reports`, `admin`, `database`, `middleware`
- Frontend: `ui`, `auth`, `listings`, `search`, `bookings`, `chat`, `profile`, `admin`
- Docs: `api`, `architecture`, `specs`, `guides`, `presentation`

### Example
```
feat(bookings): implement row-locking conflict check in booking service

Uses SELECT ... FOR UPDATE within a transaction to guarantee atomic
overlap detection before inserting booking requests.

Resolves #87
```

---

## 4. Code Standards & Layering Rules

### Backend Layering Principles
- **Routes (`*.routes.js`)**: Declare HTTP paths, chain middleware (`authenticate`, `authorize`, `validateRequest`), delegate to controllers. **No business logic.**
- **Controllers (`*.controller.js`)**: Extract request parameters, invoke service methods, format HTTP responses. **Never query Prisma directly.**
- **Services (`*.service.js`)**: Encapsulate all business rules, calculations, conflict checks, and state transitions. Framework-agnostic.
- **Repositories (`*.repository.js`)**: Pure data-access layer. All Prisma queries must live inside repository files.
- **Validations (`*.validation.js`)**: Define Zod / Joi validation schemas.

### Frontend Component Principles
- **API Clients (`api/*.api.js`)**: Pure Axios wrappers. No React hooks or state.
- **Feature Hooks (`features/*/hooks/`)**: TanStack Query wrappers managing server state, mutations, and caching.
- **Presentational Components**: Modular, focused UI components.
- **Pages (`features/*/pages/`)**: Route-level containers orchestrating layout, hooks, and sub-components.

---

## 5. Synchronizing the API Contract

[`docs/technical/api-reference.md`](technical/api-reference.md) is the **single source of truth** for API contracts.

- If you propose an endpoint change, request body modification, or status code adjustment:
  1. Update `docs/technical/api-reference.md` first.
  2. Implement the backend changes in `HuluRent-backend`.
  3. Update the frontend consumer in `HuluRent-frontend`.

---

## 6. Pull Request Review Checklist

Before requesting a review, verify:
- [ ] Code builds and boots without errors (`npm run dev`).
- [ ] Tests pass locally (`npm test`).
- [ ] No secrets, `.env` files, or temporary artifacts are committed.
- [ ] New endpoints match [`technical/api-reference.md`](technical/api-reference.md).
- [ ] PR description describes changes clearly and links related issue numbers.
