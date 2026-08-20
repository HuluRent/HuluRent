import { useParams, Link } from 'react-router-dom';
import { useInspections, useConfirmInspection, useCancelInspection, useCompleteInspection } from '../hooks/useInspection';
import { InspectionScheduler } from '../components/InspectionScheduler';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { EmptyState } from '../../../components/EmptyState';

const statusColors = {
  REQUESTED: 'bg-amber-100 text-amber-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export default function InspectionPage() {
  const { bookingId } = useParams();
  const { data, isLoading, isError } = useInspections(bookingId);
  const confirmMut = useConfirmInspection();
  const cancelMut = useCancelInspection();
  const completeMut = useCompleteInspection();

  const inspections = Array.isArray(data) ? data : data?.items || [];

  if (isLoading) return <LoadingSpinner label="Loading inspections…" />;

  if (isError) {
    return <EmptyState icon="error" title="Failed to load" description="Could not load inspections." />;
  }

  const handleAction = (mutFn, id) => {
    if (window.confirm('Are you sure?')) {
      mutFn.mutate(id);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Link to={`/bookings/${bookingId}`} className="font-label-md text-primary hover:underline mb-4 inline-block">
        ← Back to Booking
      </Link>

      <h1 className="font-headline-lg text-headline-lg text-on-surface mb-6">Inspections</h1>

      {inspections.length === 0 ? (
        <div className="mb-6">
          <EmptyState icon="search" title="No inspections yet" description="Schedule one below." />
        </div>
      ) : (
        <div className="flex flex-col gap-4 mb-6">
          {inspections.map((insp) => (
            <div key={insp.id} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-label-md text-on-surface">
                  {new Date(insp.scheduledAt).toLocaleString()}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full font-label-sm text-label-sm ${statusColors[insp.status] || 'bg-gray-100 text-gray-700'}`}>
                  {insp.status}
                </span>
              </div>
              {insp.notes && (
                <p className="font-body-sm text-on-surface-variant mb-3">{insp.notes}</p>
              )}
              <div className="flex gap-2">
                {insp.status === 'REQUESTED' && (
                  <>
                    <button onClick={() => handleAction(confirmMut, insp.id)} disabled={confirmMut.isPending}
                      className="px-4 py-2 bg-primary text-on-primary font-label-sm rounded-lg hover:shadow-hover transition-all disabled:opacity-60">
                      Confirm
                    </button>
                    <button onClick={() => handleAction(cancelMut, insp.id)} disabled={cancelMut.isPending}
                      className="px-4 py-2 border border-outline-variant text-on-surface font-label-sm rounded-lg hover:bg-surface-container transition-all disabled:opacity-60">
                      Cancel
                    </button>
                  </>
                )}
                {insp.status === 'CONFIRMED' && (
                  <>
                    <button onClick={() => handleAction(completeMut, insp.id)} disabled={completeMut.isPending}
                      className="px-4 py-2 bg-primary text-on-primary font-label-sm rounded-lg hover:shadow-hover transition-all disabled:opacity-60">
                      Mark Complete
                    </button>
                    <button onClick={() => handleAction(cancelMut, insp.id)} disabled={cancelMut.isPending}
                      className="px-4 py-2 border border-outline-variant text-on-surface font-label-sm rounded-lg hover:bg-surface-container transition-all disabled:opacity-60">
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <InspectionScheduler bookingId={bookingId} />
    </div>
  );
}
