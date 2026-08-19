// Calculates distance in kilometers between two lat/lng coordinates using the Haversine formula

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function calculateDistanceInKm(lat1, lon1, lat2, lon2) {
  const earthRadiusKm = 6371;
  
  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
            
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

// Checks if a point is within a given radius (in km) of a center point
function isWithinRadius(centerLat, centerLon, pointLat, pointLon, radiusKm) {
  const distance = calculateDistanceInKm(centerLat, centerLon, pointLat, pointLon);
  return distance <= radiusKm;
}

module.exports = {
  calculateDistanceInKm,
  isWithinRadius,
};
