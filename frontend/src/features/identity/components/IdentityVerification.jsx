import { useState } from 'react';
import {
  useIdentityVerificationStatus,
  useInitiateIdentityVerification,
  useVerifyIdentity,
} from '../hooks/useIdentity';
import { LoadingSpinner } from '../../../components/LoadingSpinner';

export function IdentityVerification() {
  const {
    data: statusData,
    isLoading,
    isError,
    error,
  } = useIdentityVerificationStatus();

  const initiateMut = useInitiateIdentityVerification();
  const verifyMut = useVerifyIdentity();

  const [idNumber, setIdNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Temporary debugging so we can see the real API error
  if (isError) {
    console.error('Identity verification status error:', error);
  }

  if (isLoading) {
    return (
      <div className="p-6 bg-white border border-surface-border rounded-2xl shadow-sm text-center">
        <LoadingSpinner label="Loading verification status…" />
      </div>
    );
  }

  if (isError) {
    const statusErrorMessage =
      typeof error?.message === 'string'
        ? error.message
        : typeof error?.response?.data?.error === 'string'
          ? error.response.data.error
          : 'Please try again later.';

    return (
      <div className="p-6 bg-red-50 border border-red-100 rounded-2xl shadow-sm text-center text-red-600">
        <span className="material-symbols-outlined mb-2 text-2xl">
          error
        </span>

        <p>
          Failed to load identity verification status:{' '}
          {statusErrorMessage}
        </p>
      </div>
    );
  }

  const status = statusData?.status || 'UNVERIFIED';

  const handleInitiate = (e) => {
    e.preventDefault();

    setErrorMessage('');
    setSuccessMessage('');

    if (!idNumber.trim()) {
      setErrorMessage('Please enter your ID number');
      return;
    }

    initiateMut.mutate(idNumber, {
      onSuccess: () => {
        setSuccessMessage(
          'Verification initiated. Please enter the OTP to continue.'
        );
      },

      onError: (err) => {
        const message =
          typeof err?.response?.data?.error === 'string'
            ? err.response.data.error
            : typeof err?.message === 'string'
              ? err.message
              : 'Failed to initiate verification';

        setErrorMessage(message);
      },
    });
  };

  const handleVerify = (e) => {
    e.preventDefault();

    setErrorMessage('');
    setSuccessMessage('');

    if (!idNumber.trim()) {
      setErrorMessage('Please enter your ID number');
      return;
    }

    if (!otp.trim()) {
      setErrorMessage('Please enter the OTP');
      return;
    }

    verifyMut.mutate(
      { idNumber, otp },
      {
        onSuccess: () => {
          setSuccessMessage('Identity verified successfully!');
          setOtp('');
        },

        onError: (err) => {
          const message =
            typeof err?.response?.data?.error === 'string'
              ? err.response.data.error
              : typeof err?.message === 'string'
                ? err.message
                : 'Verification failed';

          setErrorMessage(message);
        },
      }
    );
  };

  return (
    <div className="bg-white border border-surface-border rounded-2xl p-6 shadow-sm mb-10">
      <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">
          verified_user
        </span>
        Identity Verification
      </h2>

      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700 text-sm font-medium">
          <span className="material-symbols-outlined text-red-500">
            error
          </span>

          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 text-green-800 text-sm font-medium">
          <span className="material-symbols-outlined text-green-500">
            check_circle
          </span>

          <span>{successMessage}</span>
        </div>
      )}

      {status === 'VERIFIED' && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800">
          <span className="material-symbols-outlined text-3xl">
            check_circle
          </span>

          <div>
            <p className="font-semibold">Identity Verified</p>
            <p className="text-sm opacity-90">
              Your identity has been successfully verified.
            </p>
          </div>
        </div>
      )}

      {status === 'PENDING' && (
        <div>
          <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 mb-4">
            <span className="material-symbols-outlined text-3xl">
              mark_email_read
            </span>

            <div>
              <p className="font-semibold">Verification Pending</p>
              <p className="text-sm opacity-90">
                Please enter the OTP sent for verification.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleVerify}
            className="flex flex-col gap-3 max-w-sm"
          >
            <input
              type="password"
              placeholder="Enter ID Number"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              disabled={verifyMut.isPending}
              className="px-4 py-2 bg-surface-muted border border-surface-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text"
            />

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={verifyMut.isPending}
              className="px-4 py-2 bg-surface-muted border border-surface-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text"
            />

            <button
              type="submit"
              disabled={verifyMut.isPending}
              className="hr-btn-primary flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {verifyMut.isPending ? (
                <LoadingSpinner size="sm" />
              ) : (
                'Verify Identity'
              )}
            </button>
          </form>
        </div>
      )}

      {status === 'UNVERIFIED' && (
        <div>
          <p className="text-text-muted mb-4 text-sm leading-relaxed">
            Verifying your identity helps build trust in the HuluRent
            community. Please enter your valid ID number to begin the
            verification process.
          </p>

          <form
            onSubmit={handleInitiate}
            className="flex flex-col gap-3 max-w-sm"
          >
            <input
              type="password"
              placeholder="Enter ID Number"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              disabled={initiateMut.isPending}
              className="px-4 py-2 bg-surface-muted border border-surface-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text"
            />

            <button
              type="submit"
              disabled={initiateMut.isPending}
              className="hr-btn-primary flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {initiateMut.isPending ? (
                <LoadingSpinner size="sm" />
              ) : (
                'Start Verification'
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}