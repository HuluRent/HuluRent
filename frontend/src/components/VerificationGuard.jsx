import { Navigate, useLocation, Link } from 'react-router-dom';
import { useIdentityVerificationStatus } from '../features/identity/hooks/useIdentity';
import { LoadingSpinner } from './LoadingSpinner';

export function VerificationGuard({ children, fallbackMessage = "Verify your identity first to continue." }) {
  const { data: statusData, isLoading } = useIdentityVerificationStatus();
  
  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner label="Checking verification status..." />
      </div>
    );
  }

  const isVerified = statusData?.status === 'VERIFIED';

  if (!isVerified) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-amber-500 text-4xl">gpp_maybe</span>
        </div>
        <h2 className="text-2xl font-bold text-text mb-2">Identity Verification Required</h2>
        <p className="text-text-muted mb-8 max-w-md">
          {fallbackMessage}
        </p>
        <Link to="/profile" className="hr-btn-primary">
          Verify Now
        </Link>
      </div>
    );
  }

  return children;
}
