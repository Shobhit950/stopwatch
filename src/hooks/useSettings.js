import { useCallback, useState } from 'react';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { readStorage, writeStorage } from '../utils/storage';

const DEFAULT_SETTINGS = {
  confirmReset: true,
  keepScreenAwake: true,
  persistSession: true,
};

export function useSettings() {
  const [settings, setSettings] = useState(() =>
    readStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS),
  );

  const updateSetting = useCallback((key, value) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      writeStorage(STORAGE_KEYS.SETTINGS, next);
      return next;
    });
  }, []);

  return { settings, updateSetting };
}
