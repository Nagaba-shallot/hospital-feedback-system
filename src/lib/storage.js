// Small wrappers around browser storage. Split by purpose so the two token
// types can't accidentally get mixed up.
//
// - Patient session tokens live in sessionStorage: they're meant to die with
//   the tab, since a survey session is a one-time, anonymous thing.
// - Admin JWTs live in localStorage so an admin isn't logged out on every
//   refresh. They're short-lived (30 min by default, set server-side), which
//   bounds how long a stolen token is useful.

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
    // storage unavailable (private browsing, etc.) — fail silently
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
