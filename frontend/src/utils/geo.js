// Haversine distance in kilometers between two lat/lng points
export function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

// "1.2 km away" / "850 m away"
export function formatDistance(km) {
  if (km == null || isNaN(km)) return '';
  if (km < 1) return `${Math.round(km * 1000)} m away`;
  return `${km.toFixed(1)} km away`;
}

// Addis Ababa center, used as fallback when geolocation is unavailable
export const ADDIS_ABABA_CENTER = { lat: 9.0192, lng: 38.7525 };

// Sort listings by distance from a reference point (mutates a copy, not original)
export function sortByDistance(listings, origin) {
  if (!origin) return listings;
  return [...listings]
    .map((listing) => ({
      ...listing,
      _distanceKm: distanceKm(origin.lat, origin.lng, listing.lat, listing.lng),
    }))
    .sort((a, b) => a._distanceKm - b._distanceKm);
}

// Filter listings within a radius (km) of origin
export function withinRadius(listings, origin, radiusKm) {
  if (!origin) return listings;
  return listings.filter(
    (listing) => distanceKm(origin.lat, origin.lng, listing.lat, listing.lng) <= radiusKm
  );
}