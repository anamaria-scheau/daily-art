import AsyncStorage from '@react-native-async-storage/async-storage';
import { parseProgressState } from '../logic/progressParsing';
import { ProgressState } from '../types/progress';

const KEY = 'daily-art/progress/v1';

export async function loadProgress(): Promise<ProgressState> {
  const raw = await AsyncStorage.getItem(KEY);
  return parseProgressState(raw);
}

export async function saveProgress(state: ProgressState): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(state));
}