import { useMemo } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MuseumWall } from '../components/MuseumWall';
import { findArtwork } from '../data/catalog';
import { toDateKey } from '../logic/progress';
import { buildMuseumRooms, formatMonthLabel, splitIntoWalls } from '../logic/museum';
import { MuseumStackParamList } from '../navigation/types';
import { useProgress } from '../state/ProgressContext';
import { Artwork } from '../types/movement';

type Props = NativeStackScreenProps<MuseumStackParamList, 'Room'>;

const BACK_HEIGHT = 250;
const SIDE_HEIGHT = 330;

export function MuseumRoomScreen({ route, navigation }: Props) {
  const { state } = useProgress();
  const { width } = useWindowDimensions();
  const { monthKey } = route.params;

  const room = useMemo(
    () =>
      buildMuseumRooms(state.viewHistory, toDateKey(new Date())).find(
        (candidate) => candidate.monthKey === monthKey
      ),
    [state.viewHistory, monthKey]
  );

  const artworks = useMemo(
    () =>
      (room?.artworkIds ?? [])
        .map((id) => findArtwork(id)?.artwork)
        .filter((artwork): artwork is Artwork => Boolean(artwork)),
    [room]
  );

  const walls = useMemo(() => splitIntoWalls(artworks), [artworks]);

  if (!room) return null;

  const sideWidth = width * 0.27;
  const backWidth = width * 0.42;
  const open = (artworkId: string) => navigation.navigate('Artwork', { artworkId });

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => navigation.goBack()}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={styles.back}
      >
        <Text style={styles.backText}>‹ Back</Text>
      </Pressable>

      <Text style={styles.title}>{formatMonthLabel(monthKey)}</Text>
      <Text style={styles.count}>
        {artworks.length} {artworks.length === 1 ? 'artwork' : 'artworks'}
      </Text>

      <View style={styles.stage}>
        <View style={styles.floor} />
        <View style={styles.row}>
          <MuseumWall
            artworks={walls.left}
            width={sideWidth}
            height={SIDE_HEIGHT}
            tilt="left"
            onOpen={open}
          />
          <MuseumWall
            artworks={walls.back}
            width={backWidth}
            height={BACK_HEIGHT}
            tilt="none"
            onOpen={open}
          />
          <MuseumWall
            artworks={walls.right}
            width={sideWidth}
            height={SIDE_HEIGHT}
            tilt="right"
            onOpen={open}
          />
        </View>
      </View>

      <Text style={styles.hint}>Tap any painting to look closer.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5e8d9',
    paddingTop: 64,
  },
  back: { alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 24 },
  backText: { fontSize: 18, color: '#7A5C14' },
  title: {
    fontSize: 30,
    fontWeight: '600',
    color: '#211D17',
    paddingHorizontal: 24,
    marginTop: 8,
  },
  count: {
    fontSize: 16,
    color: '#6B6557',
    paddingHorizontal: 24,
    marginTop: 4,
    marginBottom: 24,
  },
  stage: {
    height: SIDE_HEIGHT + 60,
    justifyContent: 'center',
    backgroundColor: '#EFE3D2',
  },
  floor: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 50,
    backgroundColor: '#D9C7AE',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hint: {
    fontSize: 14,
    color: '#6B6557',
    textAlign: 'center',
    marginTop: 24,
  },
});