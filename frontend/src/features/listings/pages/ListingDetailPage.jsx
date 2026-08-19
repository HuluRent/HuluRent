import { Link, useParams } from 'react-router-dom';
import { useListing } from '../hooks/useListing';
import { ListingGallery } from '../components/ListingGallery';

export function ListingDetailPage() {
  const { listingId } = useParams();

  const {
    data: listing,
    isLoading,
    isError,
    error,
  } = useListing(listingId);

  if (isLoading) {
    return <main>Loading listing...</main>;
  }

  if (isError) {
    const status = error?.response?.status;

    if (status === 403 || status === 404) {
      return (
        <main>
          <h1>Listing not found</h1>
          <p>
            This listing is unavailable or you do not have permission to
            view it.
          </p>
          <Link to="/">Back to home</Link>
        </main>
      );
    }

    return (
      <main>
        <h1>Unable to load listing</h1>
        <p>Please try again later.</p>
        <Link to="/">Back to home</Link>
      </main>
    );
  }

  if (!listing) {
    return (
      <main>
        <h1>Listing not found</h1>
        <Link to="/">Back to home</Link>
      </main>
    );
  }

  return (
    <main>
      <section>
        <h1>{listing.name}</h1>

        <ListingGallery
          images={listing.images}
          alt={listing.name}
        />

        <p>{listing.description}</p>

        <p>
          <strong>Category:</strong>{' '}
          {listing.category?.name || 'Uncategorized'}
        </p>

        <p>
          <strong>Price:</strong> {listing.pricePerUnit} /{' '}
          {listing.pricingUnit}
        </p>

        {listing.depositAmount && (
          <p>
            <strong>Deposit:</strong> {listing.depositAmount}
          </p>
        )}

        <p>
          <strong>Location:</strong> {listing.approxLocation}
        </p>

        <p>
          <strong>Status:</strong> {listing.status}
        </p>

        <Link to={`/listings/${listing.id}/book`}>
          Book this listing
        </Link>
      </section>
    </main>
  );
}