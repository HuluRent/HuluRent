-- Booking overlap exclusion constraint.
-- Lives in: hulurent-backend (prisma/migrations/manual/)
--
-- Run this AFTER `npx prisma migrate dev` has created the Booking table
-- (Prisma doesn't support EXCLUDE constraints natively, so this is applied
-- as a manual follow-up migration — either paste into a new empty Prisma
-- migration file, or run directly with `psql`).
--
-- This is the DB-level backstop described in schema.prisma: the app-level
-- check in bookings.conflict-check.js should catch conflicts first and
-- return a clean error, but this constraint guarantees the DB itself will
-- reject an overlapping CONFIRMED/ACTIVE booking even if the app-level
-- check has a bug or loses a race condition.

-- Required for the exclusion constraint's overlap operator on non-range types.
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "Booking"
  ADD CONSTRAINT no_overlapping_confirmed_bookings
  EXCLUDE USING gist (
    "itemId" WITH =,
    tsrange("startDate", "endDate") WITH &&
  )
  WHERE (status IN ('CONFIRMED', 'ACTIVE'));

-- Notes:
--  * Only CONFIRMED/ACTIVE bookings are constrained — a REQUESTED booking
--    that's later rejected shouldn't have blocked anyone else's request.
--  * If a booking transitions into CONFIRMED/ACTIVE and violates this
--    constraint, Postgres raises an exclusion_violation error — catch this
--    in bookings.service.js and translate it into the same ConflictError
--    the app-level check would have thrown, so the API response is
--    consistent regardless of which layer caught the conflict.