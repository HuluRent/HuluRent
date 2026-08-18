-- ==============================================================================
-- HuluRent — Booking Overlap Exclusion Constraint Migration
-- ==============================================================================
-- Lives in: hulurent-docs (booking_overlap_constraint.sql)
-- Companion to: backend/prisma/manual-migrations/booking_overlap_constraint.sql
-- Referenced from: ARCHITECTURE.md §4.2 and schema.prisma
--
-- PURPOSE:
-- Enforces an infallible database-level exclusion constraint preventing two
-- CONFIRMED or ACTIVE bookings on the same item from overlapping in time.
-- This acts as the second layer in HuluRent's dual-layer concurrency defense.
-- ==============================================================================

-- 1. Enable btree_gist extension required for equality operators on UUID/text columns in GiST indices.
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- 2. Add the exclusion constraint on the Booking table.
ALTER TABLE "Booking"
  ADD CONSTRAINT no_overlapping_confirmed_bookings
  EXCLUDE USING gist (
    "itemId" WITH =,
    tsrange("startDate", "endDate") WITH &&
  )
  WHERE (status IN ('CONFIRMED', 'ACTIVE'));

-- Notes:
--  * Only CONFIRMED and ACTIVE bookings are constrained — a REQUESTED booking
--    that is subsequently rejected does not lock out subsequent requests.
--  * When a booking state transition violates this constraint, PostgreSQL raises
--    an exclusion_violation error, which is caught and mapped to a clean 409 ConflictError.
