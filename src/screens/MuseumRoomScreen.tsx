import { useMemo } from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
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
import { groupBySource } from '../logic/museumSources';
import { MuseumStackParamList } from '../navigation/types';
import { useProgress } from '../state/ProgressContext';
import { Artwork } from '../types/movement';

type Props = NativeStackScreenProps<MuseumStackParamList, 'Room'>;

const HEADER_HEIGHT = 130;

export function MuseumRoomScreen({ route, navigation }: Props) {
  const { state } = useProgress();
  const { width, height } = useWindowDimensions();
  const { monthKey } = route.params;

  const room = useMemo(
    () =>
      buildMuseumRooms(state.viewHistory, toDateKey(new Date())).find(
        (candidate) => candidate.monthKey === monthKey
      ),
    [state.viewHistory, monthKey]
  );

  const found = useMemo(
    () =>
      (room?.artworkIds ?? [])
        .map((id) => findArtwork(id))
        .filter((item): item is NonNullable<typeof item> => Boolean(item)),
    [room]
  );

  const artworks: Artwork[] = useMemo(() => found.map((item) => item.artwork), [found]);
  const walls = useMemo(() => splitIntoWalls(artworks), [artworks]);
  const sources = useMemo(
    () =>
      groupBySource(
        artworks.map((artwork) => ({
          title: artwork.title,
          location: artwork.details.location,
        }))
      ),
    [artworks]
  );

  if (!room) return null;

  const stageHeight = Math.max(480, height * 0.78);
  const roomHeight = stageHeight - HEADER_HEIGHT;
  const sideWidth = width * 0.28;
  const backWidth = width * 0.44;
  const sideHeight = roomHeight * 0.82;
  const backHeight = roomHeight * 0.58;
  const open = (artworkId: string) => navigation.navigate('Artwork', { artworkId });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.stage, { height: stageHeight }]}>
        <View style={styles.floor} />

        <View style={styles.header}>
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
        </View>

        <View style={[styles.row, { height: roomHeight }]}>
          <MuseumWall
            artworks={walls.left}
            width={sideWidth}
            height={sideHeight}
            tilt="left"
            onOpen={open}
          />
          <MuseumWall
            artworks={walls.back}
            width={backWidth}
            height={backHeight}
            tilt="none"
            onOpen={open}
          />
          <MuseumWall
            artworks={walls.right}
            width={sideWidth}
            height={sideHeight}
            tilt="right"
            onOpen={open}
          />
        </View>
      </View>

      <View style={styles.sources}>
        <Text style={styles.sourcesTitle}>Where these artworks live</Text>
        {sources.map((source) => (
          <View key={source.key} style={styles.sourceCard}>
            <Text style={styles.sourceName}>{source.name}</Text>
            <Text style={styles.sourceWorks}>{source.artworkTitles.join(' · ')}</Text>
            {source.url && (
              <Pressable
                onPress={() => {
                  Linking.openURL(source.url as string).catch(() => undefined);
                }}
                accessibilityRole="link"
                accessibilityLabel={`Open the website of ${source.name}`}
                style={styles.visit}
              >
                <Text style={styles.visitText}>Visit website ›</Text>
              </Pressable>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#f5e8d9', paddingBottom: 48 },
  stage: { backgroundColor: '#EFE3D2' },
  floor: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '12%',
    backgroundColor: '#D9C7AE',
  },
  header: { height: HEADER_HEIGHT, paddingTop: 56, paddingHorizontal: 24 },
  back: { alignSelf: 'flex-start', paddingVertical: 4 },
  backText: { fontSize: 18, color: '#7A5C14' },
  title: { fontSize: 30, fontWeight: '600', color: '#211D17', marginTop: 4 },
  count: { fontSize: 16, color: '#6B6557' },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sources: { padding: 24 },
  sourcesTitle: { fontSize: 20, fontWeight: '600', color: '#211D17', marginBottom: 12 },
  sourceCard: {
    backgroundColor: '#FAF8F4',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  sourceName: { fontSize: 18, fontWeight: '600', color: '#211D17' },
  sourceWorks: { fontSize: 14, lineHeight: 20, color: '#6B6557', marginTop: 4 },
  visit: { alignSelf: 'flex-start', marginTop: 10, paddingVertical: 4 },
  visitText: { fontSize: 16, fontWeight: '600', color: '#7A5C14' },
});