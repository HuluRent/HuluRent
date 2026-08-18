import './BookingTimeline.css';

const TIMELINE_STEPS = [
  { key: 'REQUESTED', label: 'Requested' },
  { key: 'ACCEPTED', label: 'Accepted' },
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'ACTIVE', label: 'Active' },
  { key: 'RETURN_PENDING', label: 'Return' },
  { key: 'COMPLETED', label: 'Completed' },
];

export function BookingTimeline({ currentStatus }) {
  // Find the index of the current status in our linear timeline
  const currentIndex = TIMELINE_STEPS.findIndex(step => step.key === currentStatus);
  
  // Handle terminal states that aren't on the happy path
  const isTerminal = ['REJECTED', 'CANCELLED', 'EXPIRED', 'DISPUTED'].includes(currentStatus);

  return (
    <div className="hr-booking-timeline">
      {TIMELINE_STEPS.map((step, index) => {
        let stateClass = '';
        if (isTerminal) {
          stateClass = 'hr-booking-timeline__step--terminal';
        } else if (index < currentIndex) {
          stateClass = 'hr-booking-timeline__step--completed';
        } else if (index === currentIndex) {
          stateClass = 'hr-booking-timeline__step--current';
        } else {
          stateClass = 'hr-booking-timeline__step--upcoming';
        }

        return (
          <div key={step.key} className={`hr-booking-timeline__step ${stateClass}`}>
            <div className="hr-booking-timeline__node">
              {index < currentIndex && !isTerminal && (
                <span className="material-symbols-outlined">check</span>
              )}
            </div>
            <span className="hr-booking-timeline__label">{step.label}</span>
            {index < TIMELINE_STEPS.length - 1 && (
              <div className="hr-booking-timeline__connector" />
            )}
          </div>
        );
      })}
    </div>
  );
}
