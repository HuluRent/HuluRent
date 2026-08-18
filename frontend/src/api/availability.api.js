// Thin wrapper around client.js for the availability backend module.
// See docs/technical/api-reference.md "Availability" section.

import { client } from './client';

export function getAvailability(itemId) {
  return client.get(`/availability/${itemId}`).then((res) => res.data);
}

export function createAvailability(data) {
  return client.post('/availability', data).then((res) => res.data);
}

export function deleteAvailability(id) {
  return client.delete(`/availability/${id}`).then((res) => res.data);
}