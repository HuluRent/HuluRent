import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { getEmailError, isValidPassword } from '../../../utils/validators';
import './Auth.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = {};
    if (!fullName.trim()) next.fullName = 'Please enter your full name.';

    const emailErr = getEmailError(email);
    if (emailErr) next.email = 'Please enter a valid email address.';

    if (!password) next.password = 'Password is required.';
    else if (!isValidPassword(password)) next.password = 'Password must be at least 8 characters.';

    if (!confirmPassword) next.confirmPassword = 'Please confirm your password.';
    else if (password && confirmPassword !== password) next.confirmPassword = 'Passwords do not match.';

    if (!agreed) next.agreed = 'You must agree to the Terms and Privacy Policy.';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate() || loading) return;

    setLoading(true);
    try {
      await register(fullName, email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setServerError(
        err.response?.status === 409
          ? 'An account with this email already exists.'
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hr-login">
      {/* LEFT — brand panel (hidden on mobile via CSS) */}
      <aside className="hr-login__brand">
        <div className="hr-login__brand-inner">
          <div className="hr-login__logo">HuluRent</div>

          <h1 className="hr-login__headline">Join HuluRent</h1>
          <p className="hr-login__sub">
            List what you own. Rent what you need. All in Addis Ababa.
          </p>

        </div>
      </aside>

      {/* RIGHT — auth card */}
      <main className="hr-login__main">
         <div className="hr-login__logo">HuluRent</div>

        <div className="hr-card">
          <h2 className="hr-card__title">Create your account</h2>
          <p className="hr-card__sub">Sign up to start renting and listing on HuluRent.</p>

          {serverError && (
            <div className="hr-alert" role="alert">
              {serverError}
            </div>
          )}

          <form className="hr-form" onSubmit={handleSubmit} noValidate>
            <div className="hr-field">
              <label htmlFor="fullName" className="hr-field__label">
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className={`hr-input ${errors.fullName ? 'hr-input--error' : ''}`}
                aria-invalid={!!errors.fullName}
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              />
              {errors.fullName && (
                <p className="hr-field__error" id="fullName-error">
                  {errors.fullName}
                </p>
              )}
            </div>

            <div className="hr-field">
              <label htmlFor="email" className="hr-field__label">
                Email address
              </label>
              <input
                id="email"
                type="text"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className={`hr-input ${errors.email ? 'hr-input--error' : ''}`}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p className="hr-field__error" id="email-error">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="hr-field">
              <label htmlFor="password" className="hr-field__label">
                Password
              </label>
              <div className="hr-input-wrap">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className={`hr-input ${errors.password ? 'hr-input--error' : ''}`}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  className="hr-input-wrap__toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                      <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.4 5.5A10.4 10.4 0 0112 5c5.5 0 9 5 9 7-.4.7-1.2 1.9-2.4 3.1M6.6 6.6C4.5 8 3 10.3 3 12c0 2 3.5 7 9 7 1.3 0 2.5-.3 3.6-.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                      <path d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7"/>
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="hr-field__error" id="password-error">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="hr-field">
              <label htmlFor="confirmPassword" className="hr-field__label">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className={`hr-input ${errors.confirmPassword ? 'hr-input--error' : ''}`}
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
              />
              {errors.confirmPassword && (
                <p className="hr-field__error" id="confirmPassword-error">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="hr-field hr-field--checkbox">
              <label className="hr-checkbox">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  aria-invalid={!!errors.agreed}
                  aria-describedby={errors.agreed ? 'agreed-error' : undefined}
                />
                <span>
                  I agree to HuluRent's{' '}
                  <Link to="/terms" className="hr-link">Terms of Service</Link> and{' '}
                  <Link to="/privacy" className="hr-link">Privacy Policy</Link>.
                </span>
              </label>
              {errors.agreed && (
                <p className="hr-field__error" id="agreed-error">
                  {errors.agreed}
                </p>
              )}
            </div>

            <button type="submit" className="hr-btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="hr-spinner" aria-hidden="true" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <div className="hr-divider">
            <span>OR</span>
          </div>

          <button type="button" className="hr-btn-google">
            <svg viewBox="0 0 18 18" width="18" height="18">
              <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.71v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.61z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.19l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.98v2.33A9 9 0 009 18z"/>
              <path fill="#FBBC05" d="M3.95 10.69A5.4 5.4 0 013.68 9c0-.59.1-1.16.27-1.69V4.98H.98A9 9 0 000 9c0 1.45.35 2.83.98 4.02l2.97-2.33z"/>
              <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 00.98 4.98l2.97 2.33C4.66 5.17 6.65 3.58 9 3.58z"/>
            </svg>
            Continue with Google
          </button>
               <button type="button" className="hr-btn-apple">
           <svg viewBox="0 0 18 18" width="18" height="18" fill="currentColor">
             <path d="M13.15 9.53c-.02-1.9 1.55-2.82 1.62-2.86-.88-1.29-2.26-1.47-2.75-1.49-1.17-.12-2.28.69-2.87.69-.6 0-1.5-.67-2.47-.65-1.27.02-2.44.74-3.09 1.87-1.32 2.28-.34 5.66.95 7.51.63.9 1.38 1.92 2.36 1.88.95-.04 1.31-.61 2.46-.61 1.14 0 1.47.61 2.47.59 1.02-.02 1.67-.92 2.29-1.83.72-1.05 1.02-2.07 1.03-2.12-.02-.01-1.98-.76-2-3zM11.4 3.83c.52-.63.87-1.5.77-2.38-.75.03-1.66.5-2.2 1.13-.48.55-.9 1.44-.79 2.29.83.06 1.68-.42 2.22-1.04z"/>
           </svg>
           Continue with Apple
         </button>
          <p className="hr-signup">
            Already have an account? <Link to="/login" className="hr-link hr-link--strong">Log in</Link>
          </p>

          <p className="hr-trust">
            Your information is protected and kept private.
          </p>
        </div>
      </main>
    </div>
  );
}