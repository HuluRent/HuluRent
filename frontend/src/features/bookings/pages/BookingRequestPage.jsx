// Wraps BookingRequestForm with the listing data it needs (price, name,
// pricingUnit). Route: /listings/:itemId/book (see router.jsx), gated by
// VerifiedGuard.

import { useParams } from 'react-router-dom';
import { useListing } from '../../listings/hooks/useListing';
import { BookingRequestForm } from '../components/BookingRequestForm';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { EmptyState } from '../../../components/EmptyState';

export function BookingRequestPage() {
  const { listingId } = useParams();
  const { data: item, isLoading, isError } = useListing(listingId);

  if (isLoading) return <LoadingSpinner label="Loading listing…" />;
  if (isError || !item) {
    return <EmptyState icon="error" title="Listing not found" />;
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="font-headline-lg text-headline-lg text-on-surface mb-1">Request to Book</h1>
      <p className="font-body-md text-on-surface-variant mb-stack-lg">{item.name}</p>
      <BookingRequestForm item={item} />
    </div>
  );
}