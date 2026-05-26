import assert from "node:assert/strict";
import test from "node:test";

import {
  getAuthToken,
  hasAuthToken,
  removeAuthToken,
  setAuthToken,
} from "./authToken.js";

const createStorage = () => {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    removeItem: (key) => values.delete(key),
    setItem: (key, value) => values.set(key, String(value)),
  };
};

test("reads and writes the shared auth token key", () => {
  const storage = createStorage();

  setAuthToken("abc", storage);

  assert.equal(getAuthToken(storage), "abc");
  assert.equal(hasAuthToken(storage), true);
});

test("removes the shared auth token", () => {
  const storage = createStorage();
  setAuthToken("abc", storage);

  removeAuthToken(storage);

  assert.equal(getAuthToken(storage), null);
  assert.equal(hasAuthToken(storage), false);
});
