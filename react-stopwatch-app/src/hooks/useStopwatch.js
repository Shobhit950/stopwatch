import { useCallback, useEffect, useRef, useState } from 'react';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { formatTime, getLapStats } from '../utils/formatTime';
import { readStorage, removeStorage, writeStorage } from '../utils/storage';

function loadPersistedSession() {
  return readStorage(STORAGE_KEYS.ACTIVE_SESSION, null);
}

export function useStopwatch({ persistSession = true } = {}) {
  const persisted = persistSession ? loadPersistedSession() : null;

  const [isRunning, setIsRunning] = useState(Boolean(persisted?.isRunning));
  const [elapsed, setElapsed] = useState(persisted?.elapsed ?? 0);
  const [laps, setLaps] = useState(persisted?.laps ?? []);

  const startTimeRef = useRef(null);
  const animationRef = useRef(null);
  const lapIdRef = useRef(persisted?.lapIdCounter ?? 0);
  const elapsedRef = useRef(persisted?.elapsed ?? 0);

  useEffect(() => {
    elapsedRef.current = elapsed;
  }, [elapsed]);

  useEffect(() => {
    if (persisted?.isRunning) {
      startTimeRef.current = Date.now() - (persisted.elapsed ?? 0);
    }
  }, []);

  useEffect(() => {
    const update = () => {
      if (isRunning) {
        const nextElapsed = Date.now() - startTimeRef.current;
        elapsedRef.current = nextElapsed;
        setElapsed(nextElapsed);
        animationRef.current = requestAnimationFrame(update);
      }
    };

    if (isRunning) {
      animationRef.current = requestAnimationFrame(update);
    }

    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning]);

  useEffect(() => {
    const syncElapsed = () => {
      if (document.visibilityState === 'visible' && isRunning) {
        const nextElapsed = Date.now() - startTimeRef.current;
        elapsedRef.current = nextElapsed;
        setElapsed(nextElapsed);
      }
    };

    document.addEventListener('visibilitychange', syncElapsed);
    window.addEventListener('focus', syncElapsed);

    return () => {
      document.removeEventListener('visibilitychange', syncElapsed);
      window.removeEventListener('focus', syncElapsed);
    };
  }, [isRunning]);

  useEffect(() => {
    if (!persistSession) {
      removeStorage(STORAGE_KEYS.ACTIVE_SESSION);
      return;
    }

    const persist = () => {
      writeStorage(STORAGE_KEYS.ACTIVE_SESSION, {
        elapsed: elapsedRef.current,
        laps,
        isRunning,
        lapIdCounter: lapIdRef.current,
        savedAt: new Date().toISOString(),
      });
    };

    persist();

    const intervalId = window.setInterval(persist, 2000);
    window.addEventListener('beforeunload', persist);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('beforeunload', persist);
      persist();
    };
  }, [persistSession, laps, isRunning]);

  const start = useCallback(() => {
    startTimeRef.current = Date.now() - elapsedRef.current;
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => setIsRunning(false), []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setElapsed(0);
    elapsedRef.current = 0;
    setLaps([]);
    lapIdRef.current = 0;

    if (persistSession) {
      writeStorage(STORAGE_KEYS.ACTIVE_SESSION, {
        elapsed: 0,
        laps: [],
        isRunning: false,
        lapIdCounter: 0,
        savedAt: new Date().toISOString(),
      });
    }
  }, [persistSession]);

  const clearLaps = useCallback(() => setLaps([]), []);

  const lap = useCallback(() => {
    if (!isRunning) return;

    setLaps((prev) => {
      const previousTotal = prev.length > 0 ? prev[0].totalMs : 0;
      const splitMs = elapsedRef.current - previousTotal;

      lapIdRef.current += 1;

      return [
        {
          id: lapIdRef.current,
          number: prev.length + 1,
          totalMs: elapsedRef.current,
          splitMs,
        },
        ...prev,
      ];
    });
  }, [isRunning]);

  const toggle = useCallback(() => {
    if (isRunning) {
      pause();
    } else {
      start();
    }
  }, [isRunning, pause, start]);

  const stats = getLapStats(laps);

  return {
    isRunning,
    elapsed,
    laps,
    stats,
    formattedTime: formatTime(elapsed),
    start,
    pause,
    reset,
    clearLaps,
    lap,
    toggle,
  };
}
