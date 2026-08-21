import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { NotificationBell } from '../../features/notifications/components/NotificationBell';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      closeMenu();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-surface/90 backdrop-blur-md border-b border-surface-border">
      <div className="hr-container h-20 flex items-center justify-between gap-4">
        {/* Left: Brand */}
        <Link to="/" className="flex-shrink-0 flex items-center gap-2" onClick={closeMenu}>
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-white text-2xl font-bold">home_work</span>
          </div>
          <span className="text-2xl font-bold text-text tracking-tight hidden sm:block">Hulu<span className="text-primary">Rent</span></span>
        </Link>

        {/* Center: Search */}
        <div className="flex-1 max-w-xl mx-4 hidden md:block">
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-text-muted group-focus-within:text-primary transition-colors">search</span>
            </div>
            <input
              type="text"
              placeholder="Search for cameras, tents, projectors..."
              className="w-full pl-10 pr-4 py-2.5 bg-surface-muted border border-surface-border rounded-full text-text placeholder-text-muted focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="hidden">Search</button>
          </form>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <Link to="/listings/create" className="hidden lg:flex items-center gap-2 text-sm font-medium text-text hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-surface-muted">
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            List an Item
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-1 sm:gap-2">
              <Link to="/messages" className="p-2 text-text-muted hover:text-primary hover:bg-surface-muted rounded-full transition-colors relative" aria-label="Messages">
                <span className="material-symbols-outlined">mail</span>
              </Link>

              <div className="p-2 text-text-muted hover:text-primary hover:bg-surface-muted rounded-full transition-colors cursor-pointer relative flex items-center justify-center">
                <NotificationBell />
              </div>

              <Link to="/saved-list" className="hidden sm:flex p-2 text-text-muted hover:text-primary hover:bg-surface-muted rounded-full transition-colors relative" aria-label="Saved">
                <span className="material-symbols-outlined">favorite</span>
              </Link>

              <div className="h-8 w-[1px] bg-surface-border mx-2 hidden sm:block"></div>

              <Link to="/profile" className="flex items-center gap-2 pl-2 pr-3 py-1.5 border border-surface-border rounded-full hover:shadow-subtle transition-all bg-white">
                <div className="w-8 h-8 bg-surface-muted rounded-full flex items-center justify-center text-primary font-bold overflow-hidden">
                  <span className="material-symbols-outlined text-xl">person</span>
                </div>
                <span className="material-symbols-outlined text-text-muted text-sm">menu</span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="hidden sm:block text-sm font-medium text-text hover:text-primary transition-colors">
                Log in
              </Link>
              <Link to="/register" className="hr-btn-primary !py-2 !px-5 !rounded-full !text-sm">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="md:hidden p-2 text-text-muted hover:bg-surface-muted rounded-full transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="material-symbols-outlined">{menuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-surface-border bg-white p-4 shadow-elevated absolute w-full left-0">
          <form onSubmit={handleSearch} className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-text-muted">search</span>
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-3 bg-surface-muted border border-surface-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <nav className="flex flex-col gap-2">
            <Link to="/search" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 text-text hover:bg-surface-muted rounded-lg font-medium transition-colors">
              <span className="material-symbols-outlined text-text-muted">explore</span>
              Browse Rentals
            </Link>
            <Link to="/how-it-works" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 text-text hover:bg-surface-muted rounded-lg font-medium transition-colors">
              <span className="material-symbols-outlined text-text-muted">info</span>
              How it Works
            </Link>
            <Link to="/listings/create" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 text-primary bg-primary/5 rounded-lg font-medium transition-colors">
              <span className="material-symbols-outlined">add_circle</span>
              List an Item
            </Link>

            <div className="h-[1px] bg-surface-border my-2"></div>

            {isAuthenticated ? (
              <>
                <Link to="/messages" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 text-text hover:bg-surface-muted rounded-lg font-medium transition-colors">
                  <span className="material-symbols-outlined text-text-muted">mail</span>
                  Messages
                </Link>
                <Link to="/notifications" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 text-text hover:bg-surface-muted rounded-lg font-medium transition-colors">
                  <span className="material-symbols-outlined text-text-muted">notifications</span>
                  Notifications
                </Link>
                <Link to="/saved-list" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 text-text hover:bg-surface-muted rounded-lg font-medium transition-colors">
                  <span className="material-symbols-outlined text-text-muted">favorite</span>
                  Saved Items
                </Link>
                <Link to="/profile" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 text-text hover:bg-surface-muted rounded-lg font-medium transition-colors">
                  <span className="material-symbols-outlined text-text-muted">account_circle</span>
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" onClick={closeMenu} className="flex items-center justify-center w-full py-3 mt-2 font-medium text-text border border-surface-border rounded-lg hover:bg-surface-muted transition-colors">
                  Log In
                </Link>
                <Link to="/register" onClick={closeMenu} className="flex items-center justify-center w-full py-3 mt-2 font-medium text-white bg-primary rounded-lg hover:bg-primary-hover transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export { Navbar };
export default Navbar;
