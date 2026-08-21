import { useParams } from 'react-router-dom';
import { useListing } from '../../listings/hooks/useListing';
import { BookingRequestForm } from '../components/BookingRequestForm';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { EmptyState } from '../../../components/EmptyState';

export function BookingRequestPage() {
  const { listingId } = useParams();
  const { data: item, isLoading, isError } = useListing(listingId);

  if (isLoading) return (
    <div className="hr-container py-20 flex justify-center">
      <LoadingSpinner label="Loading listing…" />
    </div>
  );

  if (isError || !item) {
    return (
      <div className="hr-container py-20">
        <EmptyState icon="error" title="Listing not found" />
      </div>
    );
  }

  return (
    <div className="hr-container max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-text mb-2">Request to Book</h1>
      <p className="text-text-muted mb-8 text-lg">{item.name}</p>

      <div className="bg-white rounded-2xl border border-surface-border shadow-sm overflow-hidden">
        <div className="p-6 md:p-8">
          <BookingRequestForm item={item} />
        </div>
      </div>
    </div>
  );
}