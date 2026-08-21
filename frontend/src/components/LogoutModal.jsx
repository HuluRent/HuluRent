/**
 * LogoutModal — "Are you sure you want to log out?" confirmation dialog.
 * Usage:
 *   <LogoutModal isOpen={showModal} onConfirm={handleLogout} onCancel={() => setShowModal(false)} />
 */
export function LogoutModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-modal-title"
      onClick={onCancel}
    >
      {/* Panel — stop click propagation so clicking inside doesn't close */}
      <div
        className="bg-surface rounded-2xl shadow-xl border border-outline-variant w-full max-w-sm mx-4 p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-error-container mx-auto">
          <span className="material-symbols-outlined text-error text-2xl">logout</span>
        </div>

        {/* Text */}
        <div className="text-center">
          <h2 id="logout-modal-title" className="font-headline-sm text-on-surface mb-1">
            Log out?
          </h2>
          <p className="font-body-md text-on-surface-variant">
            Are you sure you want to log out of your account?
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-outline-variant font-label-md text-on-surface hover:bg-surface-container transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-error text-on-error font-label-md hover:opacity-90 transition-opacity"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutModal;
