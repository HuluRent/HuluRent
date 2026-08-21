import { Link } from 'react-router-dom';
import './FinalCTA.css';

function FinalCTA() {
  return (
    <section className="final-cta">
      <div className="final-cta__content">
        <h2>Ready to start earning?</h2>

        <p>
          Join people in Addis Ababa who are making extra income by renting
          out items they aren't using every day.
        </p>

        <Link to="/listings/create" className="final-cta__button">
          List an Item Now
        </Link>
      </div>
    </section>
  );
}

export default FinalCTA;