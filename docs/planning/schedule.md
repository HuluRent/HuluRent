# 14-Day Implementation Schedule

Lives in: **`hulurent-docs`** (`planning/schedule.md`)

Hard submission deadline: **August 24, 2026**. Development finishes before that date, leaving time for final testing and presentation prep.

The team should not wait until the final days to integrate `Hulurent-backend` and `Hulurent-frontend` — each completed module should be merged and connected end-to-end as early as possible, even if it means coordinating a backend PR and a frontend PR together for a given feature.

## Day-by-day

| Days | Focus | Deliverables |
|---|---|---|
| 1–2 | Foundation | Freeze requirements, finalize architecture, initialize workspaces (`Hulurent-backend`, `Hulurent-frontend`, `Hulurent-docs`), backend init, frontend init, DB schema, authentication |
| 3–5 | Marketplace | User profiles, categories, listing CRUD, image upload, search, filtering, availability |
| 6–8 | Rental Lifecycle | Rental requests, owner approval, booking, conflict prevention, booking states, cancellation |
| 9–10 | Transaction Layer | Messaging, inspection, digital agreements, pickup evidence, return evidence |
| 11–12 | Trust & Administration | Reviews, reports, admin moderation, account restrictions, audit events |
| 13 | Integration & Testing | Complete end-to-end workflow across both layers, integration testing, security testing, error handling, bug fixing |
| 14 | Release Candidate | Final bug fixing, UI refinement, documentation, deployment, demo prep, presentation rehearsal |

## Contingency: if the team falls behind

This schedule is tight for a 5-person team building auth, listings, search, booking with conflict prevention, messaging, agreements, evidence upload, reviews, and admin moderation in 14 days — split across coordinated modules. Falling a day or two behind by Day 8–9 is a realistic outcome, not a failure — the response should be to **cut scope, not skip testing**.

If Day 13 arrives with incomplete modules, cut in this order (last item cut first, first item protected hardest):

**Protect at all costs — this is the demo:**
- Auth, listing CRUD, search, rental request → accept → booking (with conflict prevention), pickup/return evidence, transaction completion

**Cut second — degrade gracefully, don't remove:**
- Inspection scheduling (can be replaced with "arrange via chat" in the demo narrative)
- Reviews (can be stubbed as a simple 1–5 rating with no comment field)
- Admin moderation UI (can be a manual DB action for the demo instead of a full admin panel)

**Cut first — genuinely deferrable without breaking the core story:**
- WebSocket real-time messaging (fall back to polling or a simple refresh-based chat)
- Notifications
- Audit log UI (events can still be recorded in the DB even without a UI to browse them)

The MVP completion criterion is the full lifecycle from `Create Account` through `Review Submitted` working reliably across both `Hulurent-frontend` and `Hulurent-backend` — not every feature in the functional spec. A working core flow with a rough edge on reviews beats a broken flow with a polished admin panel nobody demos.

## Related Documentation

- [`product/trust-and-liability.md`](../product/trust-and-liability.md) — off-platform handoff policy referenced in the agreement built during the Transaction Layer phase (Days 9–10)
- [`ARCHITECTURE.md`](../ARCHITECTURE.md) — backend and frontend module structure this schedule builds against
- [`technical/api-reference.md`](../technical/api-reference.md) — complete API specifications
- [`product/spec.md`](../product/spec.md) — full product and functional specification
