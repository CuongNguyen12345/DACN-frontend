const AUTH_TOKEN_KEY = "token";

const getDefaultStorage = () =>
  typeof window === "undefined" ? null : window.localStorage;

export const getAuthToken = (storage = getDefaultStorage()) =>
  storage?.getItem(AUTH_TOKEN_KEY) ?? null;

export const hasAuthToken = (storage = getDefaultStorage()) =>
  Boolean(getAuthToken(storage));

export const setAuthToken = (token, storage = getDefaultStorage()) => {
  if (storage && token) {
    storage.setItem(AUTH_TOKEN_KEY, token);
  }
};

export const removeAuthToken = (storage = getDefaultStorage()) => {
  storage?.removeItem(AUTH_TOKEN_KEY);
};
