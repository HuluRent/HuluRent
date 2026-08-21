import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ListingCard } from '../../listings/components/ListingCard';
import { searchListings } from '../../../api/search.api';
import { getImageUrl } from '../../../utils/getImageUrl';



function FeaturedListings() {
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['featured-listings'],
    queryFn: () => searchListings({ page: 1, limit: 3 }),
  });

  const listings = Array.isArray(data?.data) ? data.data : [];

  const featuredListings = listings.map((listing) => ({
    id: listing.id,
    name: listing.name,
    thumbnailUrl: listing.images?.[0]?.url ? getImageUrl(listing.images[0].url) : null,
    category: listing.category || { name: 'Other' },
    approxLocation: listing.approxLocation || 'Addis Ababa',
    pricePerUnit: Number(listing.pricePerUnit ?? 0),
    pricingUnit: listing.pricingUnit || 'day',
    owner: {
      rating: listing.averageRating ?? listing.rating ?? null,
      reviewCount: 0,
      displayName: listing.owner?.profile?.displayName || 'Owner',
      avatarUrl: listing.owner?.profile?.avatarUrl || null,
      isVerified: true
    }
  }));

  return (
    <section className="py-20 bg-white">
      <div className="hr-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-text mb-2 tracking-tight">Featured in Addis Ababa</h2>
            <p className="text-text-muted text-lg">Discover high-quality gear available near you.</p>
          </div>
          <button
            type="button"
            className="hidden md:flex items-center gap-2 text-primary font-medium hover:text-primary-hover transition-colors"
            onClick={() => navigate('/search')}
          >
            Discover All <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-surface-muted rounded-xl h-[400px] border border-surface-border"></div>
            ))}
          </div>
        )}

        {isError && (
          <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 text-center">
            <span className="material-symbols-outlined text-4xl mb-2">error</span>
            <p className="font-medium">Unable to load featured listings.</p>
          </div>
        )}

        {!isLoading && !isError && featuredListings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((listing) => (
              <ListingCard
                key={listing.id}
                item={listing}
              />
            ))}
          </div>
        )}

        {!isLoading && !isError && featuredListings.length === 0 && (
          <div className="bg-surface-muted border border-surface-border p-12 rounded-xl text-center">
            <span className="material-symbols-outlined text-4xl text-text-muted mb-3">inventory_2</span>
            <p className="text-text font-medium text-lg mb-1">No listings available</p>
            <p className="text-text-muted">Check back later for new gear in your area.</p>
          </div>
        )}

        <button
          type="button"
          className="w-full mt-8 md:hidden hr-btn-secondary"
          onClick={() => navigate('/search')}
        >
          Discover All Listings
        </button>
      </div>
    </section>
  );
}

export default FeaturedListings;



