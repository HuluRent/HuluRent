// Thin wrapper around client.js for the admin backend module.
// See docs/technical/api-reference.md "Admin" section — every one of
// these requires role: "ADMIN" server-side (authorize.js), not just
// hidden behind RoleGuard client-side.

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
  return client.patch(`/admin/users/${id}/restrict`, { restricted, reason }).then((res) => res.data);
}