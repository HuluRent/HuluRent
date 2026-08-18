import { Link, useParams } from 'react-router-dom';
import { useListing } from '../hooks/useListing';

export function ListingDetailPage() {
  const { listingId } = useParams();
  const { data: listing, isLoading, isError } = useListing(listingId);

  if (isLoading) {
    return <div>Loading listing...</div>;
  }

  if (isError || !listing) {
    return <div>Listing not found.</div>;
  }

  return (
    <main>
      <section>
        <h1>{listing.name}</h1>

        <p>{listing.description}</p>

        <p>
          <strong>Category:</strong>{' '}
          {listing.category?.name || 'Uncategorized'}
        </p>

        <p>
          <strong>Price:</strong> {listing.pricePerUnit} / {listing.pricingUnit}
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

        {listing.images?.length > 0 && (
          <section>
            <h2>Images</h2>

            <div>
              {listing.images.map((image) => (
                <img
                  key={image.id}
                  src={image.url}
                  alt={listing.name}
                />
              ))}
            </div>
          </section>
        )}

        <Link to={`/listings/${listing.id}/book`}>
          Book this listing
        </Link>
      </section>
    </main>
  );
}