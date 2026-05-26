import assert from "node:assert/strict";
import test from "node:test";

import {
  buildWebSocketUrl,
  normalizeApiBaseUrl,
  resolveApiBaseUrl,
} from "./apiConfig.js";

test("uses localhost backend URL when no Vite API URL is configured", () => {
  assert.equal(resolveApiBaseUrl({}), "http://localhost:8081");
});

test("normalizes configured API base URLs by removing trailing slashes", () => {
  assert.equal(resolveApiBaseUrl({ VITE_API_BASE_URL: "https://api.example.com/" }), "https://api.example.com");
  assert.equal(normalizeApiBaseUrl("https://api.example.com///"), "https://api.example.com");
});

test("builds the websocket URL from the API base URL", () => {
  assert.equal(buildWebSocketUrl("https://api.example.com"), "https://api.example.com/ws");
});
