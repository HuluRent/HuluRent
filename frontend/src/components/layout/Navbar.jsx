import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar__container">
        <Link to="/" className="navbar__logo">
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
          <Link to="/listings/create" className="navbar__button navbar__button--primary">
            List an Item
          </Link>

          <Link to="/login" className="navbar__button navbar__button--outline">
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
              <span className="material-symbols-outlined">notifications</span>
            </Link>

            <Link
              to="/profile"
              className="navbar__icon-button"
              aria-label="Profile"
            >
              <span className="material-symbols-outlined">account_circle</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;