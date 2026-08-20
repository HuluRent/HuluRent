// View/edit for the current user's own profile.
//
// AC requires only sending changed fields on PATCH, not the whole form —
// EDITABLE_FIELDS below is the single source of truth for the diff, so a
// future field addition only needs updating in one place.
//
// avatarUrl is a plain URL text input, not a file upload — there's no
// avatar upload endpoint in api-reference.md (unlike listing images,
// which do have one). Same honest limitation as ListingForm.jsx's
// lat/lng inputs: no geocoding, manual numeric entry.

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { getUserProfile, updateMyProfile } from '../../../api/users.api';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { EmptyState } from '../../../components/EmptyState';
import './ProfilePage.css';

const EDITABLE_FIELDS = ['displayName', 'bio', 'avatarUrl', 'city', 'latitude', 'longitude'];

function buildPatch(original, current) {
  const patch = {};
  for (const field of EDITABLE_FIELDS) {
    if ((current[field] ?? '') !== (original[field] ?? '')) {
      patch[field] = current[field];
    }
  }
  return patch;
}

export function ProfilePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: () => getUserProfile(user.id),
    enabled: !!user?.id,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(null);

  // Snapshot the fetched profile into editable form state whenever it
  // loads (or reloads after a save) — keeps the diff base in sync.
  useEffect(() => {
    if (profile) {
      setForm({
        displayName: profile.profile?.displayName ?? '',
        bio: profile.profile?.bio ?? '',
        avatarUrl: profile.profile?.avatarUrl ?? '',
        city: profile.profile?.city ?? '',
        latitude: profile.profile?.latitude ?? '',
        longitude: profile.profile?.longitude ?? '',
      });
    }
  }, [profile]);

  const { mutate, isPending, error } = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile', user.id] });
      setIsEditing(false);
    },
  });

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSave() {
    const patch = buildPatch(profile, form);
    if (Object.keys(patch).length === 0) {
      setIsEditing(false); // nothing changed, just exit edit mode
      return;
    }
    mutate(patch);
  }

  if (isLoading || !form) return <LoadingSpinner label="Loading profile…" />;
  if (isError || !profile) return <EmptyState icon="error" title="Couldn't load your profile" />;

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-stack-lg">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">My Profile</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="font-label-sm text-label-sm border border-primary text-primary px-4 py-2 rounded-lg hover:bg-surface-container-low transition-colors"
          >
            Edit
          </button>
        )}
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-subtle">
        <div className="flex items-center gap-4 mb-stack-md">
          {profile.profile?.avatarUrl ? (
            <img src={profile.profile?.avatarUrl} alt={profile.profile?.displayName} className="w-16 h-16 rounded-full object-cover border border-outline-variant" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-surface-variant border border-outline-variant" />
          )}
          {!isEditing && (
            <div>
              <p className="font-headline-md text-headline-md text-on-surface">{profile.profile?.displayName}</p>
              {profile.profile?.city && <p className="font-body-sm text-body-sm text-on-surface-variant">{profile.profile?.city}</p>}
            </div>
          )}
        </div>

        {isEditing ? (
          <>
            {error && (
              <p className="mb-stack-md font-body-sm text-body-sm text-error">
                Couldn't save changes. Try again in a moment.
              </p>
            )}

            <div className="mb-stack-md">
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Display name</label>
              <input
                type="text"
                value={form.displayName}
                onChange={(e) => handleChange('displayName', e.target.value)}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>

            <div className="mb-stack-md">
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
              />
            </div>

            <div className="mb-stack-md">
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Avatar URL</label>
              <input
                type="text"
                value={form.avatarUrl}
                onChange={(e) => handleChange('avatarUrl', e.target.value)}
                placeholder="https://…"
                className="w-full px-3 py-2 border border-outline-variant rounded-lg font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>

            <div className="mb-stack-md">
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">City</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="e.g. Addis Ababa"
                className="w-full px-3 py-2 border border-outline-variant rounded-lg font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>

            <div className="flex gap-2 mt-stack-lg">
              <button
                onClick={handleSave}
                disabled={isPending}
                className="flex-1 bg-primary-container text-on-primary font-headline-md text-headline-md px-4 py-2 rounded-lg shadow-subtle hover:shadow-hover transition-all disabled:opacity-60"
              >
                {isPending ? 'Saving…' : 'Save Changes'}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setForm({
                    displayName: profile.profile?.displayName ?? '',
                    bio: profile.profile?.bio ?? '',
                    avatarUrl: profile.profile?.avatarUrl ?? '',
                    city: profile.profile?.city ?? '',
                    latitude: profile.profile?.latitude ?? '',
                    longitude: profile.profile?.longitude ?? '',
                  });
                }}
                className="px-4 py-2 rounded-lg border border-outline-variant text-on-surface-variant font-label-sm text-label-sm hover:bg-surface-container-low transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          profile.profile?.bio && <p className="font-body-md text-on-surface whitespace-pre-wrap">{profile.profile?.bio}</p>
        )}
      </div>

      <Link
        to="/verify-identity"
        className="block mt-stack-md text-center font-label-sm text-label-sm text-primary hover:underline"
      >
        Manage identity verification →
      </Link>
    </div>
  );
}