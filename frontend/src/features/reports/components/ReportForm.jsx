import { useState } from 'react';
import { useSubmitReport } from '../hooks/useSubmitReport';

const REASON_OPTIONS = [
  'Fraudulent listing',
  'Inappropriate content',
  'Harassment',
  'Damaged item not disclosed',
  'No-show',
  'Other',
];

export function ReportForm({ subjectId, onSuccess }) {
  const submitMutation = useSubmitReport();
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!reason) {
      setError('Please select a reason.');
      return;
    }
    if (!details.trim()) {
      setError('Please provide details.');
      return;
    }

    try {
      await submitMutation.mutateAsync({
        subjectId: subjectId || undefined,
        reason,
        details: details.trim(),
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to submit report.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6">
      {error && (
        <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-lg font-body-sm" role="alert">
          {error}
        </div>
      )}

      <div className="mb-5">
        <label htmlFor="reason" className="font-label-md text-label-md text-on-surface mb-1.5 block">
          Reason
        </label>
        <select
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full px-4 py-3 border border-outline-variant rounded-xl bg-surface font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
          required
        >
          <option value="">Select a reason…</option>
          {REASON_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div className="mb-5">
        <label htmlFor="details" className="font-label-md text-label-md text-on-surface mb-1.5 block">
          Details
        </label>
        <textarea
          id="details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Describe what happened…"
          rows={5}
          className="w-full px-4 py-3 border border-outline-variant rounded-xl bg-surface font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          required
        />
      </div>

      <button
        type="submit"
        disabled={submitMutation.isPending}
        className="px-6 py-2.5 bg-error text-on-error font-label-md rounded-xl hover:shadow-hover transition-all disabled:opacity-60"
      >
        {submitMutation.isPending ? 'Submitting…' : 'Submit Report'}
      </button>
    </form>
  );
}

export default ReportForm;
