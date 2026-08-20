import { useState } from 'react';
import { useNotifications, useMarkNotificationRead } from '../hooks/useNotifications';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { EmptyState } from '../../../components/EmptyState';
import { Pagination } from '../../../components/Pagination';

const typeConfig = {
  BOOKING_ACCEPTED: { icon: 'check_circle', label: 'Booking Accepted' },
  BOOKING_REJECTED: { icon: 'cancel', label: 'Booking Rejected' },
  BOOKING_CONFIRMED: { icon: 'verified', label: 'Booking Confirmed' },
  BOOKING_CANCELLED: { icon: 'event_busy', label: 'Booking Cancelled' },
  INSPECTION_REQUESTED: { icon: 'search', label: 'Inspection Requested' },
  MESSAGE_RECEIVED: { icon: 'chat', label: 'New Message' },
  REVIEW_RECEIVED: { icon: 'star', label: 'New Review' },
  EVIDENCE_SUBMITTED: { icon: 'photo_camera', label: 'Evidence Submitted' },
  AGREEMENT_READY: { icon: 'description', label: 'Agreement Ready' },
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
  const { data, isLoading, isError } = useNotifications({ page, limit: 20 });
  const markReadMut = useMarkNotificationRead();

  const items = data?.items || [];
  const total = data?.total || 0;

  if (isLoading) return <LoadingSpinner label="Loading notifications…" />;

  if (isError) {
    return <EmptyState icon="error" title="Failed to load" description="Could not load notifications." />;
  }

  const handleClick = (notif) => {
    if (!notif.readAt) {
      markReadMut.mutate(notif.id);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-headline-lg text-headline-lg text-on-surface mb-6">Notifications</h1>

      {items.length === 0 ? (
        <EmptyState icon="notifications_off" title="No notifications" description="You're all caught up!" />
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((notif) => {
            const config = typeConfig[notif.type] || { icon: 'info', label: notif.type };
            const isUnread = !notif.readAt;

            return (
              <button
                key={notif.id}
                onClick={() => handleClick(notif)}
                className={`w-full text-left p-4 rounded-xl border transition-colors flex items-start gap-3 ${
                  isUnread
                    ? 'bg-primary-container/30 border-primary/20'
                    : 'bg-surface-container-lowest border-outline-variant'
                }`}
              >
                <span className={`material-symbols-outlined text-xl mt-0.5 ${isUnread ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {config.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-label-md text-on-surface">{config.label}</span>
                    {isUnread && (
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    )}
                  </div>
                  <p className="font-body-sm text-on-surface-variant truncate">
                    {notif.payload?.message || 'You have a new notification.'}
                  </p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                    {formatRelativeDate(notif.createdAt)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {total > 20 && (
        <div className="mt-6">
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

