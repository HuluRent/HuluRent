import { useState } from 'react';
import { useRestrictUser } from '../hooks/useAdminUsers';

export function AuditLogTable({ users = [], searchQuery, onSearchChange }) {
  const restrictMut = useRestrictUser();
  const [restrictReason, setRestrictReason] = useState('');

  const handleRestrict = (userId, currentlyRestricted) => {
    const action = currentlyRestricted ? 'unrestrict' : 'restrict';
    const reason = currentlyRestricted ? 'Unrestricted by admin' : restrictReason || 'Restricted by admin';

    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      restrictMut.mutate({ id: userId, restricted: !currentlyRestricted, reason });
      setRestrictReason('');
    }
  };

  return (
    <div>
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery || ''}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search users by name or email…"
          className="w-full max-w-md px-4 py-2.5 border border-outline-variant rounded-xl bg-surface font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {users.length === 0 ? (
        <p className="font-body-md text-on-surface-variant py-8 text-center">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-outline-variant">
                <th className="font-label-md text-label-md text-on-surface-variant py-3 px-4">Name</th>
                <th className="font-label-md text-label-md text-on-surface-variant py-3 px-4">Email</th>
                <th className="font-label-md text-label-md text-on-surface-variant py-3 px-4">Role</th>
                <th className="font-label-md text-label-md text-on-surface-variant py-3 px-4">Joined</th>
                <th className="font-label-md text-label-md text-on-surface-variant py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-outline-variant hover:bg-surface-container/50 transition-colors">
                  <td className="font-body-md text-on-surface py-3 px-4">{u.displayName || '—'}</td>
                  <td className="font-body-sm text-on-surface-variant py-3 px-4">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="font-body-sm text-on-surface-variant py-3 px-4">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleRestrict(u.id, u.restricted)}
                      disabled={restrictMut.isPending}
                      className={`px-3 py-1.5 font-label-sm rounded-lg transition-colors disabled:opacity-60 ${
                        u.restricted
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-red-600 text-white hover:bg-red-700'
                      }`}
                    >
                      {u.restricted ? 'Unrestrict' : 'Restrict'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
export default AuditLogTable;
