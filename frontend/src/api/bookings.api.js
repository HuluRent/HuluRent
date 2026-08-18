import client from './client';

export async function createBooking(data) {
  const response = await client.post('/bookings', data);
  return response.data;
}

export async function getBookingDetails(bookingId) {
  const response = await client.get(`/bookings/${bookingId}`);
  return response.data;
}

export async function getMyBookings(params) {
  const response = await client.get('/bookings/mine', { params });
  return response.data;
}

export async function acceptBooking(bookingId) {
  const response = await client.patch(`/bookings/${bookingId}/accept`);
  return response.data;
}

export async function rejectBooking(bookingId) {
  const response = await client.patch(`/bookings/${bookingId}/reject`);
  return response.data;
}

export async function confirmBooking(bookingId) {
  const response = await client.patch(`/bookings/${bookingId}/confirm`);
  return response.data;
}

export async function cancelBooking(bookingId) {
  const response = await client.patch(`/bookings/${bookingId}/cancel`);
  return response.data;
}
