// Edit an existing listing. Fetches current data via useListing, prefills
// ListingForm, and PATCHes only what changed (well — ListingForm always
// sends the full form; the backend's PATCH contract accepts a full or
// partial body either way, per api-reference.md).

import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useListing } from '../hooks/useListing';
import { updateListing } from '../../../api/listings.api';
import ListingForm from '../components/ListingForm';
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
    </div>
  );
}