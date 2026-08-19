import client from './client';

export function getListing(id) {
  return client.get(`/listings/${id}`).then((res) => res.data);
}

export function createListing(data) {
  return client.post('/listings', data).then((res) => res.data);
}

export function updateListing(id, data) {
  return client.patch(`/listings/${id}`, data).then((res) => res.data);
}

export function deleteListing(id) {
  return client.delete(`/listings/${id}`).then((res) => res.data);
}
