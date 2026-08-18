// Shared availability calendar — two modes, per ARCHITECTURE.md §4.2's
// explicit note on this reuse:
//   - mode="edit": owner defines new availability windows (listings feature)
//   - mode="view": renter picks a date range within an existing window
//     (reused inside bookings/BookingRequestForm.jsx)
//
// Honest limitation, not a bug: this calendar only reflects the owner's
// declared Availability windows — it does NOT cross-check existing
// CONFIRMED/ACTIVE bookings from other renters, since that data isn't
// fetched here. A date range can look selectable and still get rejected
// by the backend's dual overlap defense (bookings.conflict-check.js +
// the DB exclusion constraint — see ARCHITECTURE.md §3) if someone else
// booked it between page load and submit. BookingRequestForm.jsx must
// surface that 409 clearly rather than assume this calendar guarantees
// availability.

import { useState, useMemo } from 'react';
import { useAvailability, useCreateAvailability } from '../hooks/useAvailability';
import { toISODateString } from '../../../utils/formatDate';

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function isWithinWindow(dateStr, windows) {
  return windows.some((w) => dateStr >= toISODateString(new Date(w.startDate)) && dateStr <= toISODateString(new Date(w.endDate)));
}

function buildMonthGrid(viewMonth) {
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay.getDay();

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  return cells;
}

export function AvailabilityCalendar({ itemId, mode = 'view', onRangeSelect }) {
  const { data, isLoading } = useAvailability(itemId);
  const { mutate: submitWindow, isPending } = useCreateAvailability(itemId);

  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);

  const windows = data?.items ?? [];
  const cells = useMemo(() => buildMonthGrid(viewMonth), [viewMonth]);

  const today = toISODateString(new Date());

  function handleDayClick(date) {
    const dateStr = toISODateString(date);
    if (dateStr < today) return; // no past dates, either mode

    if (mode === 'view' && !isWithinWindow(dateStr, windows)) return; // renter can only pick within a declared window

    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(date);
      setRangeEnd(null);
      return;
    }

    // second click completes the range
    const [start, end] = date >= rangeStart ? [rangeStart, date] : [date, rangeStart];
    setRangeStart(start);
    setRangeEnd(end);

    if (mode === 'view') {
      onRangeSelect?.(toISODateString(start), toISODateString(end));
    }
  }

  function handleAddWindow() {
    if (!rangeStart || !rangeEnd) return;
    submitWindow(
      { itemId, startDate: toISODateString(rangeStart), endDate: toISODateString(rangeEnd) },
      { onSuccess: () => { setRangeStart(null); setRangeEnd(null); } }
    );
  }

  function isInSelection(dateStr) {
    if (!rangeStart) return false;
    const endBound = rangeEnd ?? rangeStart;
    const [lo, hi] = [toISODateString(rangeStart), toISODateString(endBound)].sort();
    return dateStr >= lo && dateStr <= hi;
  }

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4">
      <div className="flex justify-between items-center mb-3">
        <button
          type="button"
          onClick={() => setViewMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
          className="p-1.5 rounded-lg hover:bg-surface-container-low text-on-surface-variant"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <span className="font-headline-md text-headline-md text-on-surface">
          {viewMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </span>
        <button
          type="button"
          onClick={() => setViewMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
          className="p-1.5 rounded-lg hover:bg-surface-container-low text-on-surface-variant"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>

      {isLoading ? (
        <p className="font-body-sm text-body-sm text-on-surface-variant py-6 text-center">Loading availability…</p>
      ) : (
        <>
          <div className="grid grid-cols-7 gap-1 mb-1">
            {WEEKDAY_LABELS.map((w, i) => (
              <div key={i} className="text-center font-label-sm text-label-sm text-on-surface-variant py-1">
                {w}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((date, i) => {
              if (!date) return <div key={i} />;
              const dateStr = toISODateString(date);
              const available = isWithinWindow(dateStr, windows);
              const past = dateStr < today;
              const selected = isInSelection(dateStr);
              const clickable = mode === 'edit' ? !past : available && !past;

              return (
                <button
                  key={i}
                  type="button"
                  disabled={!clickable}
                  onClick={() => handleDayClick(date)}
                  className={[
                    'h-9 rounded-lg font-body-sm text-body-sm transition-colors',
                    past && 'text-on-surface-variant/40 cursor-not-allowed',
                    !past && selected && 'bg-primary-container text-on-primary',
                    !past && !selected && available && 'bg-primary-fixed-dim/30 text-on-surface hover:bg-primary-fixed-dim/50',
                    !past && !selected && !available && mode === 'view' && 'text-on-surface-variant/40 cursor-not-allowed',
                    !past && !selected && !available && mode === 'edit' && 'text-on-surface hover:bg-surface-container-low',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </>
      )}

      {mode === 'edit' && (
        <div className="mt-3 pt-3 border-t border-outline-variant flex items-center justify-between">
          <p className="font-label-sm text-label-sm text-on-surface-variant">
            {rangeStart && rangeEnd
              ? `${toISODateString(rangeStart)} → ${toISODateString(rangeEnd)}`
              : rangeStart
                ? 'Pick an end date'
                : 'Pick a start date to add a window'}
          </p>
          <button
            type="button"
            onClick={handleAddWindow}
            disabled={!rangeStart || !rangeEnd || isPending}
            className="px-3 py-1.5 bg-primary-container text-on-primary rounded-lg font-label-sm text-label-sm disabled:opacity-50"
          >
            {isPending ? 'Adding…' : 'Add Window'}
          </button>
        </div>
      )}

      {mode === 'view' && rangeStart && rangeEnd && (
        <p className="mt-3 pt-3 border-t border-outline-variant font-label-sm text-label-sm text-on-surface-variant">
          Selected: {toISODateString(rangeStart)} → {toISODateString(rangeEnd)}
        </p>
      )}
    </div>
  );
}