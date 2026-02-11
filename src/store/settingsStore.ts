// Simple module-level state management for app settings
// Using the same pattern as quizStore to avoid React Navigation issues

export interface AppSettings {
  useVosotros: boolean; // true = European Spanish (with vosotros), false = Latin American
}

const defaultSettings: AppSettings = {
  useVosotros: true, // Default to including vosotros (European Spanish)
};

let currentSettings: AppSettings = { ...defaultSettings };
const listeners: Array<(settings: AppSettings) => void> = [];

export const settingsStore = {
  getSettings: (): AppSettings => {
    return { ...currentSettings };
  },

  setSettings: (settings: AppSettings): void => {
    currentSettings = { ...settings };
    listeners.forEach((listener) => listener(currentSettings));
  },

  updateSetting: <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ): void => {
    currentSettings = {
      ...currentSettings,
      [key]: value,
    };
    listeners.forEach((listener) => listener(currentSettings));
  },

  subscribe: (listener: (settings: AppSettings) => void): (() => void) => {
    listeners.push(listener);
    // Return unsubscribe function
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  },

  reset: (): void => {
    currentSettings = { ...defaultSettings };
    listeners.forEach((listener) => listener(currentSettings));
  },
};
