import { MAX_SESSION_HISTORY, STORAGE_KEYS } from '../constants/storageKeys';
import { readStorage, writeStorage } from './storage';

export function loadSessionHistory() {
  return readStorage(STORAGE_KEYS.SESSION_HISTORY, []);
}

export function saveSessionToHistory({ elapsed, laps }) {
  if (elapsed <= 0 && laps.length === 0) {
    return loadSessionHistory();
  }

  const history = loadSessionHistory();
  const entry = {
    id: crypto.randomUUID?.() ?? String(Date.now()),
    savedAt: new Date().toISOString(),
    totalMs: elapsed,
    lapCount: laps.length,
    laps: [...laps].reverse(),
  };

  const nextHistory = [entry, ...history].slice(0, MAX_SESSION_HISTORY);
  writeStorage(STORAGE_KEYS.SESSION_HISTORY, nextHistory);
  return nextHistory;
}

export function clearSessionHistory() {
  writeStorage(STORAGE_KEYS.SESSION_HISTORY, []);
  return [];
}
