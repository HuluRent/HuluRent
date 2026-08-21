import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { usePublicProfile } from '../hooks/useProfile';
import { useUserReviews } from '../../reviews/hooks/useSubmitReview';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { EmptyState } from '../../../components/EmptyState';
import './ProfilePage.css';

export default function ProfilePage() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const profileUserId = userId || currentUser?.id;
  const isOwnProfile = !userId || userId === currentUser?.id;

  const { data: profile, isLoading, isError } = usePublicProfile(profileUserId);
  const { data: reviewsData } = useUserReviews(profileUserId);
  const reviews = reviewsData?.items || reviewsData || [];

  if (isLoading) return <LoadingSpinner label="Loading profile…" />;

  if (isError || !profile) {
    return (
      <EmptyState
        icon="person_off"
        title="Profile not found"
        description="This user profile could not be loaded."
      />
    );
  }

  return (
    <div className="hr-profile">
      {/* ── Profile Header ─────────────────────────────── */}
      <div className="hr-profile__header">
        <div className="hr-profile__avatar">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={`${profile.displayName}'s profile photo`}
            />
          ) : (
            <span className="material-symbols-outlined">account_circle</span>
          )}
        </div>

        <div className="hr-profile__info">
          <h1 className="hr-profile__name">{profile.displayName}</h1>

          {profile.city && (
            <p className="hr-profile__location">
              <span className="material-symbols-outlined">location_on</span>
              {profile.city}
            </p>
          )}

          {profile.bio && (
            <p className="hr-profile__bio">{profile.bio}</p>
          )}

          <p className="hr-profile__meta">
            Member since{' '}
            {new Date(profile.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        {isOwnProfile && (
          <Link to="/profile/edit" className="hr-profile__edit-btn">
            <span className="material-symbols-outlined">edit</span>
            Edit Profile
          </Link>
        )}
      </div>

      {/* ── Reviews Section ────────────────────────────── */}
      <div className="hr-profile__reviews">
        <h2 className="hr-profile__reviews-heading">
          <span className="material-symbols-outlined">rate_review</span>
          Reviews
          <span className="hr-profile__reviews-count">
            ({Array.isArray(reviews) ? reviews.length : 0})
          </span>
        </h2>

        {!Array.isArray(reviews) || reviews.length === 0 ? (
          <div className="hr-profile__reviews-empty">
            <span className="material-symbols-outlined">star_border</span>
            <p>No reviews yet.</p>
          </div>
        ) : (
          <div>
            {reviews.map((review) => (
              <div key={review.id} className="hr-profile__review">
                <div className="hr-profile__review-top">
                  <span className="hr-profile__review-stars">
                    {'★'.repeat(review.rating)}
                    {'☆'.repeat(5 - review.rating)}
                  </span>
                  <span className="hr-profile__review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {review.comment && (
                  <p className="hr-profile__review-comment">{review.comment}</p>
                )}

                <p className="hr-profile__review-author">
                  — {review.author?.displayName || 'Anonymous'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export { ProfilePage };
