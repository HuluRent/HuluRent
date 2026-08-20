import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBookingDetails } from '../../../api/bookings.api';
import { ReviewForm } from '../components/ReviewForm';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { EmptyState } from '../../../components/EmptyState';

export default function ReviewSubmitPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const { data: booking, isLoading, isError } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => getBookingDetails(bookingId),
    enabled: !!bookingId,
  });

  if (isLoading) return <LoadingSpinner label="Loading booking…" />;

  if (isError || !booking) {
    return <EmptyState icon="error" title="Booking not found" description="Could not load booking details." />;
  }

  if (booking.status !== 'COMPLETED') {
    return (
      <div className="max-w-xl mx-auto text-center py-12">
        <EmptyState
          icon="rate_review"
          title="Review not available"
          description="Reviews can only be submitted for completed bookings."
        />
        <Link to={`/bookings/${bookingId}`} className="mt-4 inline-block font-label-md text-primary hover:underline">
          ← Back to Booking
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <Link to={`/bookings/${bookingId}`} className="font-label-md text-primary hover:underline mb-4 inline-block">
        ← Back to Booking
      </Link>

      <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">Leave a Review</h1>
      <p className="font-body-md text-on-surface-variant mb-6">
        How was your experience with <strong>{booking.item?.name || 'this item'}</strong>?
      </p>

      <ReviewForm
        bookingId={bookingId}
        onSuccess={() => navigate(`/bookings/${bookingId}`)}
      />
    </div>
  );
}

