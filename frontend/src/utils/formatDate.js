// Date formatting helpers. No date library dependency (date-fns/dayjs
// aren't installed) — native Date + Intl.DateTimeFormat cover everything
// this project needs (display formatting, date-only ISO strings for
// calendar comparisons).

export function formatDate(dateInput, { month = 'short', day = 'numeric', year = 'numeric' } = {}) {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (Number.isNaN(date?.getTime())) return '—';
  return date.toLocaleDateString('en-US', { month, day, year });
}

export function formatDateRange(startInput, endInput) {
  const start = typeof startInput === 'string' ? new Date(startInput) : startInput;
  const end = typeof endInput === 'string' ? new Date(endInput) : endInput;
  if (Number.isNaN(start?.getTime()) || Number.isNaN(end?.getTime())) return '—';

  const sameYear = start.getFullYear() === end.getFullYear();
  const startLabel = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endLabel = end.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: sameYear ? undefined : 'numeric',
  });
  return `${startLabel} – ${endLabel}, ${end.getFullYear()}`;
}

// 'YYYY-MM-DD' — used for date-only comparisons (calendar grids, availability
// windows) where time-of-day and timezone shifts would cause off-by-one bugs.
export function toISODateString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}