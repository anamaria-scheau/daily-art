import { ArtworkView } from '../components/ArtworkView';
import { findArtwork } from '../data/catalog';

type Props = {
  route: { params: { artworkId: string } };
  navigation: { goBack: () => void };
};

export function ArtworkScreen({ route, navigation }: Props) {
  const found = findArtwork(route.params.artworkId);
  if (!found) return null;
  return (
    <ArtworkView
      movementName={found.movement.name}
      artwork={found.artwork}
      onBack={() => navigation.goBack()}
    />
  );
}