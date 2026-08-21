import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="bg-white border-t border-surface-border pt-16 pb-8 mt-auto">
      <div className="hr-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-white text-xl font-bold">home_work</span>
              </div>
              <span className="text-xl font-bold text-text tracking-tight">Hulu<span className="text-primary">Rent</span></span>
            </Link>
            <p className="text-text-muted leading-relaxed text-sm mb-6 max-w-xs">
              The peer-to-peer rental marketplace in Ethiopia. Rent what you need, earn from what you own.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-surface-muted flex items-center justify-center text-text-muted hover:bg-primary hover:text-white transition-colors" aria-label="Facebook">
                <span className="material-symbols-outlined">public</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-surface-muted flex items-center justify-center text-text-muted hover:bg-primary hover:text-white transition-colors" aria-label="Share">
                <span className="material-symbols-outlined">share</span>
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="font-semibold text-text mb-4 text-sm uppercase tracking-wider">Explore</h3>
            <ul className="flex flex-col gap-3">
              <li><Link to="/search" className="text-text-muted hover:text-primary transition-colors text-sm">Browse Rentals</Link></li>
              <li><Link to="/search?category=Electronics" className="text-text-muted hover:text-primary transition-colors text-sm">Electronics</Link></li>
              <li><Link to="/how-it-works" className="text-text-muted hover:text-primary transition-colors text-sm">How It Works</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-text mb-4 text-sm uppercase tracking-wider">Trust & Safety</h3>
            <ul className="flex flex-col gap-3">
              <li><Link to="/trust-safety" className="text-text-muted hover:text-primary transition-colors text-sm">Trust & Safety</Link></li>
              <li><Link to="/help" className="text-text-muted hover:text-primary transition-colors text-sm">Help Center</Link></li>
              <li><Link to="/contact" className="text-text-muted hover:text-primary transition-colors text-sm">Contact Support</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-text mb-4 text-sm uppercase tracking-wider">Legal</h3>
            <ul className="flex flex-col gap-3">
              <li><Link to="/terms" className="text-text-muted hover:text-primary transition-colors text-sm">Terms of Use</Link></li>
              <li><Link to="/privacy" className="text-text-muted hover:text-primary transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link to="/guidelines" className="text-text-muted hover:text-primary transition-colors text-sm">Community Guidelines</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-surface-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-sm">
            © 2026 HuluRent Ethiopia. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-text-muted">
            <span>Addis Ababa, Ethiopia</span>
            <span>English (US)</span>
            <span>ETB (Br)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;