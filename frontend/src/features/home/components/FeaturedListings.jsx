import FeaturedListingCard from './FeaturedListingCard';
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

          
        </div>

        <div className="featured-listings__grid">
          {featuredListings.map((listing) => (
            <FeaturedListingCard
              key={listing.id}
              listing={listing}
            />
          ))}
        </div>

       <button
  type="button"
  className="discover-listings-button"
>
  Discover All Listings
  <span className="material-symbols-outlined">
    arrow_forward
  </span>
</button>
      </div>
    </section>
  );
}

export default FeaturedListings;

