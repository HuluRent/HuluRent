// Hero search bar — text query + free-text location. Uncontrolled-ish
// local input state, only pushed up to useFilters on submit (not on
// every keystroke), so search doesn't refetch on every character typed.

import { useState } from 'react';

export function SearchBar({ filters, onSearch }) {
  const [query, setQuery] = useState(filters.query);
  const [location, setLocation] = useState(filters.location);

  function handleSubmit(e) {
    e.preventDefault();
    onSearch({ query, location });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-subtle flex flex-col md:flex-row gap-4 items-center"
    >
      <div className="relative w-full md:w-1/2">
        <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant">
          search
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What are you looking for?"
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md bg-surface-container-lowest"
        />
      </div>
      <div className="relative w-full md:w-1/3">
        <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant">
          location_on
        </span>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Where in Addis Ababa?"
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md bg-surface-container-lowest"
        />
      </div>
      <button
        type="submit"
        className="w-full md:w-auto bg-primary-container text-on-primary font-headline-md text-headline-md px-6 py-3 rounded-lg shadow-subtle hover:shadow-hover transition-all whitespace-nowrap"
      >
        Search
      </button>
    </form>
  );
}