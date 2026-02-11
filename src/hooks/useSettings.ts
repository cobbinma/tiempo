import { useState, useEffect } from 'react';
import { settingsStore, AppSettings } from '../store/settingsStore';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(
    settingsStore.getSettings()
  );

  useEffect(() => {
    const unsubscribe = settingsStore.subscribe((newSettings) => {
      setSettings(newSettings);
    });

    return unsubscribe;
  }, []);

  return {
    settings,
    updateSetting: settingsStore.updateSetting,
    setSettings: settingsStore.setSettings,
    resetSettings: settingsStore.reset,
  };
}
