import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { getEmailError, isValidPassword } from '../../../utils/validators';

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
    if (!agreed) next.agreed = 'You must agree to the terms.';

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
    <div className="min-h-screen flex items-center justify-center bg-surface-muted p-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-card border border-surface-border overflow-hidden">
        <div className="p-8 pb-6 border-b border-surface-border flex flex-col items-center text-center">
          <Link to="/" className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-3xl">home_work</span>
          </Link>
          <h1 className="text-2xl font-bold text-text mb-2">Create an account</h1>
          <p className="text-text-muted">Join HuluRent to start renting and listing.</p>
        </div>

        <div className="p-8 pt-6">
          {serverError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700 text-sm font-medium">
              <span className="material-symbols-outlined text-red-500">error</span>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-text mb-1.5">Full name</label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className={`hr-input ${errors.fullName ? 'border-red-500 focus:ring-red-500/20' : ''}`}
              />
              {errors.fullName && <p className="mt-1.5 text-sm text-red-500">{errors.fullName}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text mb-1.5">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`hr-input ${errors.email ? 'border-red-500 focus:ring-red-500/20' : ''}`}
              />
              {errors.email && <p className="mt-1.5 text-sm text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text mb-1.5">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className={`hr-input pr-12 ${errors.password ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text p-1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-sm text-red-500">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text mb-1.5">Confirm password</label>
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className={`hr-input ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500/20' : ''}`}
              />
              {errors.confirmPassword && <p className="mt-1.5 text-sm text-red-500">{errors.confirmPassword}</p>}
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center pt-0.5">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-5 h-5 border-2 border-slate-300 rounded text-primary focus:ring-primary/20 transition-all cursor-pointer"
                  />
                </div>
                <span className="text-sm text-text-muted leading-relaxed">
                  I agree to HuluRent's <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                </span>
              </label>
              {errors.agreed && <p className="mt-1.5 text-sm text-red-500 ml-8">{errors.agreed}</p>}
            </div>

            <button type="submit" className="hr-btn-primary w-full !py-3.5 mt-2" disabled={loading}>
              {loading ? (
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-text-muted">
            Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}