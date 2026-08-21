import client from './client';

export function getListing(id) {
  return client.get(`/listings/${id}`).then((res) => res.data);
}

export function createListing(data, onUploadProgress) {
  const formData = new FormData();

  formData.append('name', data.name);
  formData.append('description', data.description);
  formData.append('categoryId', data.categoryId);
  formData.append('pricePerUnit', data.pricePerUnit);
  formData.append('pricingUnit', data.pricingUnit);
  if (data.depositAmount !== '' && data.depositAmount != null) {
    formData.append('depositAmount', data.depositAmount);
  }
  formData.append('approxLocation', data.approxLocation);

  (data.images || []).forEach((image) => {
    formData.append('images', image);
  });

  return client
    .post('/listings', formData, {
      onUploadProgress,
    })
    .then((res) => res.data);
}

export function updateListing(id, data) {
  return client.patch(`/listings/${id}`, data).then((res) => res.data);
}

export function deleteListing(id) {
  return client.delete(`/listings/${id}`).then((res) => res.data);
}

export function getMyListings({ categoryId, status } = {}) {
  return client
    .get('/listings/me', {
      params: { categoryId, status },
    })
    .then((res) => ({ items: res.data, page: 1, limit: res.data.length, total: res.data.length }));
}
