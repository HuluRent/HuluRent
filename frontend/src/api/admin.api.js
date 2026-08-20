import client from './client';

export async function getAdminReports(params = {}) {
  const { data } = await client.get('/admin/reports', { params });
  return data;
}

export async function updateReportStatus(id, { status }) {
  const { data } = await client.patch(`/admin/reports/${id}`, { status });
  return data;
}

export async function getAdminUsers(params = {}) {
  const { data } = await client.get('/admin/users', { params });
  return data;
}

export async function restrictUser(id, { restricted, reason }) {
  const { data } = await client.patch(`/admin/users/${id}/restrict`, { restricted, reason });
  return data;
}

export async function getAuditLog(params = {}) {
  const { data } = await client.get('/admin/audit-log', { params });
  return data;
}
export function getReports(params = {}) {
  return client.get('/admin/reports', { params }).then((res) => res.data);
}

export function getUsers(params = {}) {
  return client.get('/admin/users', { params }).then((res) => res.data);
}
