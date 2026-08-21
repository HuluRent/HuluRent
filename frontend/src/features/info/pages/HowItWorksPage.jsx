export default function HowItWorksPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="font-display-lg text-4xl font-bold mb-4">Rent what you need. Share what you own.</h1>
      <p className="text-lg text-on-surface-variant mb-12">
        HuluRent is a peer-to-peer rental marketplace that connects people who need items with people who have them.
      </p>

      <div className="space-y-12">
        <section>
          <div className="flex items-center gap-4 mb-4">
            <span className="material-symbols-outlined text-4xl text-primary">search</span>
            <h2 className="text-2xl font-semibold">Step 1: Discover</h2>
          </div>
          <p className="text-on-surface-variant ml-14">
            Search and browse available listings in your area. Use filters to find exactly what you need.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-4">
            <span className="material-symbols-outlined text-4xl text-primary">checklist</span>
            <h2 className="text-2xl font-semibold">Step 2: Choose</h2>
          </div>
          <p className="text-on-surface-variant ml-14">
            Review listing details, pricing, location, availability, and owner information to ensure it's the right fit.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-4">
            <span className="material-symbols-outlined text-4xl text-primary">calendar_add_on</span>
            <h2 className="text-2xl font-semibold">Step 3: Request</h2>
          </div>
          <p className="text-on-surface-variant ml-14">
            Select your rental dates and submit a booking request. The owner will review and accept your request.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-4">
            <span className="material-symbols-outlined text-4xl text-primary">handshake</span>
            <h2 className="text-2xl font-semibold">Step 4: Confirm</h2>
          </div>
          <p className="text-on-surface-variant ml-14">
            Communicate with the owner to arrange the details and confirm the rental.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-4">
            <span className="material-symbols-outlined text-4xl text-primary">photo_camera</span>
            <h2 className="text-2xl font-semibold">Step 5: Meet & Inspect</h2>
          </div>
          <p className="text-on-surface-variant ml-14">
            Meet the owner, complete the pickup/inspection, and document the item's condition.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-4">
            <span className="material-symbols-outlined text-4xl text-primary">assignment_return</span>
            <h2 className="text-2xl font-semibold">Step 6: Return</h2>
          </div>
          <p className="text-on-surface-variant ml-14">
            Return the item on time and complete the rental. Leave a review to help the community.
          </p>
        </section>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-surface-container p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-2">For Renters</h3>
          <p className="text-on-surface-variant">Save money by renting items you only need temporarily instead of buying them. Access a wide variety of tools, equipment, and gear locally.</p>
        </div>
        <div className="bg-surface-container p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-2">For Owners</h3>
          <p className="text-on-surface-variant">Earn extra income by renting out items you already own. Your idle belongings can become a steady source of passive income.</p>
        </div>
      </div>

      <div className="mt-12 text-center">
        <h3 className="text-2xl font-bold mb-4">Why use HuluRent?</h3>
        <p className="text-on-surface-variant max-w-2xl mx-auto">
          We provide a secure platform with identity verification, secure messaging, and clear agreements to make peer-to-peer renting safe and easy for everyone in Addis Ababa.
        </p>
      </div>
    </div>
  );
}
