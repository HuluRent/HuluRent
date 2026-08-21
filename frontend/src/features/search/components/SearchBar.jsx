import { useState } from 'react';

export function SearchBar({ filters, onSearch }) {
  const [query, setQuery] = useState(filters.query || '');
  const [location, setLocation] = useState(filters.location || '');

  function handleSubmit(e) {
    e.preventDefault();
    onSearch({ query, location });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-2 rounded-2xl border border-surface-border shadow-sm flex flex-col md:flex-row items-center gap-2 max-w-4xl"
    >
      <div className="relative w-full flex-1 flex items-center bg-surface-muted rounded-xl px-4 py-3 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 transition-all border border-transparent focus-within:border-primary">
        <span className="material-symbols-outlined text-text-muted mr-3">search</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What are you looking for?"
          className="w-full bg-transparent border-none p-0 text-text placeholder-text-muted focus:ring-0 outline-none text-base"
        />
      </div>

      <div className="hidden md:block w-[1px] h-10 bg-surface-border"></div>

      <div className="relative w-full md:w-64 flex items-center bg-surface-muted rounded-xl px-4 py-3 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 transition-all border border-transparent focus-within:border-primary">
        <span className="material-symbols-outlined text-text-muted mr-3">location_on</span>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Where in Addis Ababa?"
          className="w-full bg-transparent border-none p-0 text-text placeholder-text-muted focus:ring-0 outline-none text-base"
        />
      </div>

      <button
        type="submit"
        className="w-full md:w-auto bg-primary text-white font-medium px-8 py-3.5 rounded-xl hover:bg-primary-hover transition-colors shadow-sm flex items-center justify-center gap-2"
      >
        <span>Search</span>
      </button>
    </form>
  );
}