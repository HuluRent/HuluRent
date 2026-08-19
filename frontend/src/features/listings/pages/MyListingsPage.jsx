// Owner's listing management view. Deliberately not reusing ListingCard
// (search/listings/components/ListingCard.jsx) — that component shows
// "Provided by [owner]" and reviewer-facing info that makes no sense on
// your own management page. This is a simpler row layout with status
// and manage actions instead.

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMyListings } from '../hooks/useMyListings';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { EmptyState } from '../../../components/EmptyState';
import { Pagination } from '../../../components/Pagination';
import { formatCurrency } from '../../../utils/formatCurrency';

const STATUS_STYLES = {
  DRAFT: 'bg-surface-container-high text-on-surface-variant',
  PUBLISHED: 'bg-primary-container text-on-primary',
  UNAVAILABLE: 'bg-tertiary-container text-on-tertiary-container',
  SUSPENDED: 'bg-error-container text-on-error-container',
  ARCHIVED: 'bg-surface-container text-on-surface-variant',
};

function StatusBadge({ status }) {
  return (
    <span className={`px-2 py-1 rounded-full font-label-sm text-label-sm ${STATUS_STYLES[status] ?? ''}`}>
      {status}
    </span>
  );
}

export function MyListingsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useMyListings(page);

  return (
    <div>
      <div className="flex justify-between items-center mb-stack-lg">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">My Listings</h1>
        <Link
          to="/listings/create"
          className="font-label-sm text-label-sm bg-primary-container text-on-primary px-4 py-2 rounded-lg shadow-subtle hover:shadow-hover transition-all"
        >
          List a New Item
        </Link>
      </div>

      {isLoading && <LoadingSpinner label="Loading your listings…" />}

      {isError && (
        <EmptyState
          icon="error"
          title="Couldn't load your listings"
          description="Something went wrong reaching the server. Try again in a moment."
        />
      )}

      {!isLoading && !isError && data?.items?.length === 0 && (
        <EmptyState
          icon="inventory_2"
          title="You haven't listed anything yet"
          description="List your first item to start earning from things you're not using."
        />
      )}

      {!isLoading && !isError && data?.items?.length > 0 && (
        <div className="flex flex-col gap-3">
          {data.items.map((item) => (
            <div
              key={item.id}
              className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-center gap-4"
            >
              <div className="w-16 h-16 rounded-lg bg-surface-variant flex-shrink-0 overflow-hidden flex items-center justify-center">
                {item.images?.[0]?.url ? (
                  <img src={item.images[0].url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-on-surface-variant">image</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-headline-md text-headline-md text-on-surface truncate">{item.name}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {formatCurrency(item.pricePerUnit)} / {item.pricingUnit}
                </p>
              </div>

              <StatusBadge status={item.status} />

              <div className="flex gap-2 flex-shrink-0">
                <Link
                  to={`/listings/${item.id}`}
                  className="px-3 py-1.5 border border-outline-variant rounded-lg font-label-sm text-label-sm text-on-surface hover:bg-surface-container-low transition-colors"
                >
                  View
                </Link>
                <Link
                  to={`/listings/${item.id}/edit`}
                  className="px-3 py-1.5 border border-primary rounded-lg font-label-sm text-label-sm text-primary hover:bg-surface-container-low transition-colors"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {data && <Pagination page={data.page} limit={data.limit} total={data.total} onPageChange={setPage} />}
    </div>
  );
}