export function AgreementViewer({ agreement }) {
  if (!agreement) return null;

  const terms = agreement.terms || {};
  const termEntries = Object.entries(terms);

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-headline-md text-headline-md text-on-surface">
          Rental Agreement
        </h3>
        <span className="font-label-sm text-label-sm text-on-surface-variant">
          v{agreement.version}
        </span>
      </div>

      {/* Terms */}
      {termEntries.length > 0 ? (
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-6">
          {termEntries.map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <dt className="font-label-sm text-label-sm text-on-surface-variant capitalize">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
              </dt>
              <dd className="font-body-md text-on-surface">
                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="font-body-md text-on-surface-variant mb-6">No terms specified.</p>
      )}

      {/* Acceptance Status */}
      <div className="border-t border-outline-variant pt-4 flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2">
          <span className={`material-symbols-outlined text-lg ${agreement.ownerAccepted ? 'text-success' : 'text-on-surface-variant'}`}>
            {agreement.ownerAccepted ? 'check_circle' : 'pending'}
          </span>
          <span className="font-label-md text-label-md text-on-surface">
            Owner: {agreement.ownerAccepted ? 'Accepted' : 'Pending'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`material-symbols-outlined text-lg ${agreement.renterAccepted ? 'text-success' : 'text-on-surface-variant'}`}>
            {agreement.renterAccepted ? 'check_circle' : 'pending'}
          </span>
          <span className="font-label-md text-label-md text-on-surface">
            Renter: {agreement.renterAccepted ? 'Accepted' : 'Pending'}
          </span>
        </div>
      </div>

      <p className="font-label-sm text-label-sm text-on-surface-variant mt-3">
        Created {new Date(agreement.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}

export default AgreementViewer;
