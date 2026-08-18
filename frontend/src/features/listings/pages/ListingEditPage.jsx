// Edit an existing listing. Fetches current data via useListing, prefills
// ListingForm, and PATCHes only what changed (well — ListingForm always
// sends the full form; the backend's PATCH contract accepts a full or
// partial body either way, per api-reference.md).
//
// Also hosts the AvailabilityCalendar in edit mode (FE-13) — availability
// windows reference an itemId, so this only makes sense once the item
// exists, hence living on the edit page rather than the create page.

import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useListing } from '../hooks/useListing';
import { updateListing } from '../../../api/listings.api';
import { ListingForm } from '../components/ListingForm';
import { AvailabilityCalendar } from '../components/AvailabilityCalendar';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { EmptyState } from '../../../components/EmptyState';

export function ListingEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: item, isLoading, isError } = useListing(id);

  const { mutate, isPending, error } = useMutation({
    mutationFn: (data) => updateListing(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listing', id] });
      queryClient.invalidateQueries({ queryKey: ['my-listings'] });
      navigate(`/listings/${id}`);
    },
  });

  if (isLoading) return <LoadingSpinner label="Loading listing…" />;
  if (isError || !item) {
    return <EmptyState icon="error" title="Listing not found" />;
  }

  return (
    <div>
      <h1 className="font-headline-lg text-headline-lg text-on-surface mb-stack-lg">Edit Listing</h1>
      {error && (
        <p className="mb-stack-md font-body-sm text-body-sm text-error">
          Couldn't save changes. Try again in a moment.
        </p>
      )}
      <ListingForm initialData={item} onSubmit={mutate} isSubmitting={isPending} submitLabel="Save Changes" />

      <div className="max-w-2xl mt-stack-lg">
        <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-md">Availability</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-stack-md">
          Mark date ranges when this item is available to rent. Renters can only request booking dates
          within a window you've added here.
        </p>
        <AvailabilityCalendar itemId={id} mode="edit" />
      </div>
    </div>
  );
}