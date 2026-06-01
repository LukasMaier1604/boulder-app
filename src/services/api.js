import { Platform } from 'react-native';

const DEFAULT_API_URL = Platform.select({
  android: 'http://10.0.2.2:3000',
  default: 'http://localhost:3000',
});

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') ?? DEFAULT_API_URL;

async function request(path, { token, method = 'GET', body } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (response.status === 204) {
    return null;
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || payload.error || 'Backend request failed');
  }

  return payload;
}

export const api = {
  register: (name, email, password) =>
    request('/auth/register', {
      method: 'POST',
      body: { name, email, password },
    }),
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: { email, password },
    }),
  me: (token) => request('/auth/me', { token }),
  routes: (token) => request('/routes', { token }),
  leaderboard: (token) => request('/users/leaderboard', { token }),
  stats: (token) => request('/users/me/stats', { token }),
  climbed: (token) => request('/users/me/climbed', { token }),
  updateProfile: (token, body) =>
    request('/users/me', {
      token,
      method: 'PATCH',
      body,
    }),
  incrementAttempt: (token, routeId) =>
    request('/users/me/attempts', {
      token,
      method: 'POST',
      body: { routeId },
    }),
  resetAttempts: (token, routeId) =>
    request('/users/me/attempts', {
      token,
      method: 'DELETE',
      body: { routeId },
    }),
  completeRoute: (token, routeId) =>
    request('/users/me/top', {
      token,
      method: 'POST',
      body: { routeId },
    }),
  startSession: (token) =>
    request('/users/me/sessions', {
      token,
      method: 'POST',
    }),
  stopSession: (token) =>
    request('/users/me/sessions/active', {
      token,
      method: 'PATCH',
    }),
};
