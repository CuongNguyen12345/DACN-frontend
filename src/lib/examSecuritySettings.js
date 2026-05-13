export const EXAM_SECURITY_SETTINGS_KEY = "edu4all:exam-security-settings";

export const defaultExamSecuritySettings = {
  preventTabSwitch: true,
  preventCopy: true,
  showResultImmediately: false,
};

export const normalizeExamSecuritySettings = (settings = {}) => ({
  preventTabSwitch:
    typeof settings.preventTabSwitch === "boolean"
      ? settings.preventTabSwitch
      : defaultExamSecuritySettings.preventTabSwitch,
  preventCopy:
    typeof settings.preventCopy === "boolean"
      ? settings.preventCopy
      : defaultExamSecuritySettings.preventCopy,
  showResultImmediately:
    typeof settings.showResultImmediately === "boolean"
      ? settings.showResultImmediately
      : defaultExamSecuritySettings.showResultImmediately,
});

const getBrowserStorage = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage ?? null;
};

export const readLocalExamSecuritySettings = (storage = getBrowserStorage()) => {
  if (!storage) return defaultExamSecuritySettings;

  try {
    const value = storage.getItem(EXAM_SECURITY_SETTINGS_KEY);
    if (!value) return defaultExamSecuritySettings;
    return normalizeExamSecuritySettings(JSON.parse(value));
  } catch {
    return defaultExamSecuritySettings;
  }
};

export const writeLocalExamSecuritySettings = (
  settings,
  storage = getBrowserStorage(),
) => {
  const normalizedSettings = normalizeExamSecuritySettings(settings);
  storage?.setItem(EXAM_SECURITY_SETTINGS_KEY, JSON.stringify(normalizedSettings));
  return normalizedSettings;
};

export const loadExamSecuritySettings = async (apiClient, storage = getBrowserStorage()) => {
  try {
    const response = await apiClient.get("/api/settings/exam-security");
    return writeLocalExamSecuritySettings(response.data, storage);
  } catch {
    return readLocalExamSecuritySettings(storage);
  }
};

export const saveExamSecuritySettings = async (
  apiClient,
  settings,
  storage = getBrowserStorage(),
) => {
  const normalizedSettings = normalizeExamSecuritySettings(settings);
  const response = await apiClient.put("/api/admin/settings/exam-security", normalizedSettings);
  return writeLocalExamSecuritySettings(response.data, storage);
};

export const shouldRevealExamResult = (settings) =>
  normalizeExamSecuritySettings(settings).showResultImmediately;

export const shouldBlockExamShortcut = (settings, event) => {
  if (!normalizeExamSecuritySettings(settings).preventCopy) return false;

  const key = event?.key?.toLowerCase();
  return Boolean((event?.ctrlKey || event?.metaKey) && ["c", "v", "x"].includes(key));
};
