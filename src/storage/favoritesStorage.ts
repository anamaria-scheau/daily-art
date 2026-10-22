import AsyncStorage from '@react-native-async-storage/async-storage';
import { parseFavorites } from '../logic/favorites';

const KEY = 'daily-art/favorites/v1';

export async function loadFavorites(): Promise<string[]> {
  try {
    return parseFavorites(await AsyncStorage.getItem(KEY));
  } catch {
    return [];
  }
}

export async function saveFavorites(ids: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    // Saving is best effort: the app keeps working with the in-memory list.
  }
}