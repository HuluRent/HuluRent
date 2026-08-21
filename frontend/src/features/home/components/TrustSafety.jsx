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
    <section className="py-16 md:py-20 bg-surface">
      <div className="hr-container">
        <div className="text-left md:text-center max-w-2xl mx-auto mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 text-text tracking-tight">Built on Trust</h2>
          <p className="text-text-muted text-sm md:text-lg">
            Your safety and peace of mind are our top priorities.
          </p>
        </div>

        {/* Mobile horizontal scroll, tablet/desktop grid */}
        <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar md:grid md:grid-cols-3 gap-4 md:gap-6 pb-4 md:pb-0">
          {trustFeatures.map((feature) => (
            <article
              className="flex-none w-[82%] md:w-auto snap-start bg-white p-6 md:p-8 rounded-xl border border-surface-border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col items-center text-center"
              key={feature.title}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                <span className="material-symbols-outlined text-3xl">
                  {feature.icon}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-text">{feature.title}</h3>
              <p className="text-text-muted text-base leading-relaxed">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrustSafety;