import { useMemo, useState } from 'react';
import {
  useSavedList,
  useRemoveFromSavedList,
} from '../hooks/useSavedList';
import { ListingCard } from '../../listings/components/ListingCard';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { EmptyState } from '../../../components/EmptyState';
import { Link } from 'react-router-dom';

export default function SavedListPage() {
  const { data: savedListings, isLoading, isError } = useSavedList();
  const removeMutation = useRemoveFromSavedList();
  const [pendingId, setPendingId] = useState(null);

  // Build a Set of all saved IDs for the card component
  const savedIds = useMemo(() => {
    if (!savedListings) return new Set();
    return new Set(savedListings.map((entry) => entry.listingId));
  }, [savedListings]);

  function handleUnsave(listingId) {
    setPendingId(listingId);
    removeMutation.mutate(listingId, { onSettled: () => setPendingId(null) });
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-display-md text-on-surface mb-6">Saved List</h1>

      {isLoading && <LoadingSpinner label="Loading your saved listings…" />}

      {isError && (
        <EmptyState
          icon="error"
          title="Couldn't load your saved list"
          description="Something went wrong. Please try again later."
        />
      )}

      {!isLoading && !isError && savedListings?.length === 0 && (
        <EmptyState
          icon="bookmark"
          title="No saved listings yet"
          description="Browse listings and tap the bookmark icon to save ones you're interested in."
          action={<Link to="/search" className="btn-primary">Browse Listings</Link>}
        />
      )}

      {!isLoading && !isError && savedListings?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-gutter">
          {savedListings.map((entry) => {
            // Shape the listing data to match what ListingCard expects
            const item = {
              ...entry.listing,
              thumbnailUrl: entry.listing.images?.[0]?.url ?? null,
            };
            return (
              <ListingCard
                key={entry.id}
                item={item}
                isSaved={savedIds.has(entry.listingId)}
                onUnsave={handleUnsave}
                isSavePending={pendingId === entry.listingId}
              />
            );
          })}
        </div>
      )}
    </main>
  );
}
