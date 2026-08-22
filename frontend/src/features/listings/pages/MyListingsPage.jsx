import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMyListings } from '../hooks/useMyListings';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { EmptyState } from '../../../components/EmptyState';
import { Pagination } from '../../../components/Pagination';
import { formatCurrency } from '../../../utils/formatCurrency';
import { getImageUrl } from '../../../utils/getImageUrl';



const STATUS_STYLES = {
  DRAFT: 'bg-slate-100 text-slate-700 border-slate-200',
  PUBLISHED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  UNAVAILABLE: 'bg-amber-100 text-amber-800 border-amber-200',
  SUSPENDED: 'bg-red-100 text-red-800 border-red-200',
  ARCHIVED: 'bg-slate-100 text-slate-500 border-slate-200',
};

function StatusBadge({ status }) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${STATUS_STYLES[status] ?? 'bg-slate-100 text-slate-800 border-slate-200'}`}>
      {status}
    </span>
  );
}

export function MyListingsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useMyListings(page);

  return (
    <div className="hr-container max-w-5xl mx-auto py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text tracking-tight mb-2">My Listings</h1>
          <p className="text-text-muted">Manage your rentals and see their status.</p>
        </div>
        <Link
          to="/listings/create"
          className="hr-btn-primary !px-8 !py-3 !rounded-xl whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          List a New Item
        </Link>
      </div>

      {isLoading && (
        <div className="py-20 flex justify-center">
          <LoadingSpinner label="Loading your listings…" />
        </div>
      )}

      {isError && (
        <div className="py-20">
          <EmptyState
            icon="error"
            title="Couldn't load your listings"
            description="Something went wrong reaching the server. Try again in a moment."
          />
        </div>
      )}

      {!isLoading && !isError && data?.items?.length === 0 && (
        <div className="py-20 border border-dashed border-surface-border rounded-3xl bg-surface-muted/50">
          <EmptyState
            icon="inventory_2"
            title="You haven't listed anything yet"
            description="List your first item to start earning from things you're not using."
          />
          <div className="mt-6 flex justify-center">
            <Link to="/listings/create" className="hr-btn-primary w-auto !px-8">
              Get Started
            </Link>
          </div>
        </div>
      )}

      {!isLoading && !isError && data?.items?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.items.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-surface-border rounded-2xl overflow-hidden shadow-sm hover:shadow-card transition-all flex flex-col group"
            >
              {/* Image Area */}
              <div className="h-48 relative bg-surface-muted overflow-hidden">
                {item.images?.[0]?.url ? (
                  <img src={item.images[0].url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted">
                    <span className="material-symbols-outlined text-4xl opacity-20">image</span>
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-sm border border-surface-border flex gap-1">
                  <StatusBadge status={item.status} />
                </div>
              </div>

              {/* Content Area */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex-1">
                  <h3 className="font-bold text-text text-lg mb-2 line-clamp-2">{item.name}</h3>
                  <div className="text-primary font-bold text-lg tracking-tight">
                    {formatCurrency(item.pricePerUnit)}
                    <span className="text-sm font-medium text-text-muted ml-1">/ {item.pricingUnit}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-surface-border flex items-center gap-2">
                  <Link
                    to={`/listings/${item.id}`}
                    className="flex-1 py-2.5 text-center border border-surface-border rounded-xl text-sm font-medium text-text hover:bg-surface-muted transition-colors"
                  >
                    Preview
                  </Link>
                  <Link
                    to={`/listings/${item.id}/edit`}
                    className="flex-1 py-2.5 text-center bg-primary/10 border border-primary/20 rounded-xl text-sm font-medium text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {data && data.total > 0 && (
        <div className="mt-12 flex justify-center">
          <Pagination page={data.page} limit={data.limit} total={data.total} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}


