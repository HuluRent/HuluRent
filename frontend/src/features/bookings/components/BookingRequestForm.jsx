import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatDateRange } from '../../../utils/formatDate';
import { AvailabilityCalendar } from '../../listings/components/AvailabilityCalendar';
import { useAuth } from '../../../hooks/useAuth';
import { createBooking } from '../../../api/bookings.api';

function calculateDuration(startStr, endStr, pricingUnit) {
  const start = new Date(startStr);
  const end = new Date(endStr);
  const diffTime = Math.max(0, end - start);
  const diffDays = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));

  if (pricingUnit === 'week') {
    return Math.ceil(diffDays / 7);
  }
  if (pricingUnit === 'month') {
    return Math.ceil(diffDays / 30);
  }
  return diffDays;
}

export function BookingRequestForm({ item }) {
  const [selectedRange, setSelectedRange] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const duration = selectedRange ? calculateDuration(selectedRange.startDate, selectedRange.endDate, item.pricingUnit) : 0;
  const rentalTotal = selectedRange ? parseFloat(item.pricePerUnit) * duration : 0;
  const deposit = item.depositAmount ? parseFloat(item.depositAmount) : 0;
  const total = rentalTotal + deposit;

  const mutation = useMutation({
    mutationFn: (data) => createBooking(data),
    onSuccess: (response) => {
      navigate('/bookings', { state: { message: 'Booking request sent successfully!' } });
    },
  });

  const handleAction = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }

    if (selectedRange) {
      mutation.mutate({
        itemId: item.id,
        startDate: selectedRange.startDate,
        endDate: selectedRange.endDate,
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div>
        <h3 className="text-xl font-bold text-text mb-4">1. Select Dates</h3>
        <p className="text-text-muted mb-6 text-sm">Choose the dates you would like to rent this item. Blue indicates available days.</p>
        <div className="bg-surface-muted rounded-xl p-4 border border-surface-border">
          <AvailabilityCalendar
            itemId={item.id}
            mode="view"
            onRangeSelect={(startDate, endDate) => setSelectedRange({ startDate, endDate })}
          />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-text mb-4">2. Review & Request</h3>

        {mutation.isError && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-start gap-3">
            <span className="material-symbols-outlined text-red-500">error</span>
            <p className="text-sm font-medium">{mutation.error.response?.data?.error?.message || mutation.error.message || 'An error occurred while booking. Please try again.'}</p>
          </div>
        )}

        {!selectedRange ? (
          <div className="bg-surface-muted rounded-xl p-8 border border-surface-border flex flex-col items-center justify-center text-center h-48">
            <span className="material-symbols-outlined text-4xl text-text-muted mb-2">date_range</span>
            <p className="text-text-muted">Select dates on the calendar to see pricing.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-surface-border overflow-hidden shadow-sm">
            <div className="p-5 border-b border-surface-border bg-surface-muted/50">
              <div className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-1">Dates</div>
              <div className="text-lg font-medium text-text">{formatDateRange(selectedRange.startDate, selectedRange.endDate)}</div>
              <div className="text-sm text-text-muted mt-1">
                {duration} {duration === 1 ? item.pricingUnit : `${item.pricingUnit}s`}
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex justify-between items-center text-text">
                <span>Rental Cost ({formatCurrency(item.pricePerUnit)} × {duration})</span>
                <span className="font-medium">{formatCurrency(rentalTotal)}</span>
              </div>

              {deposit > 0 && (
                <div className="flex justify-between items-center text-text">
                  <span>Security Deposit (Refundable)</span>
                  <span className="font-medium">{formatCurrency(deposit)}</span>
                </div>
              )}

              <div className="border-t border-surface-border pt-4 mt-4 flex justify-between items-center">
                <span className="font-bold text-text text-lg">Total Due</span>
                <span className="font-bold text-primary text-xl tracking-tight">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            <div className="p-5 bg-surface-muted/30 border-t border-surface-border">
              <button
                type="button"
                disabled={mutation.isPending}
                onClick={handleAction}
                className="hr-btn-primary w-full !py-4 !text-lg !rounded-xl"
              >
                {mutation.isPending ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    Submitting Request...
                  </>
                ) : !isAuthenticated ? (
                  'Sign in to request'
                ) : (
                  'Request to Book'
                )}
              </button>
              <p className="text-center text-xs text-text-muted mt-3">You will only be charged when the owner approves your request.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
