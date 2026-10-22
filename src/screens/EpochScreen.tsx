import { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArtworkView } from '../components/ArtworkView';
import { movements } from '../data/catalog';
import { TimelineStackParamList } from '../navigation/types';
import { useProgress } from '../state/ProgressContext';
import { Movement } from '../types/movement';

type Props = NativeStackScreenProps<TimelineStackParamList, 'Epoch'>;

type ContentProps = {
  movement: Movement;
  onBack: () => void;
};

function EpochContent({ movement, onBack }: ContentProps) {
  const { pending, discoveredToday, discoverToday } = useProgress();
  const isPending = !discoveredToday && pending.movement.id === movement.id;

  // Freeze the artwork on first render: discovering it moves the progress
  // forward, and the screen must not switch to another artwork meanwhile.
  const [artwork] = useState(() =>
    isPending ? pending.artwork : movement.artworks[0]
  );

  useEffect(() => {
    if (isPending) discoverToday();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ArtworkView
      movementName={movement.name}
      artwork={artwork}
      onBack={onBack}
    />
  );
}

export function EpochScreen({ route, navigation }: Props) {
  const movement = movements.find((m) => m.id === route.params.movementId);
  if (!movement) return null;
  return (
    <EpochContent movement={movement} onBack={() => navigation.goBack()} />
  );
}