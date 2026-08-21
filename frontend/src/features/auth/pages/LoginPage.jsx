import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { getEmailError, isValidPassword } from '../../../utils/validators';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = {};
    const emailErr = getEmailError(email);
    if (emailErr) next.email = 'Please enter a valid email or phone number.';
    if (!password) next.password = 'Password is required.';
    else if (!isValidPassword(password)) next.password = 'Password must be at least 8 characters.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate() || loading) return;

    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(
        err.response?.status === 401
          ? 'Incorrect email or password.'
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-muted p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-card border border-surface-border overflow-hidden">

        <div className="p-8 pb-6 border-b border-surface-border flex flex-col items-center text-center">
          <Link to="/" className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-3xl">home_work</span>
          </Link>
          <h1 className="text-2xl font-bold text-text mb-2">Welcome back</h1>
          <p className="text-text-muted">Log in to your HuluRent account</p>
        </div>

        <div className="p-8 pt-6">
          {serverError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700 text-sm font-medium">
              <span className="material-symbols-outlined text-red-500">error</span>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-text mb-1.5">
                Email or phone number
              </label>
              <input
                id="identifier"
                type="text"
                inputMode="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`hr-input ${errors.email ? 'border-red-500 focus:ring-red-500/20' : ''}`}
              />
              {errors.email && <p className="mt-1.5 text-sm text-red-500">{errors.email}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-text">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`hr-input pr-12 ${errors.password ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text p-1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-sm text-red-500">{errors.password}</p>}
            </div>

            <button type="submit" className="hr-btn-primary w-full !py-3.5" disabled={loading}>
              {loading ? (
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
              ) : (
                'Log in'
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-px bg-surface-border flex-1"></div>
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">or</span>
            <div className="h-px bg-surface-border flex-1"></div>
          </div>

          <div className="mt-8 space-y-3">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-surface-border rounded-xl text-text font-medium hover:bg-surface-muted transition-colors"
              onClick={() => setServerError('Google authentication is not yet configured.')}
            >
              <svg viewBox="0 0 18 18" width="18" height="18">
                <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.71v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.61z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.19l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.98v2.33A9 9 0 009 18z"/>
                <path fill="#FBBC05" d="M3.95 10.69A5.4 5.4 0 013.68 9c0-.59.1-1.16.27-1.69V4.98H.98A9 9 0 000 9c0 1.45.35 2.83.98 4.02l2.97-2.33z"/>
                <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 00.98 4.98l2.97 2.33C4.66 5.17 6.65 3.58 9 3.58z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-text-muted">
            Don't have an account? <Link to="/register" className="font-semibold text-primary hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}