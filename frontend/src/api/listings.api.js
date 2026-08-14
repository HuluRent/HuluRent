import client from './client';

export async function getFeaturedListings() {
  const response = await client.get('/listings/featured');
  return response.data;
}
