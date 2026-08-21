import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications, useMarkNotificationRead } from '../hooks/useNotifications';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { EmptyState } from '../../../components/EmptyState';
import { Pagination } from '../../../components/Pagination';

const typeConfig = {
  BOOKING_REQUESTED: { icon: 'event_available', label: 'Booking Requested', color: 'bg-amber-100 text-amber-700' },
  BOOKING_ACCEPTED: { icon: 'check_circle', label: 'Booking Accepted', color: 'bg-blue-100 text-blue-700' },
  BOOKING_REJECTED: { icon: 'cancel', label: 'Booking Rejected', color: 'bg-red-100 text-red-700' },
  BOOKING_CONFIRMED: { icon: 'verified', label: 'Booking Confirmed', color: 'bg-indigo-100 text-indigo-700' },
  BOOKING_CANCELLED: { icon: 'event_busy', label: 'Booking Cancelled', color: 'bg-red-100 text-red-700' },
  INSPECTION_REQUESTED: { icon: 'search', label: 'Inspection Requested', color: 'bg-purple-100 text-purple-700' },
  MESSAGE_RECEIVED: { icon: 'chat', label: 'New Message', color: 'bg-emerald-100 text-emerald-700' },
  REVIEW_RECEIVED: { icon: 'star', label: 'New Review', color: 'bg-orange-100 text-orange-700' },
  EVIDENCE_SUBMITTED: { icon: 'photo_camera', label: 'Evidence Submitted', color: 'bg-slate-100 text-slate-700' },
  AGREEMENT_READY: { icon: 'description', label: 'Agreement Ready', color: 'bg-slate-100 text-slate-700' },
};

function formatRelativeDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { data, isLoading, isError } = useNotifications({ page, limit: 20 });
  const markReadMut = useMarkNotificationRead();

  const items = data?.items || [];
  const total = data?.total || 0;

  if (isLoading) return (
    <div className="py-20 flex justify-center">
      <LoadingSpinner label="Loading notifications…" />
    </div>
  );

  if (isError) {
    return (
      <div className="py-20">
        <EmptyState icon="error" title="Failed to load" description="Could not load notifications." />
      </div>
    );
  }

  const handleClick = (notif) => {
    if (!notif.readAt) {
      markReadMut.mutate(notif.id);
    }
    if (notif.payload?.bookingId) {
      navigate(`/bookings/${notif.payload.bookingId}`);
    }
  };

  return (
    <div className="hr-container max-w-3xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-text tracking-tight">Notifications</h1>
      </div>

      {items.length === 0 ? (
        <div className="py-20 bg-white border border-surface-border rounded-3xl shadow-sm text-center">
          <EmptyState icon="notifications_off" title="No notifications" description="You're all caught up!" />
        </div>
      ) : (
        <div className="bg-white border border-surface-border rounded-2xl overflow-hidden shadow-sm flex flex-col">
          {items.map((notif, index) => {
            const config = typeConfig[notif.type] || { icon: 'info', label: notif.type, color: 'bg-slate-100 text-slate-700' };
            const isUnread = !notif.readAt;
            const isLast = index === items.length - 1;

            return (
              <button
                key={notif.id}
                onClick={() => handleClick(notif)}
                className={`w-full text-left p-5 transition-colors flex items-start gap-4 ${
                  !isLast ? 'border-b border-surface-border' : ''
                } ${
                  isUnread ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-surface-muted'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${config.color}`}>
                  <span className="material-symbols-outlined text-[24px]">
                    {config.icon}
                  </span>
                </div>

                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={`font-semibold text-sm ${isUnread ? 'text-primary' : 'text-text'}`}>
                      {config.label}
                    </span>
                    <span className="text-xs font-medium text-text-muted whitespace-nowrap">
                      {formatRelativeDate(notif.createdAt)}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed ${isUnread ? 'text-text font-medium' : 'text-text-muted'}`}>
                    {notif.payload?.message || 'You have a new notification.'}
                  </p>
                </div>

                {isUnread && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-3 shadow-sm" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {total > 20 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(total / 20)}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
