import './FeaturedListingCard.css';

function FeaturedListingCard({ listing }) {
  return (
    <article className="listing-card">
      <div className="listing-card__image-wrapper">
        <img
          src={listing.image}
          alt={listing.title}
          className="listing-card__image"
        />

        <span className="listing-card__category">
          {listing.category}
        </span>
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
            <small>/ day</small>
          </span>

          <button type="button">
            View
          </button>
        </div>
      </div>
    </article>
  );
}

export default FeaturedListingCard;
