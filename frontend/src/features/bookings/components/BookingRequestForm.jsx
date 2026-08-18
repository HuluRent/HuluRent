import { useState } from 'react';
import './BookingRequestForm.css';

export function BookingRequestForm({ listing, onSubmit, loading }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');

  // Simple naive calculation for preview (assumes pricingUnit === 'day')
  const calculateTotal = () => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end) || start > end) return null;
    
    // Inclusive days
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const pricePerUnit = parseFloat(listing.pricePerUnit) || 0;
    
    return diffDays * pricePerUnit;
  };

  const total = calculateTotal();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ startDate, endDate, message });
  };

  return (
    <form className="hr-booking-form" onSubmit={handleSubmit}>
      <h3 className="hr-booking-form__title">Request Booking</h3>
      
      <div className="hr-booking-form__dates">
        <div className="hr-field">
          <label htmlFor="startDate" className="hr-field__label">Start Date</label>
          <input
            id="startDate"
            type="date"
            className="hr-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div className="hr-field">
          <label htmlFor="endDate" className="hr-field__label">End Date</label>
          <input
            id="endDate"
            type="date"
            className="hr-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            min={startDate || new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      <div className="hr-field">
        <label htmlFor="message" className="hr-field__label">Message to Owner (Optional)</label>
        <textarea
          id="message"
          rows={3}
          className="hr-input hr-input--textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Hi, I'd like to rent this for..."
        />
      </div>

      {total !== null && total > 0 && (
        <div className="hr-booking-form__summary">
          <div className="hr-booking-form__summary-row">
            <span>Rental Cost</span>
            <span>{total.toLocaleString()} ETB</span>
          </div>
          {listing.depositAmount && (
            <div className="hr-booking-form__summary-row hr-booking-form__summary-row--deposit">
              <span>Security Deposit (Refundable)</span>
              <span>{parseFloat(listing.depositAmount).toLocaleString()} ETB</span>
            </div>
          )}
          <hr className="hr-booking-form__divider" />
          <div className="hr-booking-form__summary-row hr-booking-form__summary-row--total">
            <span>Total (Excluding Deposit)</span>
            <span>{total.toLocaleString()} ETB</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="hr-btn-primary"
        disabled={loading || !startDate || !endDate}
      >
        {loading ? 'Submitting...' : 'Request Booking'}
      </button>
    </form>
  );
}
