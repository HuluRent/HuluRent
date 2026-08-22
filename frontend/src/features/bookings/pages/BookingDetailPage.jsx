import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBookingDetails, acceptBooking, rejectBooking, confirmBooking, cancelBooking } from '../../../api/bookings.api';
import { BookingStatusBadge } from '../components/BookingStatusBadge';
import { BookingTimeline } from '../components/BookingTimeline';
import { useAuth } from '../../../hooks/useAuth';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { EmptyState } from '../../../components/EmptyState';
import { formatCurrency } from '../../../utils/formatCurrency';
import { ReviewForm } from '../../reviews/components/ReviewForm';

export default function BookingDetailPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth(); // Assume this provides current user ID

  const { data: bookingResponse, isLoading, error } = useQuery({
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
    return (
      <div className="hr-container py-20 flex justify-center">
        <LoadingSpinner label="Loading booking details..." />
      </div>
    );
  }

  const booking = bookingResponse?.data;

  if (error || !booking) {
    return (
      <div className="hr-container py-20">
        <EmptyState
          icon="error"
          title="Booking not found"
          description="This booking may have been removed or you don't have permission to view it."
        />
      </div>
    );
  }

  const isOwner = user?.id === booking.owner?.id;
  const isRenter = user?.id === booking.renter?.id;
  
  const hasReviewed = booking.reviews?.some(r => r.authorId === user?.id);

  const handleAction = (mutationFn) => {
    if (window.confirm('Are you sure you want to proceed with this action?')) {
      mutationFn();
    }
  };

  return (
    <div className="hr-container max-w-4xl mx-auto py-8">
      <button
        className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-6 text-sm font-medium"
        onClick={() => navigate('/bookings')}
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to My Bookings
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text mb-2 tracking-tight">Booking for {booking.item?.name || 'Item'}</h1>
          <p className="text-text-muted font-medium">Booking ID: {booking.id.substring(0, 8)}...</p>
        </div>
        <BookingStatusBadge status={booking.status} size="lg" />
      </div>

      <div className="mb-10 p-8 bg-surface-muted border border-surface-border rounded-2xl">
        <BookingTimeline currentStatus={booking.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-sm">
            <h2 className="text-xl font-bold text-text mb-6">Booking Details</h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4 pb-6 border-b border-surface-border">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">event</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-text-muted mb-1">Rental Period</div>
                  <div className="text-lg font-semibold text-text">
                    {new Date(booking.startDate).toLocaleDateString()} — {new Date(booking.endDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 pb-6 border-b border-surface-border">
                <div className="w-12 h-12 bg-accent/10 text-accent-500 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">payments</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-text-muted mb-1">Total Agreed Price</div>
                  <div className="text-xl font-bold text-text">{formatCurrency(parseFloat(booking.agreedPrice))}</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">person</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-text-muted mb-1">{isOwner ? 'Rented to' : 'Hosted by'}</div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-400">
                      <span className="material-symbols-outlined text-[16px]">person</span>
                    </div>
                    <span className="text-lg font-semibold text-text">
                      {isOwner ? booking.renter?.displayName : booking.owner?.displayName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {booking.status === 'COMPLETED' && !hasReviewed && (
            <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-sm">
              <h2 className="text-xl font-bold text-text mb-4">Leave a Review</h2>
              <p className="text-text-muted mb-6">How was your experience with {isOwner ? booking.renter?.displayName : booking.owner?.displayName}?</p>
              <ReviewForm 
                bookingId={booking.id} 
                onSuccess={() => queryClient.invalidateQueries({ queryKey: ['booking', bookingId] })} 
              />
            </div>
          )}
          
          {hasReviewed && (
            <div className="bg-surface-muted rounded-2xl border border-surface-border p-6 text-center text-text-muted flex flex-col items-center">
              <span className="material-symbols-outlined text-4xl mb-2 text-green-500">check_circle</span>
              <p className="font-medium text-text">You have left a review for this booking.</p>
            </div>
          )}
        </div>

        <div>
          <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-sm sticky top-[100px]">
            <h3 className="text-lg font-bold text-text mb-4">Manage Booking</h3>

            <div className="space-y-3">
              {booking.status === 'REQUESTED' && isOwner && (
                <>
                  <button
                    className="w-full hr-btn-primary"
                    onClick={() => handleAction(acceptMut.mutate)}
                    disabled={acceptMut.isPending || rejectMut.isPending}
                  >
                    Accept Request
                  </button>
                  <button
                    className="w-full hr-btn-secondary !text-red-600 !border-red-200 hover:!bg-red-50 hover:!border-red-300"
                    onClick={() => handleAction(rejectMut.mutate)}
                    disabled={acceptMut.isPending || rejectMut.isPending}
                  >
                    Reject Request
                  </button>
                </>
              )}

              {booking.status === 'ACCEPTED' && isRenter && (
                <button
                  className="w-full hr-btn-primary"
                  onClick={() => handleAction(confirmMut.mutate)}
                  disabled={confirmMut.isPending}
                >
                  Confirm Agreement
                </button>
              )}

              {['REQUESTED', 'ACCEPTED'].includes(booking.status) && isRenter && (
                <button
                  className="w-full hr-btn-secondary !text-red-600 !border-red-200 hover:!bg-red-50 hover:!border-red-300"
                  onClick={() => handleAction(cancelMut.mutate)}
                  disabled={cancelMut.isPending}
                >
                  Cancel Booking
                </button>
              )}

              {!['REQUESTED', 'ACCEPTED'].includes(booking.status) && (
                <div className="text-center p-4 bg-surface-muted rounded-xl text-text-muted text-sm border border-dashed border-surface-border">
                  No actions required from you at this stage.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
