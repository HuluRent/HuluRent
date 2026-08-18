import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBookingDetails, acceptBooking, rejectBooking, confirmBooking, cancelBooking } from '../../../api/bookings.api';
import { BookingStatusBadge } from '../components/BookingStatusBadge';
import { BookingTimeline } from '../components/BookingTimeline';
import { useAuth } from '../../../hooks/useAuth';
import './BookingDetailPage.css';

export default function BookingDetailPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth(); // Assume this provides current user ID

  const { data: booking, isLoading, error } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => getBookingDetails(bookingId),
  });

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', bookingId] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'mine'] });
    },
    onError: (err) => {
      alert(err.response?.data?.error?.message || 'Action failed. Please try again.');
    }
  };

  const acceptMut = useMutation({ mutationFn: () => acceptBooking(bookingId), ...mutationOptions });
  const rejectMut = useMutation({ mutationFn: () => rejectBooking(bookingId), ...mutationOptions });
  const confirmMut = useMutation({ mutationFn: () => confirmBooking(bookingId), ...mutationOptions });
  const cancelMut = useMutation({ mutationFn: () => cancelBooking(bookingId), ...mutationOptions });

  if (isLoading) {
    return <div className="hr-booking-detail hr-booking-detail--loading">Loading booking details...</div>;
  }

  if (error || !booking) {
    return (
      <div className="hr-booking-detail hr-booking-detail--error">
        <h3>Booking not found</h3>
        <button onClick={() => navigate('/bookings')} className="hr-btn-secondary">View My Bookings</button>
      </div>
    );
  }

  const isOwner = user?.id === booking.owner?.id;
  const isRenter = user?.id === booking.renter?.id;

  const handleAction = (mutationFn) => {
    if (window.confirm('Are you sure you want to proceed with this action?')) {
      mutationFn();
    }
  };

  return (
    <div className="hr-booking-detail">
      <div className="hr-booking-detail__header">
        <button className="hr-booking-detail__back" onClick={() => navigate('/bookings')}>
          &larr; Back to My Bookings
        </button>
        <div className="hr-booking-detail__title-row">
          <h1>Booking for {booking.item?.name || 'Item'}</h1>
          <BookingStatusBadge status={booking.status} />
        </div>
      </div>

      <div className="hr-booking-detail__timeline-container">
        <BookingTimeline currentStatus={booking.status} />
      </div>

      <div className="hr-booking-detail__content">
        <div className="hr-booking-detail__card">
          <h3>Details</h3>
          <dl className="hr-booking-detail__list">
            <div>
              <dt>Dates</dt>
              <dd>
                {new Date(booking.startDate).toLocaleDateString()} &mdash; {new Date(booking.endDate).toLocaleDateString()}
              </dd>
            </div>
            <div>
              <dt>Agreed Price</dt>
              <dd>{parseFloat(booking.agreedPrice).toLocaleString()} ETB</dd>
            </div>
            <div>
              <dt>{isOwner ? 'Renter' : 'Owner'}</dt>
              <dd>
                {isOwner ? booking.renter?.displayName : booking.owner?.displayName}
              </dd>
            </div>
          </dl>
        </div>

        <div className="hr-booking-detail__actions">
          <h3>Actions</h3>
          <div className="hr-booking-detail__action-buttons">
            {booking.status === 'REQUESTED' && isOwner && (
              <>
                <button 
                  className="hr-btn-primary" 
                  onClick={() => handleAction(acceptMut.mutate)}
                  disabled={acceptMut.isPending || rejectMut.isPending}
                >
                  Accept Request
                </button>
                <button 
                  className="hr-btn-secondary hr-btn-danger" 
                  onClick={() => handleAction(rejectMut.mutate)}
                  disabled={acceptMut.isPending || rejectMut.isPending}
                >
                  Reject Request
                </button>
              </>
            )}

            {booking.status === 'ACCEPTED' && isRenter && (
              <button 
                className="hr-btn-primary" 
                onClick={() => handleAction(confirmMut.mutate)}
                disabled={confirmMut.isPending}
              >
                Confirm Agreement
              </button>
            )}

            {['REQUESTED', 'ACCEPTED'].includes(booking.status) && isRenter && (
              <button 
                className="hr-btn-secondary hr-btn-danger" 
                onClick={() => handleAction(cancelMut.mutate)}
                disabled={cancelMut.isPending}
              >
                Cancel Booking
              </button>
            )}

            {!['REQUESTED', 'ACCEPTED'].includes(booking.status) && (
              <p className="hr-booking-detail__no-actions">No further actions available at this stage.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
