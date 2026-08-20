import { useState } from 'react';
import { useScheduleInspection } from '../hooks/useInspection';

export function InspectionScheduler({ bookingId, onSuccess }) {
  const scheduleMutation = useScheduleInspection();
  const [scheduledAt, setScheduledAt] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!scheduledAt) {
      setError('Please select a date and time.');
      return;
    }

    if (new Date(scheduledAt) <= new Date()) {
      setError('Inspection must be scheduled in the future.');
      return;
    }

    try {
      await scheduleMutation.mutateAsync({ bookingId, scheduledAt, notes });
      setScheduledAt('');
      setNotes('');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to schedule inspection.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6">
      <h3 className="font-headline-sm text-on-surface mb-4">Schedule Inspection</h3>

      {error && (
        <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-lg font-body-sm" role="alert">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="scheduledAt" className="font-label-md text-label-md text-on-surface">
            Date & Time
          </label>
          <input
            id="scheduledAt"
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="px-4 py-3 border border-outline-variant rounded-xl bg-surface font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="notes" className="font-label-md text-label-md text-on-surface">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Meeting point, special instructions…"
            rows={3}
            className="px-4 py-3 border border-outline-variant rounded-xl bg-surface font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={scheduleMutation.isPending}
          className="self-start px-6 py-2.5 bg-primary text-on-primary font-label-md rounded-xl hover:shadow-hover transition-all disabled:opacity-60"
        >
          {scheduleMutation.isPending ? 'Scheduling…' : 'Schedule Inspection'}
        </button>
      </div>
    </form>
  );
}

export default InspectionScheduler;
