export function EmptyState({ icon = 'search_off', title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-2 text-center">
      <span className="material-symbols-outlined text-4xl text-on-surface-variant">{icon}</span>
      <h3 className="font-headline-md text-headline-md text-on-surface">{title}</h3>
      {description && <p className="font-body-md text-on-surface-variant max-w-sm">{description}</p>}
    </div>
  );
}