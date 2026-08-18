import client from './client';

export function getListing(id) {
  return client.get(`/listings/${id}`).then((res) => res.data);
}
