import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import movementsData from '../data/movements.json';
import {
  Pick,
  getPendingPick,
  hasViewedOn,
  recordView,
  toDateKey,
} from '../logic/progress';
import { EMPTY_PROGRESS } from '../logic/progressParsing';
import { loadProgress, saveProgress } from '../storage/progressStorage';
import { Movement } from '../types/movement';
import { ProgressState } from '../types/progress';

const movements = movementsData as Movement[];

type ProgressContextValue = {
  state: ProgressState;
  loaded: boolean;
  discoveredToday: boolean;
  pending: Pick;
  discoverToday: () => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(EMPTY_PROGRESS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadProgress().then((saved) => {
      setState(saved);
      setLoaded(true);
    });
  }, []);

  const discoverToday = useCallback(() => {
    const next = recordView(movements, state, toDateKey(new Date()));
    if (next === state) return;
    setState(next);
    saveProgress(next);
  }, [state]);

  const value: ProgressContextValue = {
    state,
    loaded,
    discoveredToday: hasViewedOn(state, toDateKey(new Date())),
    pending: getPendingPick(movements, state),
    discoverToday,
  };

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used inside a ProgressProvider');
  }
  return context;
}