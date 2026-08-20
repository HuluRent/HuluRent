import { useState } from 'react';
import { PhotoUploader } from './PhotoUploader';
import { useUploadEvidence } from '../hooks/useUploadEvidence';

export function ConditionForm({ bookingId, evidenceType, onSuccess }) {
  const uploadMutation = useUploadEvidence();
  const [files, setFiles] = useState([]);
  const [conditionNotes, setConditionNotes] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (files.length === 0) {
      setError('Please add at least one photo.');
      return;
    }

    const formData = new FormData();
    formData.append('bookingId', bookingId);
    formData.append('type', evidenceType);
    formData.append('conditionNotes', conditionNotes);
    files.forEach((file) => formData.append('photos', file));

    try {
      await uploadMutation.mutateAsync(formData);
      setFiles([]);
      setConditionNotes('');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to upload evidence.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6">
      <h3 className="font-headline-sm text-on-surface mb-4">
        Document {evidenceType === 'PICKUP' ? 'Pickup' : 'Return'} Condition
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-lg font-body-sm" role="alert">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div>
          <label className="font-label-md text-label-md text-on-surface mb-2 block">
            Photos
          </label>
          <PhotoUploader files={files} onChange={setFiles} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="conditionNotes" className="font-label-md text-label-md text-on-surface">
            Condition Notes
          </label>
          <textarea
            id="conditionNotes"
            value={conditionNotes}
            onChange={(e) => setConditionNotes(e.target.value)}
            placeholder="Describe the current condition of the item…"
            rows={4}
            className="px-4 py-3 border border-outline-variant rounded-xl bg-surface font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={uploadMutation.isPending}
          className="self-start px-6 py-2.5 bg-primary text-on-primary font-label-md rounded-xl hover:shadow-hover transition-all disabled:opacity-60"
        >
          {uploadMutation.isPending ? 'Uploading…' : 'Submit Documentation'}
        </button>
      </div>
    </form>
  );
}

export default ConditionForm;
