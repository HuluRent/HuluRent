import './TrustSafety.css';

const trustFeatures = [
  {
    icon: 'verified_user',
    title: 'Verified Users',
    description:
      'Every member of our community undergoes ID verification to ensure a secure environment for all transactions.',
  },
  {
    icon: 'chat_bubble',
    title: 'Secure Communication',
    description:
      'Communicate easily and safely using our in-app messaging system. Your personal contact details remain private.',
  },
  {
    icon: 'diversity_3',
    title: 'Local Community',
    description:
      'Built for Addis Ababa. Connect with neighbors, support local owners, and participate in a sustainable sharing economy.',
  },
];

function TrustSafety() {
  return (
    <section className="trust-safety">
      <div className="trust-safety__header">
        <h2>Built on Trust</h2>

        <p>
          Your safety and peace of mind are our top priorities.
        </p>
      </div>

      <div className="trust-safety__grid">
        {trustFeatures.map((feature) => (
          <article className="trust-card" key={feature.title}>
            <div className="trust-card__icon">
              <span className="material-symbols-outlined">
                {feature.icon}
              </span>
            </div>

            <h3>{feature.title}</h3>

            <p>{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default TrustSafety;