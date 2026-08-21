import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroSection.css';

function HeroSection() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('query', query.trim());
    if (location.trim()) params.set('location', location.trim());
    navigate(`/listings?${params.toString()}`);
  }

  return (
    <section className="hero">
      <div className="hero__overlay" />

      <div className="hero__content">
        <h1>Rent what you need. Earn from what you own.</h1>

        <p>
          Discover useful items near you in Addis Ababa or turn your unused
          gear into extra income.
        </p>

        <form className="hero__search" onSubmit={handleSearch}>
          <div className="hero__search-field">
            <span>⌕</span>
            <input
              type="text"
              placeholder="What are you looking for?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="hero__search-field">
            <span>⌖</span>
            <input
              type="text"
              placeholder="Location (e.g., Bole)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <button type="submit">
            Search Rentals
          </button>
        </form>
      </div>
    </section>
  );
}

export default HeroSection;
