import { useEffect } from 'react';

export function useKeyboardShortcuts({ onToggle, onLap, onReset, enabled = true }) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.code) {
        case 'Space':
          event.preventDefault();
          onToggle();
          break;
        case 'KeyL':
          onLap();
          break;
        case 'KeyR':
          onReset();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, onToggle, onLap, onReset]);
}
