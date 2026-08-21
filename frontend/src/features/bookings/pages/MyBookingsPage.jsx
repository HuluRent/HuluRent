import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyBookings } from '../hooks/useMyBookings';
import { BookingStatusBadge } from '../components/BookingStatusBadge';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { EmptyState } from '../../../components/EmptyState';
import { formatCurrency } from '../../../utils/formatCurrency';

export default function MyBookingsPage() {
  const [role, setRole] = useState('renter'); // 'renter' or 'owner'
  const navigate = useNavigate();

  const { data: bookingsData, isLoading, error } = useMyBookings(role);

  const bookings = bookingsData?.items || [];

  return (
    <div className="hr-container max-w-5xl mx-auto py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-text tracking-tight">My Bookings</h1>

        <div className="bg-surface-muted p-1 rounded-xl flex items-center shadow-sm border border-surface-border">
          <button
            type="button"
            className={`px-6 py-2 text-sm font-medium rounded-lg transition-all ${
              role === 'renter'
                ? 'bg-white text-text shadow-sm border border-surface-border'
                : 'text-text-muted hover:text-text'
            }`}
            onClick={() => setRole('renter')}
          >
            Renting
          </button>
          <button
            type="button"
            className={`px-6 py-2 text-sm font-medium rounded-lg transition-all ${
              role === 'owner'
                ? 'bg-white text-text shadow-sm border border-surface-border'
                : 'text-text-muted hover:text-text'
            }`}
            onClick={() => setRole('owner')}
          >
            Lending
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner label="Loading bookings..." />
        </div>
      ) : error ? (
        <div className="py-20">
          <EmptyState
            icon="error"
            title="Failed to load bookings"
            description="Please try again later."
          />
        </div>
      ) : bookings.length === 0 ? (
        <div className="py-20 border border-dashed border-slate-300 rounded-2xl bg-surface-muted">
          <EmptyState
            icon="calendar_month"
            title={`No bookings as a ${role}`}
            description={role === 'renter' ? 'Find items to rent and start booking.' : 'No one has booked your items yet.'}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white border border-surface-border rounded-xl overflow-hidden shadow-sm hover:shadow-card hover:-translate-y-1 transition-all cursor-pointer group flex flex-col"
              onClick={() => navigate(`/bookings/${booking.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/bookings/${booking.id}`) }}
            >
              <div className="h-40 bg-surface-muted relative overflow-hidden">
                {booking.item?.thumbnailUrl ? (
                  <img src={booking.item.thumbnailUrl} alt={booking.item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted">
                    <span className="material-symbols-outlined text-4xl opacity-20">image</span>
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <BookingStatusBadge status={booking.status} />
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-text text-lg mb-4 line-clamp-1 group-hover:text-primary transition-colors">
                  {booking.item?.name || 'Item'}
                </h3>

                <div className="space-y-3 mt-auto">
                  <div className="flex items-center gap-3 text-text-muted text-sm">
                    <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                    <span>
                      {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-text-muted text-sm">
                    <span className="material-symbols-outlined text-[18px]">person</span>
                    <span>{role === 'renter' ? `Owner: ${booking.owner?.displayName}` : `Renter: ${booking.renter?.displayName}`}</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-surface-border flex justify-between items-center">
                  <span className="text-sm text-text-muted font-medium">Total</span>
                  <span className="font-bold text-text text-lg">{formatCurrency(parseFloat(booking.agreedPrice))}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
