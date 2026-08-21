import { useState } from 'react';

const FAQS = [
  {
    category: 'Getting started',
    question: 'How do I create an account?',
    answer: 'Click "Sign up" in the top navigation bar. You can register using your email address and a password.',
  },
  {
    category: 'Renting',
    question: 'How do I rent an item?',
    answer: 'Search for the item you need, review the listing details, and click "Book this listing". Select your dates and submit a booking request to the owner.',
  },
  {
    category: 'Renting',
    question: 'How do I save a listing?',
    answer: 'Click the bookmark icon (Save button) on any listing card or detail page to add it to your Saved List. You can access your Saved List from the navigation menu.',
  },
  {
    category: 'Listing an item',
    question: 'How do I list an item?',
    answer: 'Click "List an Item" in the navigation bar. Provide details such as the item name, category, price, location, and photos, then submit the listing.',
  },
  {
    category: 'Bookings',
    question: 'How does a booking request work?',
    answer: 'When you submit a booking request, the owner is notified. They can accept or decline the request. If accepted, you will coordinate pickup details.',
  },
  {
    category: 'Payments',
    question: 'How are payments handled?',
    answer: 'Currently, HuluRent connects renters and owners. Payment arrangements (such as cash on pickup) should be agreed upon between the renter and owner securely.',
  },
  {
    category: 'Pickup & return',
    question: 'What happens if an item is damaged?',
    answer: 'We recommend documenting the item\'s condition with photos before the rental. If damage occurs, the renter and owner should communicate to resolve the issue based on their agreed terms.',
  },
  {
    category: 'Account',
    question: 'How do I update my profile?',
    answer: 'Go to your Profile page from the navigation menu, and click "Edit Profile" to update your information.',
  },
  {
    category: 'Safety',
    question: 'How do I contact an owner?',
    answer: 'You can use the built-in messaging system to contact an owner securely once you have initiated a booking or inquiry.',
  },
  {
    category: 'Safety',
    question: 'How do I report a problem?',
    answer: 'If you encounter an issue with a user or a listing, please contact HuluRent support for assistance.',
  },
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  const filteredFaqs = FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="font-display-lg text-4xl font-bold mb-4">Help Center</h1>
      <p className="text-lg text-on-surface-variant mb-8">
        Find answers to frequently asked questions and learn how to use HuluRent.
      </p>

      <div className="mb-10">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </span>
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-outline bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredFaqs.length === 0 ? (
          <p className="text-on-surface-variant text-center py-8">No results found for "{searchQuery}".</p>
        ) : (
          filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="border border-outline-variant rounded-xl overflow-hidden bg-surface">
                <button
                  className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-surface-container-lowest transition-colors"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <div>
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider block mb-1">
                      {faq.category}
                    </span>
                    <span className="font-medium text-on-surface">{faq.question}</span>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant ml-4 shrink-0 transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                    expand_more
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-4 pt-0">
                    <p className="text-on-surface-variant border-t border-outline-variant pt-4 mt-2">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
