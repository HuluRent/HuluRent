import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAgreement, useAcceptAgreement } from '../hooks/useAgreement';
import { AgreementViewer } from '../components/AgreementViewer';
import { useAuth } from '../../../hooks/useAuth';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { EmptyState } from '../../../components/EmptyState';

export default function AgreementReviewPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: agreement, isLoading, isError } = useAgreement(bookingId);
  const acceptMutation = useAcceptAgreement();

  if (isLoading) return <LoadingSpinner label="Loading agreement…" />;

  if (isError || !agreement) {
    return (
      <EmptyState
        icon="description"
        title="Agreement not found"
        description="No agreement exists for this booking yet."
      />
    );
  }

  const isOwner = user?.id === agreement.ownerId;
  const isRenter = user?.id === agreement.renterId;
  const hasAccepted = isOwner ? agreement.ownerAccepted : agreement.renterAccepted;

  const handleAccept = async () => {
    if (window.confirm('Are you sure you want to accept this agreement? This is binding.')) {
      try {
        await acceptMutation.mutateAsync(bookingId);
      } catch (err) {
        alert(err.response?.data?.error?.message || 'Failed to accept agreement.');
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Link to={`/bookings/${bookingId}`} className="font-label-md text-primary hover:underline mb-4 inline-block">
        ← Back to Booking
      </Link>

      <h1 className="font-headline-lg text-headline-lg text-on-surface mb-6">
        Review Agreement
      </h1>

      <AgreementViewer agreement={agreement} />

      {(isOwner || isRenter) && !hasAccepted && (
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleAccept}
            disabled={acceptMutation.isPending}
            className="px-6 py-2.5 bg-primary text-on-primary font-label-md rounded-xl hover:shadow-hover transition-all disabled:opacity-60"
          >
            {acceptMutation.isPending ? 'Accepting…' : 'Accept Agreement'}
          </button>
          <button
            onClick={() => navigate(`/bookings/${bookingId}`)}
            className="px-6 py-2.5 border border-outline-variant text-on-surface font-label-md rounded-xl hover:bg-surface-container transition-all"
          >
            Back
          </button>
        </div>
      )}

      {hasAccepted && (
        <div className="mt-6 p-4 bg-success-container rounded-xl flex items-center gap-2">
          <span className="material-symbols-outlined text-success">check_circle</span>
          <span className="font-body-md text-on-success-container">You have accepted this agreement.</span>
        </div>
      )}
    </div>
  );
}
