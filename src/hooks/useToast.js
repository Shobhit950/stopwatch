import { useCallback, useRef, useState } from 'react';

export function useToast(durationMs = 2800) {
  const [toast, setToast] = useState(null);
  const timeoutRef = useRef(null);

  const hideToast = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setToast(null);
  }, []);

  const showToast = useCallback(
    (message, type = 'info') => {
      hideToast();
      setToast({ message, type });
      timeoutRef.current = window.setTimeout(hideToast, durationMs);
    },
    [durationMs, hideToast],
  );

  return { toast, showToast, hideToast };
}
