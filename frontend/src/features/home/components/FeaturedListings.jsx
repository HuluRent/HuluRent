import ListingCard from '../../listings/components/ListingCard';
import './FeaturedListings.css';

const featuredListings = [
  {
    id: 1,
    title: 'Sony A7 IV Camera + Lens',
    category: 'Camera',
    rating: 4.9,
    location: 'Bole, Addis Ababa',
    price: 1500,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD5GqHNDPuNqnFF9sH2llpQIzoNeuZeyVtpp7ABiXUrDKlNeLYlL8cspHgKdukMnB3V7o9og8guHws4a0cF2Xe-uXrsi-rnd9ImRwTIDGKthHMPXbsgKpaagv1P9e61UwPTPKIGGCYii4BkQjJpF7u36TeUFi36pDP70XNLgbmijOau6JFqXIkaRsJGN0hZiMHfpqgtEOv04eq34l2JAUrZWTaF2dX6Pn_P_QQDp9wrX5y9gyfJHDcY',
  },
  {
    id: 2,
    title: 'DJI Mavic 3 Pro Drone',
    category: 'Electronics',
    rating: 5.0,
    location: 'Kazanchis, Addis Ababa',
    price: 2200,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBn59UBEzGmPY1KOj34YS1eNXjqSpJn_KCUUgtQB90InbNzZJkZ1gt4WJq_q6EJsCChFZ9OAFlGuvB2XpMzDRzBYC8JnAGnIytuQbdYn-Kczk9ecF5-3xUgfPDsn8I3TYnvObe7U6au8gIR__tccW_Q9e_h6uZcnzsvW8cCppNIZS6R3-UYuXcfdr_4EflrgwWYdHh-5BGHEHxcqe_12Y_5n6u-9aaA6CYxLY5Oc5AceUq4v3x3pr_0',
  },
  {
    id: 3,
    title: 'MacBook Pro M2 (16GB RAM)',
    category: 'Laptops',
    rating: 4.8,
    location: 'Piassa, Addis Ababa',
    price: 1000,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDQYUzeZ-ulGGk3xSSVlx1-7N-EbYhey8GtvCLJZIf6pZh9IYh5bSYWHW9bwUyQcrJTGGyhMFNRQMVf8ln-LDhmLrisnuLSvieoAV-OHv34HaZzg_Hl7Y4hRLQSHl6Pw8AaZUdSbPEtzc7hiSFwslQ3N75McM3wqW842oHvhqiqd-Pqn_OWJJ6IlflqrgleYnOpKVJAU4kxEsoF0w-3V4vh2YKzIyrfMKp2Ga77H68DMnHC_WbJ1hjB',
  },
];

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