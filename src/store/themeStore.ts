import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = '@tiempo_theme';

export type ThemeMode = 'light' | 'dark';

interface ThemeStore {
  theme: ThemeMode;
  listeners: Set<() => void>;
}

const store: ThemeStore = {
  theme: 'light',
  listeners: new Set(),
};

// Load theme from AsyncStorage on initialization
let isInitialized = false;

const initializeTheme = async () => {
  if (isInitialized) return;
  
  try {
    const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
    if (stored && (stored === 'light' || stored === 'dark')) {
      store.theme = stored as ThemeMode;
    }
    isInitialized = true;
  } catch (error) {
    console.error('Failed to load theme:', error);
  }
};

// Save theme to AsyncStorage
const saveTheme = async (theme: ThemeMode) => {
  try {
    await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.error('Failed to save theme:', error);
  }
};

// Notify all listeners of changes
const notifyListeners = () => {
  store.listeners.forEach((listener) => listener());
};

export const themeStore = {
  // Initialize the store (call this on app start)
  initialize: initializeTheme,

  // Get current theme
  getTheme: (): ThemeMode => {
    return store.theme;
  },

  // Set theme
  setTheme: async (theme: ThemeMode) => {
    store.theme = theme;
    await saveTheme(theme);
    notifyListeners();
  },

  // Toggle between light and dark
  toggleTheme: async () => {
    const newTheme = store.theme === 'light' ? 'dark' : 'light';
    await themeStore.setTheme(newTheme);
  },

  // Subscribe to changes
  subscribe: (listener: () => void) => {
    store.listeners.add(listener);
    return () => {
      store.listeners.delete(listener);
    };
  },

  // Check if dark mode
  isDark: (): boolean => {
    return store.theme === 'dark';
  },
};
