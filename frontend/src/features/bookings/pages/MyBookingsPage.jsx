import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyBookings } from '../hooks/useMyBookings';
import { BookingStatusBadge } from '../components/BookingStatusBadge';
import './MyBookingsPage.css';

export default function MyBookingsPage() {
  const [role, setRole] = useState('renter'); // 'renter' or 'owner'
  const navigate = useNavigate();

  const { data: bookingsData, isLoading, error } = useMyBookings(role);

  const bookings = bookingsData?.items || [];

  return (
    <div className="hr-my-bookings">
      <div className="hr-my-bookings__header">
        <h1>My Bookings</h1>
        <div className="hr-my-bookings__toggle" role="group" aria-label="Role toggle">
          <button
            type="button"
            className={`hr-my-bookings__toggle-btn ${role === 'renter' ? 'hr-my-bookings__toggle-btn--active' : ''}`}
            onClick={() => setRole('renter')}
          >
            Renting
          </button>
          <button
            type="button"
            className={`hr-my-bookings__toggle-btn ${role === 'owner' ? 'hr-my-bookings__toggle-btn--active' : ''}`}
            onClick={() => setRole('owner')}
          >
            Lending
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="hr-my-bookings__state">Loading bookings...</div>
      ) : error ? (
        <div className="hr-my-bookings__state hr-my-bookings__state--error">
          Failed to load bookings. Please try again later.
        </div>
      ) : bookings.length === 0 ? (
        <div className="hr-my-bookings__state">
          <p>You have no bookings as a {role}.</p>
          {role === 'renter' && (
            <button className="hr-btn-primary hr-btn-primary--auto" onClick={() => navigate('/search')}>
              Find items to rent
            </button>
          )}
        </div>
      ) : (
        <div className="hr-my-bookings__list">
          {bookings.map((booking) => (
            <div 
              key={booking.id} 
              className="hr-my-bookings__card"
              onClick={() => navigate(`/bookings/${booking.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/bookings/${booking.id}`) }}
            >
              <div className="hr-my-bookings__card-header">
                <h3>{booking.item?.name || 'Item'}</h3>
                <BookingStatusBadge status={booking.status} />
              </div>
              
              <div className="hr-my-bookings__card-body">
                <div className="hr-my-bookings__card-detail">
                  <span className="material-symbols-outlined">calendar_today</span>
                  <span>
                    {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="hr-my-bookings__card-detail">
                  <span className="material-symbols-outlined">payments</span>
                  <span>{parseFloat(booking.agreedPrice).toLocaleString()} ETB</span>
                </div>
                <div className="hr-my-bookings__card-detail">
                  <span className="material-symbols-outlined">person</span>
                  <span>{role === 'renter' ? `Owner: ${booking.owner?.displayName}` : `Renter: ${booking.renter?.displayName}`}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
