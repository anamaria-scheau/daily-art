import { useEffect, useMemo, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArtworkView } from '../components/ArtworkView';
import { EpochCollection } from '../components/EpochCollection';
import { movements } from '../data/catalog';
import { getDiscoveredArtworkIds } from '../logic/collection';
import { TimelineStackParamList } from '../navigation/types';
import { useProgress } from '../state/ProgressContext';
import { Movement } from '../types/movement';

type Props = NativeStackScreenProps<TimelineStackParamList, 'Epoch'>;

type BodyProps = {
  movement: Movement;
  onBack: () => void;
  onOpenArtwork: (artworkId: string) => void;
};

function EpochBody({ movement, onBack, onOpenArtwork }: BodyProps) {
  const { state, pending, discoveredToday, discoverToday } = useProgress();

  // Decided once, on the first render. Discovering today's artwork moves the
  // progress forward, and the screen must not flip to the collection while
  // the person is still looking at the artwork.
  const [mode] = useState<'discover' | 'collection'>(() =>
    !discoveredToday && pending.movement.id === movement.id
      ? 'discover'
      : 'collection'
  );
  const [todaysArtwork] = useState(() => pending.artwork);

  useEffect(() => {
    if (mode === 'discover') discoverToday();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const discovered = useMemo(() => {
    const ids = getDiscoveredArtworkIds(state.viewHistory, movement.id);
    return ids
      .map((id) => movement.artworks.find((artwork) => artwork.id === id))
      .filter((artwork): artwork is NonNullable<typeof artwork> =>
        Boolean(artwork)
      );
  }, [state.viewHistory, movement]);

  if (mode === 'discover') {
    return (
      <ArtworkView
        movementName={movement.name}
        artwork={todaysArtwork}
        onBack={onBack}
      />
    );
  }

  return (
    <EpochCollection
      movement={movement}
      discovered={discovered}
      onBack={onBack}
      onOpenArtwork={onOpenArtwork}
    />
  );
}

export function EpochScreen({ route, navigation }: Props) {
  const movement = movements.find((m) => m.id === route.params.movementId);
  if (!movement) return null;
  return (
    <EpochBody
      movement={movement}
      onBack={() => navigation.goBack()}
      onOpenArtwork={(artworkId) => navigation.navigate('Artwork', { artworkId })}
    />
  );
}