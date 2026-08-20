import { useState } from 'react';
import { useSubmitReview } from '../hooks/useSubmitReview';

export function ReviewForm({ bookingId, onSuccess }) {
  const submitMutation = useSubmitReview();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (rating < 1 || rating > 5) {
      setError('Please select a rating (1–5 stars).');
      return;
    }

    try {
      await submitMutation.mutateAsync({ bookingId, rating, comment: comment.trim() || undefined });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to submit review.');
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
        <label className="font-label-md text-label-md text-on-surface mb-2 block">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="text-3xl transition-colors focus:outline-none"
              aria-label={`${star} star${star > 1 ? 's' : ''}`}
            >
              <span className={star <= (hoverRating || rating) ? 'text-amber-400' : 'text-gray-300'}>
                ★
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <label htmlFor="review-comment" className="font-label-md text-label-md text-on-surface mb-1.5 block">
          Comment (optional)
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience…"
          rows={4}
          className="w-full px-4 py-3 border border-outline-variant rounded-xl bg-surface font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={submitMutation.isPending || rating === 0}
        className="px-6 py-2.5 bg-primary text-on-primary font-label-md rounded-xl hover:shadow-hover transition-all disabled:opacity-60"
      >
        {submitMutation.isPending ? 'Submitting…' : 'Submit Review'}
      </button>
    </form>
  );
}

export default ReviewForm;
