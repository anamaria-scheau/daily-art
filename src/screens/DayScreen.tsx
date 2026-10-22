import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArtworkView } from '../components/ArtworkView';
import { findArtwork } from '../data/catalog';
import { CalendarStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<CalendarStackParamList, 'Day'>;

export function DayScreen({ route, navigation }: Props) {
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