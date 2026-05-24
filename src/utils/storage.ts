/**
 * Namespaced storage abstraction.
 *
 * All keys are automatically stored under the 'kda:' prefix to prevent
 * collisions with third-party code sharing the same localStorage origin.
 *
 * API:
 *   get(key, fallback)  — returns fallback on missing key or parse error
 *   set(key, value)     — throws DOMException(QuotaExceededError) when storage is full
 *   remove(key)         — deletes the namespaced key
 *   migrate()           — one-time copy of legacy un-prefixed keys; idempotent
 */

const PREFIX = 'kda:';
const VERSION_KEY = `${PREFIX}storage:version`;
const CURRENT_VERSION = '1';

/**
 * Read a value from storage.
 * Returns `fallback` when the key is absent or the stored JSON cannot be parsed.
 */
export function get<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(`${PREFIX}${key}`);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * Write a value to storage.
 * The value is JSON-serialised before storing.
 * Throws DOMException (QuotaExceededError) when storage quota is exceeded.
 */
export function set(key: string, value: unknown): void {
  localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
}

/**
 * Remove a key from storage.
 */
export function remove(key: string): void {
  localStorage.removeItem(`${PREFIX}${key}`);
}

/**
 * One-time migration from legacy (un-prefixed) keys to the kda: namespace.
 *
 * Scans all existing localStorage entries and copies any that do not already
 * start with 'kda:' to a new 'kda:'-prefixed key (without deleting the original,
 * to keep the migration non-destructive). Existing namespaced values are never
 * overwritten, so a partially-migrated store stays consistent.
 *
 * Safe to call on every app mount — the 'kda:storage:version' sentinel makes
 * subsequent calls no-ops.
 */
export function migrate(): void {
  if (localStorage.getItem(VERSION_KEY) === CURRENT_VERSION) return;

  // Snapshot keys before iterating (avoids mutation-during-iteration issues)
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k !== null) keys.push(k);
  }

  for (const k of keys) {
    // Already in the namespace — nothing to do
    if (k.startsWith(PREFIX)) continue;

    const value = localStorage.getItem(k);
    if (value === null) continue;

    const newKey = `${PREFIX}${k}`;
    // Namespaced copy takes precedence if already present
    if (localStorage.getItem(newKey) === null) {
      localStorage.setItem(newKey, value);
    }
  }

  localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
}
