import { useEffect, useRef } from 'react';

export function useWakeLock(enabled, isActive) {
  const wakeLockRef = useRef(null);

  useEffect(() => {
    const releaseWakeLock = async () => {
      if (wakeLockRef.current) {
        await wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }
    };

    const requestWakeLock = async () => {
      if (!enabled || !isActive || !('wakeLock' in navigator)) {
        await releaseWakeLock();
        return;
      }

      try {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
        wakeLockRef.current.addEventListener('release', () => {
          wakeLockRef.current = null;
        });
      } catch {
        wakeLockRef.current = null;
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };

    requestWakeLock();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      releaseWakeLock();
    };
  }, [enabled, isActive]);
}
