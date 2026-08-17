import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__brand">
          <h2>HuluRent</h2>

          <p>
            The peer-to-peer rental marketplace in Ethiopia. Rent what you
            need, earn from what you own.
          </p>
        </div>

        <div className="footer__column">
          <h3>Marketplace</h3>
          <a href="#">Browse Items</a>
          <a href="#">Categories</a>
          <a href="#">List an Item</a>
        </div>

        <div className="footer__column">
          <h3>Learn More</h3>
          <a href="#">How it Works</a>
          <a href="#">Trust &amp; Safety</a>
          <a href="#">Help Center</a>
        </div>

        <div className="footer__column">
          <h3>Legal</h3>
          <a href="#">Terms of Service</a>
          <a href="#">Privacy Policy</a>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© 2026 HuluRent. All rights reserved.</p>

        <div className="footer__socials">
          <a href="#" aria-label="HuluRent website">
            <span className="material-symbols-outlined">public</span>
          </a>

          <a href="#" aria-label="Share HuluRent">
            <span className="material-symbols-outlined">share</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;