import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useSavedList, useAddToSavedList, useRemoveFromSavedList } from '../../savedList/hooks/useSavedList';
import './FeaturedListingCard.css';

function FeaturedListingCard({ listing }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data: savedList = [] } = useSavedList({ enabled: isAuthenticated });

  const addMutation = useAddToSavedList();
  const removeMutation = useRemoveFromSavedList();

  const isSaved = savedList.some((entry) => entry.listingId === listing.id);
  const isLoading = addMutation.isPending || removeMutation.isPending;

  const handleSaveClick = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isSaved) {
      removeMutation.mutate(listing.id);
    } else {
      addMutation.mutate(listing.id);
    }
  };

  const handleCardClick = () => {
    navigate(`/listings/${listing.id}`);
  };

  return (
    <article className="listing-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="listing-card__image-wrapper">
        <img
          src={listing.image}
          alt={listing.title}
          className="listing-card__image"
        />

        <span className="listing-card__category">
          {listing.category}
        </span>

        <button
          className={`listing-card__save-btn ${isSaved ? 'saved' : ''}`}
          onClick={handleSaveClick}
          disabled={isLoading}
          aria-label={isSaved ? "Remove saved listing" : "Save listing"}
          title={isSaved ? "Remove saved listing" : "Save listing"}
        >
          <span className="material-symbols-outlined">
            bookmark
          </span>
        </button>
      </div>

      <div className="listing-card__content">
        <div className="listing-card__header">
          <h3>{listing.title}</h3>

          <div className="listing-card__rating">
            <span className="material-symbols-outlined">
              star
            </span>
            <span>{listing.rating}</span>
          </div>
        </div>

        <p className="listing-card__location">
          <span className="material-symbols-outlined">
            location_on
          </span>
          {listing.location}
        </p>

        <div className="listing-card__footer">
          <span className="listing-card__price">
            {listing.price.toLocaleString()} ETB
            <small>/ {listing.pricingUnit || 'day'}</small>
          </span>

          <button type="button" onClick={(e) => { e.stopPropagation(); navigate(`/listings/${listing.id}`); }}>
            View
          </button>
        </div>
      </div>
    </article>
  );
}

export default FeaturedListingCard;
