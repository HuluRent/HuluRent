import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroSection.css';

function HeroSection() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <section
      className="relative pt-24 pb-32 overflow-hidden bg-primary"
      style={{
        backgroundImage: "url('https://i.pinimg.com/736x/2c/91/73/2c91736b48268faeebce5b62f3a09358.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* Background Pattern/Gradient */}
      <div className="absolute inset-0 bg-primary/80"></div>

      {/* Decorative shapes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent opacity-20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

      <div className="hr-container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6 leading-tight">
            Rent what you need.<br />
            <span className="text-accent-300">Earn from what you own.</span>
          </h1>

          <p className="text-lg md:text-xl text-brand-100 mb-10 max-w-2xl mx-auto">
            Discover cameras, tools, event gear, and more in Addis Ababa. Or turn your unused gear into extra income.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex flex-col md:flex-row gap-3 bg-white p-2 md:p-3 rounded-2xl shadow-elevated">
            <div className="flex-1 relative flex items-center bg-surface-muted rounded-xl px-4 py-3 border border-surface-border focus-within:border-primary focus-within:bg-white transition-colors">
              <span className="material-symbols-outlined text-text-muted mr-3">search</span>
              <input
                type="text"
                className="w-full bg-transparent border-none p-0 text-text placeholder-text-muted focus:ring-0 text-lg"
                placeholder="What are you looking for?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full md:w-auto bg-primary text-white font-medium text-lg px-8 py-4 rounded-xl hover:bg-primary-hover transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <span>Search Rentals</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>

          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-medium text-brand-100">
            <span className="opacity-80">Popular:</span>
            <button type="button" onClick={() => navigate('/search?category=Electronics')} className="hover:text-white underline decoration-brand-400 decoration-1 underline-offset-4">Cameras</button>
            <button type="button" onClick={() => navigate('/search?category=Events')} className="hover:text-white underline decoration-brand-400 decoration-1 underline-offset-4">Event Tents</button>
            <button type="button" onClick={() => navigate('/search?category=Tools')} className="hover:text-white underline decoration-brand-400 decoration-1 underline-offset-4">Power Drills</button>
            <button type="button" onClick={() => navigate('/search?category=Vehicles')} className="hover:text-white underline decoration-brand-400 decoration-1 underline-offset-4">Bicycles</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;