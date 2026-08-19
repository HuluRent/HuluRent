// Create a new listing. Redirects to the new listing's detail page on
// success — the owner sees exactly what a renter would see, immediately.

import { useNavigate } from 'react-router-dom';
import { useCreateListing } from '../hooks/useCreateListing';
import ListingForm from '../components/ListingForm';
import './ListingCreatePage.css';

export function ListingCreatePage() {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useCreateListing();

  function handleSubmit(data) {
    mutate(data, {
      onSuccess: (listing) => navigate(`/listings/${listing.id}`),
    });
  }

  return (
    <div>
      <h1 className="font-headline-lg text-headline-lg text-on-surface mb-stack-lg">List an Item</h1>
      {error && (
        <p className="mb-stack-md font-body-sm text-body-sm text-error">
          Couldn't create the listing. Try again in a moment.
        </p>
      )}
      <ListingForm onSubmit={handleSubmit} isSubmitting={isPending} submitLabel="Create Listing" />
    </div>
  );
}
