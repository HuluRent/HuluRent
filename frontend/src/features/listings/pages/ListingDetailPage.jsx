import { Link, useParams } from 'react-router-dom';
import { useListing } from '../hooks/useListing';
import { ListingGallery } from '../components/ListingGallery';
import { useAuth } from '../../../hooks/useAuth';
import {
  useSavedList,
  useAddToSavedList,
  useRemoveFromSavedList,
} from '../../savedList/hooks/useSavedList';
import './ListingDetailPage.css';

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-ET', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export function ListingDetailPage() {
  const { listingId } = useParams();

  const {
    data: listing,
    isLoading,
    isError,
    error,
  } = useListing(listingId);

  const { isAuthenticated } = useAuth();
  const { data: savedListData } = useSavedList({ enabled: isAuthenticated });
  const addMutation = useAddToSavedList();
  const removeMutation = useRemoveFromSavedList();

  const isSaved = isAuthenticated && savedListData
    ? savedListData.some((entry) => entry.listingId === listingId)
    : false;
  const isSavePending = addMutation.isPending || removeMutation.isPending;

  function handleSaveToggle() {
    if (isSavePending) return;
    if (isSaved) {
      removeMutation.mutate(listingId);
    } else {
      addMutation.mutate(listingId);
    }
  }

  if (isLoading) {
    return <main>Loading listing...</main>;
  }

  if (isError) {
    const status = error?.response?.status;

    if (status === 403 || status === 404) {
      return (
        <main className="listing-detail-page">
          <h1>Listing not found</h1>
          <p>
            This listing is unavailable or you do not have permission to
            view it.
          </p>
          <Link to="/">Back to home</Link>
        </main>
      );
    }

    return (
      <main className="listing-detail-page">
        <h1>Unable to load listing</h1>
        <p>Please try again later.</p>
        <Link to="/">Back to home</Link>
      </main>
    );
  }

  if (!listing) {
    return (
      <main className="listing-detail-page">
        <h1>Listing not found</h1>
        <Link to="/">Back to home</Link>
      </main>
    );
  }

  return (
    <main className="listing-detail-page">
      <section>
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1>{listing.name}</h1>

          {isAuthenticated && (
            <button
              onClick={handleSaveToggle}
              disabled={isSavePending}
              aria-label={isSaved ? 'Remove from Saved List' : 'Save listing'}
              aria-pressed={isSaved}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container transition-colors disabled:opacity-50"
            >
              <span
                className={`material-symbols-outlined ${isSaved ? 'text-primary' : 'text-on-surface-variant'}`}
                style={isSaved ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                bookmark
              </span>
              <span className="font-label-md text-on-surface">
                {isSavePending ? 'Saving…' : isSaved ? 'Saved' : 'Save'}
              </span>
            </button>
          )}
        </div>

        <ListingGallery
          images={listing.images}
          alt={listing.name}
        />

        <p>{listing.description}</p>

        <div className="listing-detail-page__info-grid">
          <div className="listing-detail-page__info-row">
            <span className="listing-detail-page__info-label">Category:</span>
            <span className="listing-detail-page__info-value">{listing.category?.name || 'Uncategorized'}</span>
          </div>

          <div className="listing-detail-page__info-row">
            <span className="listing-detail-page__info-label">Price:</span>
            <span className="listing-detail-page__info-value">{listing.pricePerUnit} / {listing.pricingUnit}</span>
          </div>

          {listing.depositAmount && (
            <div className="listing-detail-page__info-row">
              <span className="listing-detail-page__info-label">Deposit:</span>
              <span className="listing-detail-page__info-value">{listing.depositAmount}</span>
            </div>
          )}

          <div className="listing-detail-page__info-row">
            <span className="listing-detail-page__info-label">Location:</span>
            <span className="listing-detail-page__info-value">{listing.approxLocation}</span>
          </div>

          <div className="listing-detail-page__info-row">
            <span className="listing-detail-page__info-label">Status:</span>
            <span className="listing-detail-page__info-value">{listing.status}</span>
          </div>

          {listing.availabilities?.length > 0 && (
            <>
              <div className="listing-detail-page__info-row">
                <span className="listing-detail-page__info-label">Available From:</span>
                <span className="listing-detail-page__info-value">
                  {formatDate(listing.availabilities[0].startDate)}
                </span>
              </div>
              <div className="listing-detail-page__info-row">
                <span className="listing-detail-page__info-label">Available Until:</span>
                <span className="listing-detail-page__info-value">
                  {formatDate(listing.availabilities[0].endDate)}
                </span>
              </div>
            </>
          )}
        </div>

        <Link to={`/listings/${listing.id}/book`}>
          Book this listing
        </Link>
      </section>
    </main>
  );
}