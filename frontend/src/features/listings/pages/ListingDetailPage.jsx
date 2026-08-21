import { Link, useParams, useNavigate } from 'react-router-dom';
import { useListing } from '../hooks/useListing';
import { ListingGallery } from '../components/ListingGallery';
import { useAuth } from '../../../hooks/useAuth';
import { formatCurrency } from '../../../utils/formatCurrency';
import {
  useSavedList,
  useAddToSavedList,
  useRemoveFromSavedList,
} from '../../savedList/hooks/useSavedList';
import { useStartConversation } from '../../messaging/hooks/useStartConversation';

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-ET', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export function ListingDetailPage() {
  const { listingId } = useParams();
  const navigate = useNavigate();

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
  const { mutate: startConversation, isPending: isStartingConversation } = useStartConversation();

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
    return (
      <div className="hr-container py-8 animate-pulse">
        <div className="h-8 bg-surface-muted rounded w-1/3 mb-4"></div>
        <div className="h-[400px] bg-surface-muted rounded-2xl mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-6 bg-surface-muted rounded w-full"></div>
            <div className="h-6 bg-surface-muted rounded w-5/6"></div>
            <div className="h-6 bg-surface-muted rounded w-4/6"></div>
          </div>
          <div className="h-[300px] bg-surface-muted rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (isError || !listing) {
    return (
      <div className="hr-container py-20 flex flex-col items-center justify-center text-center">
        <span className="material-symbols-outlined text-6xl text-text-muted mb-4">error_outline</span>
        <h1 className="text-2xl font-bold text-text mb-2">Listing not found</h1>
        <p className="text-text-muted mb-6">This listing is unavailable or you do not have permission to view it.</p>
        <Link to="/" className="hr-btn-primary">Back to home</Link>
      </div>
    );
  }

  return (
    <div className="hr-container">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-text mb-2 tracking-tight">{listing.name}</h1>
          <div className="flex items-center gap-4 text-sm font-medium text-text-muted">
            {listing.owner?.rating != null && (
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-accent-500 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                {listing.owner.rating} ({listing.owner.reviewCount || 0} reviews)
              </span>
            )}
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">location_on</span>
              {listing.approxLocation}
            </span>
          </div>
        </div>

        {isAuthenticated && (
          <button
            onClick={handleSaveToggle}
            disabled={isSavePending}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all ${
              isSaved
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-surface-border bg-white text-text hover:border-text-muted'
            } disabled:opacity-50`}
          >
            <span className="material-symbols-outlined text-[20px]" style={isSaved ? { fontVariationSettings: "'FILL' 1" } : {}}>
              bookmark
            </span>
            <span className="font-semibold text-sm">
              {isSavePending ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
            </span>
          </button>
        )}
      </div>

      {/* Gallery */}
      <div className="mb-10 rounded-2xl overflow-hidden border border-surface-border">
        <ListingGallery images={listing.images} alt={listing.name} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Content */}
        <div className="lg:col-span-2">
          {/* Owner Info */}
          {listing.owner && (
            <div className="flex items-center justify-between py-6 border-b border-surface-border mb-8">
              <div>
                <h2 className="text-xl font-bold text-text mb-1">
                  Hosted by {listing.owner.displayName || 'Owner'}
                </h2>
                <p className="text-text-muted text-sm">
                  {listing.category?.name || 'Uncategorized'} • Joined recently
                </p>
              </div>
              <div className="relative">
                {listing.owner.avatarUrl ? (
                  <img src={listing.owner.avatarUrl} alt={listing.owner.displayName} className="w-14 h-14 rounded-full object-cover border border-surface-border" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 border border-surface-border">
                    <span className="material-symbols-outlined text-3xl">person</span>
                  </div>
                )}
                {listing.owner.isVerified && (
                  <span className="material-symbols-outlined absolute bottom-0 right-0 text-primary bg-white rounded-full text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-text mb-4">About this item</h2>
            <div className="prose prose-slate max-w-none text-text-muted leading-relaxed">
              <p className="whitespace-pre-wrap">{listing.description}</p>
            </div>
          </div>

          {/* Details */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-text mb-4">Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-xl border border-surface-border bg-surface-muted/50">
                <span className="material-symbols-outlined text-primary">category</span>
                <div>
                  <div className="text-sm text-text-muted font-medium">Category</div>
                  <div className="font-semibold text-text">{listing.category?.name || 'Other'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl border border-surface-border bg-surface-muted/50">
                <span className="material-symbols-outlined text-primary">info</span>
                <div>
                  <div className="text-sm text-text-muted font-medium">Status</div>
                  <div className="font-semibold text-text capitalize">{listing.status.toLowerCase()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Booking Card */}
        <div>
          <div className="sticky top-[100px] bg-white rounded-2xl shadow-card border border-surface-border p-6">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <span className="text-2xl font-bold text-text">{formatCurrency(listing.pricePerUnit)}</span>
                <span className="text-text-muted ml-1">/ {listing.pricingUnit}</span>
              </div>
            </div>

            {listing.depositAmount > 0 && (
              <div className="mb-6 p-4 rounded-xl bg-surface-muted border border-surface-border flex items-start gap-3">
                <span className="material-symbols-outlined text-accent-500 mt-0.5">security</span>
                <div>
                  <div className="font-semibold text-text text-sm">Security Deposit</div>
                  <div className="text-text-muted text-sm">{formatCurrency(listing.depositAmount)}</div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate(`/listings/${listing.id}/book`)}
                className="w-full hr-btn-primary !py-4 !text-lg !rounded-xl"
              >
                Request to Book
              </button>

              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate('/login', { state: { from: `/listings/${listing.id}` } });
                    return;
                  }
                  startConversation(listing.id, {
                    onSuccess: (conversation) => {
                      navigate(`/messages?conversationId=${conversation.id}`);
                    },
                  });
                }}
                disabled={isStartingConversation}
                className="w-full px-4 py-4 rounded-xl border border-surface-border text-lg font-medium text-text hover:bg-surface-muted transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span className="material-symbols-outlined">chat_bubble</span>
                {isStartingConversation ? 'Starting...' : 'Message Owner'}
              </button>
            </div>

            <p className="text-center text-text-muted text-sm mt-4">
              You won't be charged yet
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}