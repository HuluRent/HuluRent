const STATUS_STEPS = ['REQUESTED', 'ACCEPTED', 'CONFIRMED', 'ACTIVE', 'COMPLETED'];

export function BookingTimeline({ currentStatus }) {
  const currentIndex = STATUS_STEPS.indexOf(currentStatus);
  const isCancelled = ['REJECTED', 'CANCELLED', 'EXPIRED'].includes(currentStatus);

  if (isCancelled) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 flex items-center gap-3">
        <span className="material-symbols-outlined text-red-500 text-2xl">cancel</span>
        <div className="font-medium text-lg">Booking {currentStatus.toLowerCase()}</div>
      </div>
    );
  }

  // If status is not in the linear happy path but not cancelled (e.g. RETURN_PENDING), just find nearest.
  const activeIndex = currentIndex >= 0 ? currentIndex : 3;

  return (
    <div className="w-full">
      <div className="flex justify-between relative">
        <div className="absolute top-4 left-0 right-0 h-1 bg-surface-border -z-10 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${(activeIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
          />
        </div>

        {STATUS_STEPS.map((step, index) => {
          const isCompleted = index <= activeIndex;
          const isActive = index === activeIndex;

          return (
            <div key={step} className="flex flex-col items-center gap-2 z-10 w-24">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-primary border-primary text-white'
                    : 'bg-white border-surface-border text-text-muted'
                } ${isActive ? 'ring-4 ring-primary/20 scale-110' : ''}`}
              >
                {isCompleted ? <span className="material-symbols-outlined text-[18px]">check</span> : index + 1}
              </div>
              <span className={`text-xs font-semibold text-center tracking-wide uppercase ${
                isActive ? 'text-primary' : isCompleted ? 'text-text' : 'text-text-muted'
              }`}>
                {step.toLowerCase()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
