const STATUS_CONFIG = {
  REQUESTED: { label: 'Requested', className: 'bg-amber-100 text-amber-800 border-amber-200' },
  ACCEPTED: { label: 'Accepted', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  CONFIRMED: { label: 'Confirmed', className: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  ACTIVE: { label: 'Active', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  RETURN_PENDING: { label: 'Return Pending', className: 'bg-purple-100 text-purple-800 border-purple-200' },
  COMPLETED: { label: 'Completed', className: 'bg-slate-100 text-slate-800 border-slate-200' },
  REJECTED: { label: 'Rejected', className: 'bg-red-100 text-red-800 border-red-200' },
  CANCELLED: { label: 'Cancelled', className: 'bg-red-100 text-red-800 border-red-200' },
  EXPIRED: { label: 'Expired', className: 'bg-slate-100 text-slate-600 border-slate-200' },
  DISPUTED: { label: 'Disputed', className: 'bg-orange-100 text-orange-800 border-orange-200' },
};

export function BookingStatusBadge({ status, size = 'sm' }) {
  const config = STATUS_CONFIG[status] || { label: status, className: 'bg-slate-100 text-slate-800 border-slate-200' };

  const sizeClasses = size === 'sm'
    ? 'px-2.5 py-0.5 text-xs'
    : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${sizeClasses} ${config.className}`}>
      {config.label}
    </span>
  );
}
