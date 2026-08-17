export function LoadingSpinner({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-on-surface-variant">
      <span className="material-symbols-outlined animate-spin text-3xl">progress_activity</span>
      <span className="font-body-md">{label}</span>
    </div>
  );
}