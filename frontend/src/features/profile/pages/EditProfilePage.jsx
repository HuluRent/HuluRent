import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useUpdateProfile } from '../hooks/useProfile';

export default function EditProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const updateMutation = useUpdateProfile();

  const [displayName, setDisplayName] = useState(user?.displayName || user?.profile?.displayName || '');
  const [bio, setBio] = useState(user?.bio || user?.profile?.bio || '');
  const [city, setCity] = useState(user?.city || user?.profile?.city || '');
  const [serverError, setServerError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    try {
      await updateMutation.mutateAsync({ displayName, bio, city });
      navigate('/profile');
    } catch (err) {
      setServerError(err.response?.data?.error?.message || 'Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="font-headline-lg text-headline-lg text-on-surface mb-6">Edit Profile</h1>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6">
        {serverError && (
          <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-lg font-body-sm" role="alert">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="displayName" className="font-label-md text-label-md text-on-surface">
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your display name"
              className="hr-input"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="bio" className="font-label-md text-label-md text-on-surface">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others about yourself"
              rows={4}
              className="hr-input hr-input--textarea resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="city" className="font-label-md text-label-md text-on-surface">
              City
            </label>
            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Addis Ababa"
              className="hr-input"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="hr-btn-primary flex-1"
            >
              {updateMutation.isPending ? 'Saving…' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="hr-btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

