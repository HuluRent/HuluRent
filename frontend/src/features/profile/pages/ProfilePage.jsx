import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { usePublicProfile } from '../hooks/useProfile';
import { useUserReviews } from '../../reviews/hooks/useSubmitReview';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { EmptyState } from '../../../components/EmptyState';
import { LogoutModal } from '../../../components/LogoutModal';
import { IdentityVerification } from '../../identity/components/IdentityVerification';

export function ProfilePage() {
  const { userId } = useParams();
  const { user: currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const profileUserId = userId || currentUser?.id;
  const isOwnProfile = !userId || userId === currentUser?.id;

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { data: profile, isLoading, isError } = usePublicProfile(profileUserId);
  const { data: reviewsData } = useUserReviews(profileUserId);
  const reviews = reviewsData?.items || reviewsData || [];

  function handleLogoutConfirm() {
    logout();
    setShowLogoutModal(false);
    navigate('/login');
  }

  if (isLoading) return (
    <div className="py-20 flex justify-center">
      <LoadingSpinner label="Loading profile…" />
    </div>
  );

  if (isError || !profile) {
    return (
      <div className="py-20">
        <EmptyState
          icon="person_off"
          title="Profile not found"
          description="This user profile could not be loaded."
        />
      </div>
    );
  }

  return (
    <div className="hr-container max-w-4xl mx-auto py-8">
      {/* ── Profile Header ─────────────────────────────── */}
      <div className="bg-white border border-surface-border rounded-3xl p-8 shadow-sm mb-10 flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>

        <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 border-4 border-white shadow-md z-10 bg-surface-muted">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={`${profile.displayName}'s profile`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted bg-surface-muted">
              <span className="material-symbols-outlined text-[64px]">person</span>
            </div>
          )}
        </div>

        <div className="flex-1 text-center md:text-left z-10">
          <h1 className="text-3xl font-bold text-text mb-3">{profile.displayName}</h1>

          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-sm text-text-muted mb-4 justify-center md:justify-start">
            {profile.city && (
              <span className="flex items-center gap-1.5 justify-center md:justify-start">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
                {profile.city}
              </span>
            )}
            <span className="flex items-center gap-1.5 justify-center md:justify-start">
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>

          {profile.bio && (
            <p className="text-text leading-relaxed max-w-2xl">{profile.bio}</p>
          )}
        </div>

        {isOwnProfile && (
          <div className="flex flex-col gap-3 w-full md:w-auto mt-4 md:mt-0 z-10">
            <Link to="/profile/edit" className="hr-btn-primary !py-2.5 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[20px]">edit</span>
              Edit Profile
            </Link>
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className="px-4 py-2.5 rounded-xl border border-surface-border text-sm font-medium text-text hover:bg-surface-muted transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              Log out
            </button>
          </div>
        )}
      </div>

      {isOwnProfile && <IdentityVerification />}

      {/* ── Reviews Section ────────────────────────────── */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-text mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          Reviews ({Array.isArray(reviews) ? reviews.length : 0})
        </h2>

        {!Array.isArray(reviews) || reviews.length === 0 ? (
          <div className="py-12 border border-dashed border-surface-border rounded-2xl bg-surface-muted text-center">
            <span className="material-symbols-outlined text-4xl text-text-muted mb-2">star_border</span>
            <p className="text-text-muted font-medium">No reviews yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-6 rounded-2xl border border-surface-border shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-accent-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-[18px]">
                        {i < review.rating ? 'star' : 'star_border'}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-text-muted font-medium">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-text leading-relaxed flex-1 mb-4 italic">
                  "{review.comment}"
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-surface-border mt-auto">
                  <div className="w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center text-text-muted">
                    <span className="material-symbols-outlined text-[16px]">person</span>
                  </div>
                  <span className="text-sm font-semibold text-text">
                    {review.author?.displayName || 'Anonymous'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutModal(false)}
      />
    </div>
  );
}

export default ProfilePage;
