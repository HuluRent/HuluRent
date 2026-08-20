import client from './client';

export function getReports(params = {}) {
  return client.get('/admin/reports', { params }).then((res) => res.data);
}

export function updateReportStatus(id, status) {
  return client.patch(`/admin/reports/${id}`, { status }).then((res) => res.data);
}

export function getUsers(params = {}) {
  return client.get('/admin/users', { params }).then((res) => res.data);
}

export function restrictUser(id, { restricted, reason }) {
  return client
    .patch(`/admin/users/${id}/restrict`, { restricted, reason })
    .then((res) => res.data);
}

export function getAdminUsers(params = {}) {
  return getUsers(params);
}
