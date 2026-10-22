import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { toggleFavorite } from '../logic/favorites';
import { loadFavorites, saveFavorites } from '../storage/favoritesStorage';

type FavoritesValue = {
  favorites: string[];
  isFavorite: (artworkId: string) => boolean;
  toggle: (artworkId: string) => void;
};

const FavoritesContext = createContext<FavoritesValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    loadFavorites().then((ids) => {
      if (!active) return;
      setFavorites(ids);
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const toggle = useCallback(
    (artworkId: string) => {
      // Ignore taps until the saved list is loaded, so we never overwrite it.
      if (!loaded) return;
      const next = toggleFavorite(favorites, artworkId);
      setFavorites(next);
      saveFavorites(next);
    },
    [favorites, loaded]
  );

  const value = useMemo<FavoritesValue>(
    () => ({
      favorites,
      isFavorite: (artworkId) => favorites.includes(artworkId),
      toggle,
    }),
    [favorites, toggle]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesValue {
  const value = useContext(FavoritesContext);
  if (!value) {
    throw new Error('useFavorites must be used inside a FavoritesProvider');
  }
  return value;
}