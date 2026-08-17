// Desktop top header + mobile bottom nav — converted from the Stitch AI
// design. Both live here since they're the same navigation concern tied
// to the same auth state, even though the mobile bar visually looks more
// like a "bottom nav" than a traditional Navbar.
//
// Auth-aware: shows Sign In vs. a logged-in state. Two nav targets are
// TODO because there's no route for them yet in router.jsx — "How it
// Works" (marketing page, not in the 22 scaffolded routes) and a general
// "Messages" inbox (messaging feature currently only has a per-booking
// ChatPage, no conversation-list page) — see ARCHITECTURE.md if either
// gets added later.

import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <>
      {/* Desktop / top header */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop bg-surface max-w-container-max mx-auto h-[72px] border-b border-outline-variant">
        <div className="flex items-center gap-stack-lg">
          <Link to="/" className="font-headline-lg text-headline-lg font-bold text-primary">
            HuluRent
          </Link>
          <nav className="hidden md:flex gap-stack-md ml-margin-desktop">
            <Link
              to="/"
              className="text-primary border-b-2 border-primary pb-1 font-label-sm text-label-sm transition-all"
            >
              Browse
            </Link>
            {/* TODO: no "How it Works" route yet — marketing page, not in router.jsx */}
            <span className="text-on-surface-variant font-label-sm text-label-sm cursor-default">
              How it Works
            </span>
          </nav>
        </div>

        <div className="flex items-center gap-stack-md">
          {isAuthenticated && (
            <div className="hidden lg:flex items-center gap-stack-sm">
              {/* TODO: no general inbox route yet, see file header note */}
              <button className="p-2 text-on-surface-variant hover:text-primary transition-colors" aria-label="Messages">
                <span className="material-symbols-outlined">mail</span>
              </button>
              <Link to="/notifications" className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">notifications</span>
              </Link>
            </div>
          )}

          {isAuthenticated ? (
            <>
              <Link
                to="/listings/new"
                className="hidden md:block font-label-sm text-label-sm bg-primary-container text-on-primary px-4 py-2 rounded-lg shadow-subtle hover:shadow-hover transition-all"
              >
                List an Item
              </Link>
              <button
                onClick={logout}
                className="hidden md:block font-label-sm text-label-sm text-on-surface-variant border border-primary px-4 py-2 rounded-lg hover:bg-surface-container-low transition-colors"
              >
                Log Out
              </button>
              <Link to="/profile" className="md:hidden p-2 text-on-surface-variant" aria-label="Profile">
                <span className="material-symbols-outlined">account_circle</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="font-label-sm text-label-sm text-on-surface-variant border border-primary px-4 py-2 rounded-lg hover:bg-surface-container-low transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="hidden md:block font-label-sm text-label-sm bg-primary-container text-on-primary px-4 py-2 rounded-lg shadow-subtle hover:shadow-hover transition-all"
              >
                List an Item
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-margin-mobile pb-4 pt-2 bg-surface border-t border-outline-variant rounded-t-xl shadow-subtle">
        <Link to="/" className="flex flex-col items-center justify-center text-on-surface-variant pt-2">
          <span className="material-symbols-outlined mb-1">home</span>
          <span className="font-label-sm text-label-sm">Home</span>
        </Link>
        <Link to="/" className="flex flex-col items-center justify-center text-primary border-t-2 border-primary pt-2">
          <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>
            search
          </span>
          <span className="font-label-sm text-label-sm">Search</span>
        </Link>
        {/* TODO: no favorites feature — see SearchPage.jsx header note */}
        <span className="flex flex-col items-center justify-center text-on-surface-variant pt-2 opacity-50">
          <span className="material-symbols-outlined mb-1">favorite</span>
          <span className="font-label-sm text-label-sm">Favorites</span>
        </span>
        {/* TODO: no general inbox route yet, see file header note */}
        <span className="flex flex-col items-center justify-center text-on-surface-variant pt-2 opacity-50">
          <span className="material-symbols-outlined mb-1">mail</span>
          <span className="font-label-sm text-label-sm">Messages</span>
        </span>
        <Link to="/profile" className="flex flex-col items-center justify-center text-on-surface-variant pt-2">
          <span className="material-symbols-outlined mb-1">person</span>
          <span className="font-label-sm text-label-sm">Profile</span>
        </Link>
      </nav>
    </>
  );
}