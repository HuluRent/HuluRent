// Thin wrapper around client.js for the categories backend module.
// See hulurent-docs' technical/api-reference.md "Categories" section.

import client from './client';

export function getCategories() {
  return client.get('/categories').then((res) => res.data);
}