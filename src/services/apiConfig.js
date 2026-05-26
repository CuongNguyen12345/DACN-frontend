export const DEFAULT_API_BASE_URL = "http://localhost:8081";

export const normalizeApiBaseUrl = (value = DEFAULT_API_BASE_URL) => {
  const baseUrl = value || DEFAULT_API_BASE_URL;
  return String(baseUrl).replace(/\/+$/, "");
};

export const resolveApiBaseUrl = (env = import.meta.env ?? {}) =>
  normalizeApiBaseUrl(env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL);

export const API_BASE_URL = resolveApiBaseUrl();

export const buildWebSocketUrl = (apiBaseUrl = API_BASE_URL) =>
  `${normalizeApiBaseUrl(apiBaseUrl)}/ws`;

export const SOCKET_URL = buildWebSocketUrl(API_BASE_URL);
