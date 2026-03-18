export const AUTH_STORAGE_KEYS = {
  accessToken: 'snapbook_access_token',
  refreshToken: 'snapbook_refresh_token',
} as const;

const rawApiBase =
  process.env.EXPO_PUBLIC_API_BASE_URL?.trim() ||
  process.env.EXPO_PUBLIC_API_URL?.trim() ||
  'http://localhost:8080';

// Accept env in both forms: .../auth or plain host.
const normalizedBase = rawApiBase.replace(/\/+$/, '');

export const API_BASE_URL = normalizedBase.endsWith('/auth')
  ? normalizedBase.slice(0, -'/auth'.length)
  : normalizedBase;

export const AUTH_ENDPOINTS = {
  register: '/auth/register',
  login: '/auth/login',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
  googleLogin: '/auth/google-login',
  logout: '/auth/logout',
} as const;
