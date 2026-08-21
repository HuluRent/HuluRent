import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateListing } from '../hooks/useCreateListing';
import ListingForm from '../components/ListingForm';
import { AvailabilityCalendar } from '../components/AvailabilityCalendar';

export function ListingCreatePage() {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useCreateListing();
  const [createdListingId, setCreatedListingId] = useState(null);

  function handleSubmit(data) {
    mutate(data, {
      onSuccess: (listing) => setCreatedListingId(listing.id),
    });
  }

  function handleFinish() {
    navigate(`/listings/${createdListingId}`);
  }

  return (
    <div className="hr-container max-w-3xl mx-auto py-8">
      <div className="mb-8 border-b border-surface-border pb-6">
        <h1 className="text-3xl font-bold text-text mb-2">
          {createdListingId ? 'Set Availability' : 'List an Item'}
        </h1>
        <p className="text-text-muted text-lg">
          {createdListingId
            ? 'When can renters book this item? Select dates to add availability windows.'
            : 'Turn your unused items into extra income.'}
        </p>
      </div>

      {error && !createdListingId && (
        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700 text-sm font-medium">
          <span className="material-symbols-outlined text-red-500">error</span>
          Couldn't create the listing. Try again in a moment.
        </div>
      )}

      <div className="bg-white rounded-3xl border border-surface-border shadow-sm p-6 md:p-8">
        {!createdListingId ? (
          <ListingForm onSubmit={handleSubmit} isSubmitting={isPending} submitLabel="Create Listing & Continue" />
        ) : (
          <div className="flex flex-col gap-6">
            <AvailabilityCalendar itemId={createdListingId} mode="edit" />
            <div className="flex justify-end pt-4 border-t border-surface-border">
              <button
                onClick={handleFinish}
                className="hr-btn-primary"
              >
                Finish & View Listing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListingCreatePage;
