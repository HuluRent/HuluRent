export default function TrustSafetyPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="font-display-lg text-4xl font-bold mb-4">Trust & Safety</h1>
      <p className="text-lg text-on-surface-variant mb-12">
        Learn how HuluRent helps users rent safely and build a trusted community.
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-3">Identity & Account Verification</h2>
          <p className="text-on-surface-variant">
            HuluRent provides account features to help establish trust. (Note: Full identity verification features may be introduced in future updates. Please verify the identity of the person you are renting from/to during pickup).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Listing Moderation</h2>
          <p className="text-on-surface-variant">
            We monitor the platform for suspicious activity. However, always exercise caution and review listings carefully before booking.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Secure Communication</h2>
          <p className="text-on-surface-variant">
            Use HuluRent's built-in messaging system to communicate. Keeping communication on the platform helps maintain a record of your agreements.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Rental Agreements</h2>
          <p className="text-on-surface-variant">
            HuluRent provides a structured booking flow to clarify rental terms, dates, and pricing before the rental begins.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Pickup and Return Inspections</h2>
          <p className="text-on-surface-variant">
            We strongly recommend both parties inspect the item together at pickup and return. Document any existing wear or damage to avoid disputes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Evidence/Photos for Item Condition</h2>
          <p className="text-on-surface-variant">
            Take clear photos of the item's condition at the time of pickup and return. Our platform supports condition notes and evidence upload for bookings to help resolve issues.
          </p>
        </section>

        <section className="bg-surface-container p-6 rounded-2xl mt-8">
          <h3 className="text-xl font-bold mb-4">Best Practices</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">What renters should do before booking:</h4>
              <ul className="list-disc list-inside text-on-surface-variant space-y-1">
                <li>Read the full listing description</li>
                <li>Check the owner's reviews and ratings</li>
                <li>Ask questions via messaging</li>
                <li>Clarify pickup location and times</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">What owners should do before handing over an item:</h4>
              <ul className="list-disc list-inside text-on-surface-variant space-y-1">
                <li>Confirm the renter's identity</li>
                <li>Take timestamped photos of the item</li>
                <li>Demonstrate how the item works</li>
                <li>Agree on return expectations</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-3">Reporting Suspicious Activity</h2>
          <p className="text-on-surface-variant">
            If you encounter a suspicious listing or user, please contact our support team immediately. Do not proceed with any transactions that make you feel unsafe.
          </p>
        </section>
      </div>
    </div>
  );
}
