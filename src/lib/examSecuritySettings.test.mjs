import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  EXAM_SECURITY_SETTINGS_KEY,
  loadExamSecuritySettings,
  normalizeExamSecuritySettings,
  saveExamSecuritySettings,
  shouldBlockExamShortcut,
  shouldRevealExamResult,
} from "./examSecuritySettings.js";

const createMemoryStorage = () => {
  const values = new Map();

  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
  };
};

test("normalizes exam security settings without requireLogin", () => {
  const settings = normalizeExamSecuritySettings({
    requireLogin: true,
    preventTabSwitch: false,
    preventCopy: true,
    showResultImmediately: true,
  });

  assert.deepEqual(settings, {
    preventTabSwitch: false,
    preventCopy: true,
    showResultImmediately: true,
  });
  assert.equal("requireLogin" in settings, false);
});

test("defaults result reveal to hidden until admin enables it", () => {
  assert.equal(shouldRevealExamResult({ showResultImmediately: false }), false);
  assert.equal(shouldRevealExamResult({ showResultImmediately: true }), true);
  assert.equal(shouldRevealExamResult({}), false);
});

test("blocks copy paste shortcuts only when copy protection is enabled", () => {
  assert.equal(
    shouldBlockExamShortcut({ preventCopy: true }, { ctrlKey: true, key: "c" }),
    true,
  );
  assert.equal(
    shouldBlockExamShortcut({ preventCopy: true }, { metaKey: true, key: "V" }),
    true,
  );
  assert.equal(
    shouldBlockExamShortcut({ preventCopy: false }, { ctrlKey: true, key: "x" }),
    false,
  );
  assert.equal(
    shouldBlockExamShortcut({ preventCopy: true }, { ctrlKey: true, key: "a" }),
    false,
  );
});

test("loads exam security settings from the public endpoint and caches them", async () => {
  const storage = createMemoryStorage();
  const apiClient = {
    async get(path) {
      assert.equal(path, "/api/settings/exam-security");
      return {
        data: {
          preventTabSwitch: false,
          preventCopy: false,
          showResultImmediately: true,
        },
      };
    },
  };

  const settings = await loadExamSecuritySettings(apiClient, storage);

  assert.deepEqual(settings, {
    preventTabSwitch: false,
    preventCopy: false,
    showResultImmediately: true,
  });
  assert.deepEqual(JSON.parse(storage.getItem(EXAM_SECURITY_SETTINGS_KEY)), settings);
});

test("saves admin exam security settings without requireLogin", async () => {
  const storage = createMemoryStorage();
  let sentPayload;
  const apiClient = {
    async put(path, payload) {
      assert.equal(path, "/api/admin/settings/exam-security");
      sentPayload = payload;
      return { data: payload };
    },
  };

  const settings = await saveExamSecuritySettings(
    apiClient,
    {
      requireLogin: true,
      preventTabSwitch: true,
      preventCopy: false,
      showResultImmediately: true,
    },
    storage,
  );

  assert.deepEqual(sentPayload, {
    preventTabSwitch: true,
    preventCopy: false,
    showResultImmediately: true,
  });
  assert.deepEqual(settings, sentPayload);
});

test("admin settings screen does not render the required login option", () => {
  const source = readFileSync(new URL("../pages/admin/Settings/Settings.jsx", import.meta.url), "utf8");

  assert.equal(source.includes("requireLogin"), false);
  assert.equal(source.includes("Bắt buộc đăng nhập"), false);
});
