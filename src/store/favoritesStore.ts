import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_STORAGE_KEY = '@tiempo_favorites';

interface FavoritesStore {
  favorites: Set<string>;
  listeners: Set<() => void>;
}

const store: FavoritesStore = {
  favorites: new Set<string>(),
  listeners: new Set(),
};

// Load favorites from AsyncStorage on initialization
let isInitialized = false;

const initializeFavorites = async () => {
  if (isInitialized) return;
  
  try {
    const stored = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
    if (stored) {
      const favoriteArray = JSON.parse(stored) as string[];
      store.favorites = new Set(favoriteArray);
    }
    isInitialized = true;
  } catch (error) {
    console.error('Failed to load favorites:', error);
  }
};

// Save favorites to AsyncStorage
const saveFavorites = async () => {
  try {
    const favoriteArray = Array.from(store.favorites);
    await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteArray));
  } catch (error) {
    console.error('Failed to save favorites:', error);
  }
};

// Notify all listeners of changes
const notifyListeners = () => {
  store.listeners.forEach((listener) => listener());
};

export const favoritesStore = {
  // Initialize the store (call this on app start)
  initialize: initializeFavorites,

  // Get all favorite infinitives
  getFavorites: (): string[] => {
    return Array.from(store.favorites);
  },

  // Check if a verb is favorited
  isFavorite: (infinitive: string): boolean => {
    return store.favorites.has(infinitive);
  },

  // Add a verb to favorites
  addFavorite: async (infinitive: string) => {
    store.favorites.add(infinitive);
    await saveFavorites();
    notifyListeners();
  },

  // Remove a verb from favorites
  removeFavorite: async (infinitive: string) => {
    store.favorites.delete(infinitive);
    await saveFavorites();
    notifyListeners();
  },

  // Toggle favorite status
  toggleFavorite: async (infinitive: string) => {
    if (store.favorites.has(infinitive)) {
      await favoritesStore.removeFavorite(infinitive);
    } else {
      await favoritesStore.addFavorite(infinitive);
    }
  },

  // Subscribe to changes
  subscribe: (listener: () => void) => {
    store.listeners.add(listener);
    return () => {
      store.listeners.delete(listener);
    };
  },

  // Get count of favorites
  getCount: (): number => {
    return store.favorites.size;
  },
};
