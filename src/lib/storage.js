const PATIENT_SESSION_KEY = "hfs_patient_session";
const ADMIN_TOKEN_KEY = "hfs_admin_token";

function safeGet(storage, key) {
  if (typeof window === "undefined") return null;
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(storage, key, value) {
  if (typeof window === "undefined") return;
  try {
    if (value === null) storage.removeItem(key);
    else storage.setItem(key, value);
  } catch {
  }
}

export function getPatientSession() {
  const raw = safeGet(window.sessionStorage, PATIENT_SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setPatientSession(session) {
  safeSet(window.sessionStorage, PATIENT_SESSION_KEY, session ? JSON.stringify(session) : null);
}

export function getAdminToken() {
  return safeGet(window.localStorage, ADMIN_TOKEN_KEY);
}

export function setAdminToken(token) {
  safeSet(window.localStorage, ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  setAdminToken(null);
}
