import client from './client';

export function getListing(id) {
  return client.get(`/listings/${id}`).then((res) => res.data);
}

export function createListing(data, onUploadProgress) {
  const formData = new FormData();

  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('categoryId', data.categoryId);
  formData.append('price', data.price);
  formData.append('deposit', data.deposit);

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
