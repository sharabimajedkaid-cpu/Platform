function normalizeBase(value: string | undefined, fallback: string) {
  const normalized = (value || fallback).trim();
  if (!normalized) return fallback;
  return normalized.replace(/\/$/, '');
}

export function getApiBaseUrl(path = '') {
  const base = normalizeBase(import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL, '/api');
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${base}${suffix}`;
}

export function getApiV1BaseUrl(path = '') {
  const base = getApiBaseUrl();
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${base}/v1${suffix}`;
}

export function getSignalBaseUrl() {
  return normalizeBase(import.meta.env.VITE_SIGNALING_URL || import.meta.env.VITE_API_URL || 'http://localhost:3002', 'http://localhost:3002');
}
