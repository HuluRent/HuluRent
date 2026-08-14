const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Ethiopian mobile: +2519XXXXXXXX / +2517XXXXXXXX / 09XXXXXXXX / 07XXXXXXXX
const ET_PHONE_REGEX = /^(?:\+2519\d{8}|\+2517\d{8}|09\d{8}|07\d{8})$/;

export function isValidEmail(email) {
  return EMAIL_REGEX.test(String(email).trim());
}

export function isValidPhone(phone) {
  return ET_PHONE_REGEX.test(String(phone).trim().replace(/\s/g, ''));
}

// Min 8 chars, at least one letter and one number
export function isValidPassword(password) {
  return typeof password === 'string' &&
    password.length >= 8 &&
    /[A-Za-z]/.test(password) &&
    /\d/.test(password);
}

export function isRequired(value) {
  if (typeof value === 'string') return value.trim().length > 0;
  return value !== null && value !== undefined;
}

export function minLength(value, min) {
  return typeof value === 'string' && value.trim().length >= min;
}

export function maxLength(value, max) {
  return typeof value === 'string' && value.trim().length <= max;
}

export function isPositiveNumber(value) {
  const n = Number(value);
  return !isNaN(n) && n > 0;
}

// Booking date range: end after start, start not in the past
export function isValidDateRange(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  if (isNaN(s) || isNaN(e)) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return s >= today && e > s;
}

// Returns first validation error message, or '' if valid
export function getPasswordError(password) {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Must be at least 8 characters';
  if (!/[A-Za-z]/.test(password)) return 'Must contain a letter';
  if (!/\d/.test(password)) return 'Must contain a number';
  return '';
}

export function getEmailError(email) {
  if (!email) return 'Email is required';
  if (!isValidEmail(email)) return 'Enter a valid email';
  return '';
}

export function getPhoneError(phone) {
  if (!phone) return 'Phone number is required';
  if (!isValidPhone(phone)) return 'Enter a valid Ethiopian phone number';
  return '';
}