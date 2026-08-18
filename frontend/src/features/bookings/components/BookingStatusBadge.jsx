import './BookingStatusBadge.css';

const STATUS_CONFIG = {
  REQUESTED: { label: 'Requested', className: 'hr-badge--requested' },
  ACCEPTED: { label: 'Accepted', className: 'hr-badge--accepted' },
  CONFIRMED: { label: 'Confirmed', className: 'hr-badge--confirmed' },
  ACTIVE: { label: 'Active', className: 'hr-badge--active' },
  RETURN_PENDING: { label: 'Return Pending', className: 'hr-badge--return-pending' },
  COMPLETED: { label: 'Completed', className: 'hr-badge--completed' },
  REJECTED: { label: 'Rejected', className: 'hr-badge--rejected' },
  CANCELLED: { label: 'Cancelled', className: 'hr-badge--cancelled' },
  EXPIRED: { label: 'Expired', className: 'hr-badge--expired' },
  DISPUTED: { label: 'Disputed', className: 'hr-badge--disputed' },
};

export function BookingStatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { label: status, className: 'hr-badge--default' };

  return (
    <span className={`hr-badge ${config.className}`}>
      {config.label}
    </span>
  );
}
