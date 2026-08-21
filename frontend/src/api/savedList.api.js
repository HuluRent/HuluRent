import client from './client';

/**
 * Fetch the authenticated user's saved list.
 * Each entry includes the saved listing's core fields + first image.
 * @returns {Promise<Array>}
 */
export async function getSavedList() {
  const { data } = await client.get('/saved-list');
  return data;
}

/**
 * Add a listing to the authenticated user's saved list.
 * @param {string} listingId
 * @returns {Promise<Object>}
 */
export async function addSavedListing(listingId) {
  const { data } = await client.post('/saved-list', { listingId });
  return data;
}

/**
 * Remove a listing from the authenticated user's saved list.
 * @param {string} listingId
 * @returns {Promise<void>}
 */
export async function removeSavedListing(listingId) {
  await client.delete(`/saved-list/${listingId}`);
}
