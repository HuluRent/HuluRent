import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import {
  getEmailError,
  isValidPassword,
  isRequired,
} from '../../../utils/validators';
import './Auth.css';

function PasswordToggle({ show, onClick }) {
  return (
    <button
      type="button"
      className="hr-password-toggle"
      onClick={onClick}
      aria-label={show ? 'Hide password' : 'Show password'}
    >
      {show ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );
}

function GoogleButton() {
  return (
    <button
      type="button"
      className="hr-btn-google"
      onClick={() => {
        console.log('Google authentication is not implemented yet.');
      }}
    >
      <span className="hr-google-icon">G</span>
      Continue with Google
    </button>
  );
}

function StillLife() {
  return (
    <div className="hr-auth__illustration" aria-hidden="true">
      <div className="hr-auth__illustration-card">
        <span>📦</span>
        <span>📚</span>
        <span>🎧</span>
      </div>
    </div>
  );
}

export default function Register() {
  const { register, user } = useAuth();
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

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const validate = () => {
    const next = {};

    if (!isRequired(fullName)) {
      next.fullName = 'Full name is required.';
    }

    const emailErr = getEmailError(email);

    if (emailErr) {
      next.email = 'Please enter a valid email or phone number.';
    }

    if (!password) {
      next.password = 'Password is required.';
    } else if (!isValidPassword(password)) {
      next.password =
        'Password must be at least 8 characters and include a letter and a number.';
    }

    if (confirmPassword !== password) {
      next.confirmPassword = 'Passwords do not match.';
    }

    if (!agreed) {
      next.agreed = 'You must agree to the terms to continue.';
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate() || loading) {
      return;
    }

    setLoading(true);

    try {
      await register({
        fullName,
        email,
        password,
      });

      navigate('/', { replace: true });
    } catch (err) {
      setServerError(
        err.response?.status === 409
          ? 'An account with this email or phone number already exists.'
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hr-auth">
      <aside className="hr-auth__brand">
        <div className="hr-auth__brand-inner">
          <div className="hr-auth__logo">HuluRent</div>

          <h1 className="hr-auth__headline">Join HuluRent</h1>

          <p className="hr-auth__sub">
            Rent what you need. Earn from what you own.
          </p>

          <StillLife />
        </div>
      </aside>

      <main className="hr-auth__main">
        <div className="hr-auth__mobile-logo">HuluRent</div>

        <div className="hr-card">
          <h2 className="hr-card__title">Create your account</h2>

          <p className="hr-card__sub">
            Start renting or listing in a few minutes.
          </p>

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
                className={`hr-input ${
                  errors.fullName ? 'hr-input--error' : ''
                }`}
                aria-invalid={!!errors.fullName}
                aria-describedby={
                  errors.fullName ? 'fullName-error' : undefined
                }
              />

              {errors.fullName && (
                <p className="hr-field__error" id="fullName-error">
                  {errors.fullName}
                </p>
              )}
            </div>

            <div className="hr-field">
              <label htmlFor="identifier" className="hr-field__label">
                Email or phone number
              </label>

              <input
                id="identifier"
                type="text"
                inputMode="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email or phone number"
                className={`hr-input ${
                  errors.email ? 'hr-input--error' : ''
                }`}
                aria-invalid={!!errors.email}
                aria-describedby={
                  errors.email ? 'identifier-error' : undefined
                }
              />

              {errors.email && (
                <p className="hr-field__error" id="identifier-error">
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
                  className={`hr-input ${
                    errors.password ? 'hr-input--error' : ''
                  }`}
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password
                      ? 'password-error'
                      : 'password-hint'
                  }
                />

                <PasswordToggle
                  show={showPassword}
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                />
              </div>

              {errors.password ? (
                <p className="hr-field__error" id="password-error">
                  {errors.password}
                </p>
              ) : (
                <p className="hr-field__hint" id="password-hint">
                  At least 8 characters, with a letter and a number.
                </p>
              )}
            </div>

            <div className="hr-field">
              <label
                htmlFor="confirmPassword"
                className="hr-field__label"
              >
                Confirm password
              </label>

              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className={`hr-input ${
                  errors.confirmPassword
                    ? 'hr-input--error'
                    : ''
                }`}
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={
                  errors.confirmPassword
                    ? 'confirmPassword-error'
                    : undefined
                }
              />

              {errors.confirmPassword && (
                <p
                  className="hr-field__error"
                  id="confirmPassword-error"
                >
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <label className="hr-checkbox-row">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                aria-invalid={!!errors.agreed}
              />

              <span>
                I agree to HuluRent's{' '}
                <Link to="/terms" className="hr-link">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="hr-link">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            {errors.agreed && (
              <p className="hr-field__error">
                {errors.agreed}
              </p>
            )}

            <button
              type="submit"
              className="hr-btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="hr-spinner"
                    aria-hidden="true"
                  />
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

          <GoogleButton />

          <p className="hr-signup">
            Already have an account?{' '}
            <Link
              to="/login"
              className="hr-link hr-link--strong"
            >
              Log in
            </Link>
          </p>

          <p className="hr-trust">
            Your account information is protected and kept private.
          </p>
        </div>
      </main>
    </div>
  );
}