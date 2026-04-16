const STORAGE_KEY = "ciam_health_tool_session";

/**
 * @typedef {Object} CiamSession
 * @property {number} version
 * @property {string} email
 * @property {string} [role]
 * @property {string} [platform]
 * @property {Record<number, number>} ans
 * @property {boolean} [unlocked]
 * @property {string} [unlockedAt]
 */

export function saveCiamSession(data) {
  try {
    const payload = { version: 1, ...data };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* ignore quota / private mode */
  }
}

/** @returns {CiamSession | null} */
export function loadCiamSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearCiamSession() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
