import { useState, useEffect } from 'react';
import { favoritesStore } from '../store/favoritesStore';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    // Initialize on first use
    favoritesStore.initialize().then(() => {
      setFavorites(favoritesStore.getFavorites());
    });

    // Subscribe to changes
    const unsubscribe = favoritesStore.subscribe(() => {
      setFavorites(favoritesStore.getFavorites());
    });

    return unsubscribe;
  }, []);

  return {
    favorites,
    isFavorite: (infinitive: string) => favoritesStore.isFavorite(infinitive),
    addFavorite: favoritesStore.addFavorite,
    removeFavorite: favoritesStore.removeFavorite,
    toggleFavorite: favoritesStore.toggleFavorite,
    count: favorites.length,
  };
}
