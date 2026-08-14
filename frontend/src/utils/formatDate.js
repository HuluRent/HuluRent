// Formats: "Aug 14, 2026"
export function formatDate(date) {
  const d = new Date(date);
  if (isNaN(d)) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Formats: "Aug 14, 2026, 3:45 PM"
export function formatDateTime(date) {
  const d = new Date(date);
  if (isNaN(d)) return '';
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
}

// Formats a booking range: "Aug 14 – Aug 18, 2026"
export function formatDateRange(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  if (isNaN(s) || isNaN(e)) return '';

  const sameYear = s.getFullYear() === e.getFullYear();
  const sameMonth = sameYear && s.getMonth() === e.getMonth();

  const startFmt = s.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: sameYear ? undefined : 'numeric',
  });
  const endFmt = e.toLocaleDateString('en-US', {
    month: sameMonth ? undefined : 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return `${startFmt} – ${endFmt}`;
}

// "2 days ago", "in 3 days", "today"
export function formatRelative(date) {
  const d = new Date(date);
  if (isNaN(d)) return '';

  const now = new Date();
  const diffMs = d.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0);
  const diffDays = Math.round(diffMs / 86400000);

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'tomorrow';
  if (diffDays === -1) return 'yesterday';
  if (diffDays > 0) return `in ${diffDays} days`;
  return `${Math.abs(diffDays)} days ago`;
}

// Number of nights between two dates (booking duration)
export function nightsBetween(start, end) {
  const s = new Date(start).setHours(0, 0, 0, 0);
  const e = new Date(end).setHours(0, 0, 0, 0);
  return Math.round((e - s) / 86400000);
}