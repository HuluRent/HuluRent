// Hosts AvailabilityCalendar in view mode (FE-13's renter-facing reuse
// case) plus a price preview computed from the selected range.
//
// Deliberately scoped to FE-13 only: date selection + price preview.
// Actual booking submission (POST /bookings, error handling for the
// backend's overlap 409, etc.) is FE-14/FE-15's work — the submit button
// below is intentionally inert with a note, not silently absorbing that
// issue's scope.

import { useState } from 'react';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatDateRange } from '../../../utils/formatDate';
import { AvailabilityCalendar } from '../../listings/components/AvailabilityCalendar';

function daysBetween(startStr, endStr) {
  const start = new Date(startStr);
  const end = new Date(endStr);
  return Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1);
}

export function BookingRequestForm({ item }) {
  const [selectedRange, setSelectedRange] = useState(null); // { startDate, endDate } strings

  const days = selectedRange ? daysBetween(selectedRange.startDate, selectedRange.endDate) : 0;
  const total = selectedRange ? (parseFloat(item.pricePerUnit) * days).toFixed(2) : null;

  return (
    <div>
      <AvailabilityCalendar
        itemId={item.id}
        mode="view"
        onRangeSelect={(startDate, endDate) => setSelectedRange({ startDate, endDate })}
      />

      {selectedRange && (
        <div className="mt-stack-md bg-surface-container-lowest border border-outline-variant rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-body-md text-on-surface">{formatDateRange(selectedRange.startDate, selectedRange.endDate)}</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              {days} {days === 1 ? item.pricingUnit : `${item.pricingUnit}s`}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-outline-variant">
            <span className="font-headline-md text-headline-md text-on-surface">Total</span>
            <span className="font-price-display text-price-display text-primary-container">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      )}

      <button
        type="button"
        disabled={!selectedRange}
        title="Booking submission is tracked separately (FE-14/FE-15) — not yet wired"
        className="w-full mt-stack-md bg-primary-container text-on-primary font-headline-md text-headline-md px-4 py-3 rounded-lg shadow-subtle transition-all disabled:opacity-40"
      >
        Request Booking — coming soon
      </button>
    </div>
  );
}