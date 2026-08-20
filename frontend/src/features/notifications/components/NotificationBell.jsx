import { Link } from 'react-router-dom';
import { useUnreadCount } from '../hooks/useNotifications';

export function NotificationBell() {
  const unreadCount = useUnreadCount();

  return (
    <Link
      to="/notifications"
      className="navbar__icon-button relative"
      aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      title="Notifications"
    >
      <span className="material-symbols-outlined">notifications</span>
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-error text-on-error text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  );
}

export default NotificationBell;
