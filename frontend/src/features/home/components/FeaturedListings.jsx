import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { searchListings } from '../../../api/search.api';
import './FeaturedListings.css';

const BACKEND = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3140';

function getImageUrl(url) {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${BACKEND}${url}`;
}

function RealListingCard({ item }) {
  const thumbUrl = getImageUrl(item.images?.[0]?.url);

  return (
    <Link to={`/listings/${item.id}`} className="listing-card" style={{ textDecoration: 'none' }}>
      <div className="listing-card__image-wrapper">
        {thumbUrl ? (
          <img src={thumbUrl} alt={item.name} className="listing-card__image" />
        ) : (
          <div className="listing-card__image listing-card__image--placeholder">
            <span className="material-symbols-outlined">image</span>
          </div>
        )}
        <span className="listing-card__category">{item.category?.name ?? '—'}</span>
      </div>

      <div className="listing-card__content">
        <div className="listing-card__header">
          <h3>{item.name}</h3>
        </div>

        <p className="listing-card__location">
          <span className="material-symbols-outlined">location_on</span>
          {item.approxLocation ?? '—'}
        </p>

        <div className="listing-card__footer">
          <span className="listing-card__price">
            {Number(item.pricePerUnit).toLocaleString()} ETB
            <small> / {item.pricingUnit}</small>
          </span>
          <span className="listing-card__view-hint">View →</span>
        </div>
      </div>
    </Link>
  );
}

function FeaturedListings() {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['home-featured'],
    queryFn: () => searchListings({ sort: 'newest', limit: 6, page: 1 }),
  });

  // Backend returns { data: [...], meta: { total, page, limit } }
  const items = data?.data ?? [];

  return (
    <section className="featured-listings">
      <div className="featured-listings__container">
        <div className="featured-listings__heading">
          <div>
            <h2>Featured in Addis Ababa</h2>
            <p>High-quality gear available near you.</p>
          </div>
        </div>

        {isLoading && (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
            Loading listings…
          </p>
        )}

        {isError && (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--md-sys-color-error)' }}>
            Could not load listings.
          </p>
        )}

        {!isLoading && !isError && items.length === 0 && (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
            No listings yet. Be the first to{' '}
            <Link to="/listings/create" style={{ color: 'var(--md-sys-color-primary)' }}>
              list an item
            </Link>
            !
          </p>
        )}

        {items.length > 0 && (
          <div className="featured-listings__grid">
            {items.map((item) => (
              <RealListingCard key={item.id} item={item} />
            ))}
          </div>
        )}

        <button
          type="button"
          className="discover-listings-button"
          onClick={() => navigate('/listings')}
        >
          Discover All Listings
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </section>
  );
}

export default FeaturedListings;
