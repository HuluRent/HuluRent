import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BookingRequestForm } from '../components/BookingRequestForm';
import { useCreateBooking } from '../hooks/useCreateBooking';
import client from '../../../api/client';
import './BookingRequestPage.css';

// Mock function for now, since useListing is stubbed
async function fetchListing(id) {
  const { data } = await client.get(`/listings/${id}`);
  return data;
}

export default function BookingRequestPage() {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const { mutateAsync: createBooking, isPending } = useCreateBooking();

  const { data: listing, isLoading, error } = useQuery({
    queryKey: ['listing', listingId],
    queryFn: () => fetchListing(listingId),
  });

  const handleSubmit = async (formData) => {
    try {
      const result = await createBooking({
        itemId: listingId,
        ...formData,
      });
      // Navigate to the new booking detail page
      navigate(`/bookings/${result.id}`);
    } catch (err) {
      console.error('Failed to create booking', err);
      alert(err.response?.data?.error?.message || 'Failed to request booking. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="hr-booking-page hr-booking-page--loading">
        Loading listing details...
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="hr-booking-page hr-booking-page--error">
        <h3>Listing not found</h3>
        <button onClick={() => navigate(-1)} className="hr-btn-secondary">Go back</button>
      </div>
    );
  }

  return (
    <div className="hr-booking-page">
      <div className="hr-booking-page__header">
        <button className="hr-booking-page__back" onClick={() => navigate(-1)}>
          &larr; Back
        </button>
        <h1>Request Booking</h1>
      </div>

      <div className="hr-booking-page__content">
        <div className="hr-booking-page__listing-preview">
          {listing.images && listing.images.length > 0 ? (
            <img 
              src={listing.images[0].url} 
              alt={listing.name} 
              className="hr-booking-page__listing-image"
            />
          ) : (
            <div className="hr-booking-page__listing-image-placeholder">No Image</div>
          )}
          <div className="hr-booking-page__listing-info">
            <h2>{listing.name}</h2>
            <p className="hr-booking-page__listing-location">
              <span className="material-symbols-outlined">location_on</span>
              {listing.approxLocation}
            </p>
            <p className="hr-booking-page__listing-price">
              <strong>{parseFloat(listing.pricePerUnit).toLocaleString()} ETB</strong> / {listing.pricingUnit}
            </p>
          </div>
        </div>

        <div className="hr-booking-page__form-container">
          <BookingRequestForm 
            listing={listing} 
            onSubmit={handleSubmit} 
            loading={isPending} 
          />
        </div>
      </div>
    </div>
  );
}
