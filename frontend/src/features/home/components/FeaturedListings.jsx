import ListingCard from '../../listings/components/ListingCard';
import './FeaturedListings.css';
import featuredListings from '../data/featuredListings';


function FeaturedListings() {
  return (
    <section className="featured-listings">
      <div className="featured-listings__container">
        <div className="featured-listings__heading">
          <div>
            <h2>Featured in Addis Ababa</h2>
            <p>High-quality gear available near you.</p>
          </div>

          <button type="button">
            View all
          </button>
        </div>

        <div className="featured-listings__grid">
          {featuredListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
            />
          ))}
        </div>

        <button
          type="button"
          className="featured-listings__mobile-button"
        >
          View All Listings
        </button>
      </div>
    </section>
  );
}

export default FeaturedListings;