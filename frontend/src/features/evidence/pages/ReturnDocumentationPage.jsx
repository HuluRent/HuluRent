import { useParams, Link } from 'react-router-dom';
import { useEvidence, useAcknowledgeEvidence } from '../hooks/useUploadEvidence';
import { ConditionForm } from '../components/ConditionForm';
import { useAuth } from '../../../hooks/useAuth';
import { LoadingSpinner } from '../../../components/LoadingSpinner';

export default function ReturnDocumentationPage() {
  const { bookingId } = useParams();
  const { user } = useAuth();
  const { data, isLoading } = useEvidence(bookingId);
  const ackMutation = useAcknowledgeEvidence();

  const allEvidence = Array.isArray(data) ? data : data?.items || [];
  const returnEvidence = allEvidence.filter((e) => e.type === 'RETURN');

  if (isLoading) return <LoadingSpinner label="Loading documentation…" />;

  const hasEvidence = returnEvidence.length > 0;
  const latestEvidence = hasEvidence ? returnEvidence[returnEvidence.length - 1] : null;

  const isSubmitter = latestEvidence?.submittedById === user?.id;
  const needsAck = latestEvidence && (
    (isSubmitter && !latestEvidence.acknowledgedByRenter) ||
    (!isSubmitter && !latestEvidence.acknowledgedByOwner)
  );

  return (
    <div className="max-w-3xl mx-auto">
      <Link to={`/bookings/${bookingId}`} className="font-label-md text-primary hover:underline mb-4 inline-block">
        ← Back to Booking
      </Link>

      <h1 className="font-headline-lg text-headline-lg text-on-surface mb-6">
        Return Documentation
      </h1>

      {hasEvidence && latestEvidence && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 mb-6">
          <h3 className="font-headline-sm text-on-surface mb-4">Submitted Evidence</h3>

          {latestEvidence.photoUrls?.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-4">
              {latestEvidence.photoUrls.map((url, i) => (
                <img key={i} src={url} alt={`Return photo ${i + 1}`} className="w-28 h-28 rounded-xl object-cover border border-outline-variant" />
              ))}
            </div>
          )}

          {latestEvidence.conditionNotes && (
            <p className="font-body-md text-on-surface mb-4">{latestEvidence.conditionNotes}</p>
          )}

          <div className="flex gap-4 text-sm">
            <span className={latestEvidence.acknowledgedByOwner ? 'text-green-600' : 'text-on-surface-variant'}>
              Owner: {latestEvidence.acknowledgedByOwner ? '✓ Acknowledged' : 'Pending'}
            </span>
            <span className={latestEvidence.acknowledgedByRenter ? 'text-green-600' : 'text-on-surface-variant'}>
              Renter: {latestEvidence.acknowledgedByRenter ? '✓ Acknowledged' : 'Pending'}
            </span>
          </div>

          {!isSubmitter && needsAck && (
            <button
              onClick={() => ackMutation.mutate(latestEvidence.id)}
              disabled={ackMutation.isPending}
              className="mt-4 px-5 py-2.5 bg-primary text-on-primary font-label-md rounded-xl hover:shadow-hover transition-all disabled:opacity-60"
            >
              {ackMutation.isPending ? 'Acknowledging…' : 'Acknowledge'}
            </button>
          )}
        </div>
      )}

      {!hasEvidence && (
        <ConditionForm bookingId={bookingId} evidenceType="RETURN" />
      )}
    </div>
  );
}
