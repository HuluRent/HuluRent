
import './HeroSection.css';function HeroSection() {
  return (
    <section className="hero">
      <div className="hero__overlay" />

      <div className="hero__content">
        <h1>Rent what you need. Earn from what you own.</h1>

        <p>
          Discover useful items near you in Addis Ababa or turn your unused
          gear into extra income.
        </p>

        <div className="hero__search">
          <div className="hero__search-field">
            <span>⌕</span>
            <input
              type="text"
              placeholder="What are you looking for?"
            />
          </div>

          <div className="hero__search-field">
            <span>⌖</span>
            <input
              type="text"
              placeholder="Location (e.g., Bole)"
            />
          </div>

          <div className="hero__search-field">
            <span>▣</span>
            <input
              type="text"
              placeholder="Dates"
            />
          </div>

          <button type="button">
            Search Rentals
          </button>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;