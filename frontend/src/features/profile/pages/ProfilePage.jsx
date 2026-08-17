
import { useState, useEffect, useCallback } from 'react';
import { getMyProfile, updateMyProfile } from '../../../api/users.api';
import { getPhoneError, isRequired } from '../../../utils/validators';
import './ProfilePage.css';

const EDITABLE_FIELDS = ['fullName', 'phone', 'bio', 'location'];

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [mode, setMode] = useState('view'); // 'view' | 'edit'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const data = await getMyProfile();
      setProfile(data);
      setForm(data);
    } catch {
      setLoadError('Could not load your profile. Please refresh and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const next = {};
    if (!isRequired(form.fullName)) next.fullName = 'Full name is required.';
    if (form.phone) {
      const phoneErr = getPhoneError(form.phone);
      if (phoneErr) next.phone = phoneErr;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // Only the fields that actually differ from the last-saved profile
  const getChangedFields = () => {
    const changed = {};
    for (const field of EDITABLE_FIELDS) {
      if (form[field] !== profile[field]) {
        changed[field] = form[field];
      }
    }
    return changed;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveError('');
    setSaved(false);
    if (!validate() || saving) return;

    const changed = getChangedFields();
    if (Object.keys(changed).length === 0) {
      setMode('view');
      return;
    }

    setSaving(true);
    try {
      const updated = await updateMyProfile(changed);
      setProfile(updated);
      setForm(updated);
      setMode('view');
      setSaved(true);
    } catch (err) {
      setSaveError(
        err.response?.status === 409
          ? 'That phone number is already in use.'
          : 'Could not save your changes. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(profile);
    setErrors({});
    setSaveError('');
    setMode('view');
  };

  if (loading) {
    return <div className="hr-profile hr-profile--state">Loading your profile…</div>;
  }

  if (loadError) {
    return (
      <div className="hr-profile hr-profile--state">
        <p>{loadError}</p>
        <button className="hr-btn-secondary" onClick={load}>Try again</button>
      </div>
    );
  }

  return (
    <div className="hr-profile">
      <div className="hr-profile__header">
        <div className="hr-profile__avatar">
          {profile.avatarUrl
            ? <img src={profile.avatarUrl} alt="" />
            : <span>{(profile.fullName || '?').charAt(0).toUpperCase()}</span>}
        </div>
        <div>
          <h1 className="hr-profile__name">{profile.fullName}</h1>
          <p className="hr-profile__email">{profile.email}</p>
        </div>
        {mode === 'view' && (
          <button className="hr-btn-secondary hr-profile__edit-btn" onClick={() => setMode('edit')}>
            Edit profile
          </button>
        )}
      </div>

      {saved && <div className="hr-toast" role="status">Profile updated.</div>}
      {saveError && <div className="hr-alert" role="alert">{saveError}</div>}

      {mode === 'view' ? (
        <dl className="hr-profile__details">
          <div className="hr-profile__row">
            <dt>Phone</dt>
            <dd>{profile.phone || '—'}</dd>
          </div>
          <div className="hr-profile__row">
            <dt>Location</dt>
            <dd>{profile.location || '—'}</dd>
          </div>
          <div className="hr-profile__row">
            <dt>Bio</dt>
            <dd>{profile.bio || '—'}</dd>
          </div>
        </dl>
      ) : (
        <form className="hr-form" onSubmit={handleSave} noValidate>
          <div className="hr-field">
            <label htmlFor="fullName" className="hr-field__label">Full name</label>
            <input
              id="fullName"
              type="text"
              value={form.fullName || ''}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className={`hr-input ${errors.fullName ? 'hr-input--error' : ''}`}
            />
            {errors.fullName && <p className="hr-field__error">{errors.fullName}</p>}
          </div>

          <div className="hr-field">
            <label htmlFor="phone" className="hr-field__label">Phone number</label>
            <input
              id="phone"
              type="tel"
              value={form.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="09xxxxxxxx"
              className={`hr-input ${errors.phone ? 'hr-input--error' : ''}`}
            />
            {errors.phone && <p className="hr-field__error">{errors.phone}</p>}
          </div>

          <div className="hr-field">
            <label htmlFor="location" className="hr-field__label">Location</label>
            <input
              id="location"
              type="text"
              value={form.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="e.g. Bole, Addis Ababa"
              className="hr-input"
            />
          </div>

          <div className="hr-field">
            <label htmlFor="bio" className="hr-field__label">Bio</label>
            <textarea
              id="bio"
              rows={4}
              value={form.bio || ''}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder="Tell renters a bit about yourself"
              className="hr-input hr-input--textarea"
            />
          </div>

          <div className="hr-profile__actions">
            <button type="button" className="hr-btn-secondary" onClick={handleCancel} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="hr-btn-primary hr-btn-primary--auto" disabled={saving}>
              {saving ? <><span className="hr-spinner" aria-hidden="true" />Saving...</> : 'Save changes'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}