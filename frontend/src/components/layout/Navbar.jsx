import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar__container">
        <Link to="/" className="navbar__logo" onClick={closeMenu}>
          HuluRent
        </Link>

        <nav className="navbar__links" aria-label="Main navigation">
          <Link to="/search" className="navbar__link">
            Browse
          </Link>

          <Link to="/how-it-works" className="navbar__link">
            How it Works
          </Link>
        </nav>

        <div className="navbar__actions">
          <Link
            to="/listings/create"
            className="navbar__button navbar__button--primary"
          >
            List an Item
          </Link>

          <Link
            to="/login"
            className="navbar__button navbar__button--outline"
          >
            Sign In
          </Link>

          <div className="navbar__utilities">
            <Link
              to="/messages"
              className="navbar__icon-button"
              aria-label="Messages"
            >
              <span className="material-symbols-outlined">mail</span>
            </Link>

            <Link
              to="/notifications"
              className="navbar__icon-button"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined">
                notifications
              </span>
            </Link>

            <Link
              to="/saved-list"
              className="navbar__icon-button"
              aria-label="Saved List"
            >
              <span className="material-symbols-outlined">bookmark</span>
            </Link>

            <Link
              to="/profile"
              className="navbar__icon-button"
              aria-label="Profile"
            >
              <span className="material-symbols-outlined">
                account_circle
              </span>
            </Link>

            <button
              type="button"
              className="navbar__menu-button"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="material-symbols-outlined">
                {menuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <nav className="navbar__mobile-menu" aria-label="Mobile navigation">
          <Link to="/search" onClick={closeMenu}>
            Browse
          </Link>

          <Link to="/how-it-works" onClick={closeMenu}>
            How it Works
          </Link>

          <Link to="/listings/create" onClick={closeMenu}>
            List an Item
          </Link>

          <Link to="/saved-list" onClick={closeMenu}>
            Saved
          </Link>

          <Link to="/login" onClick={closeMenu}>
            Sign In
          </Link>
        </nav>
      )}
    </header>
  );
};

export { Navbar };
export default Navbar;