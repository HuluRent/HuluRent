import client from './client';

export async function submitReview({ bookingId, rating, comment }) {
  const { data } = await client.post('/reviews', { bookingId, rating, comment });
  return data;
}

export async function getUserReviews(userId, params = {}) {
  const { data } = await client.get(`/reviews/user/${userId}`, { params });
  return data;
}
