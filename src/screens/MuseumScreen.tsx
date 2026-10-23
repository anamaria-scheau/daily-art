import { useMemo } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { findArtwork } from '../data/catalog';
import { images } from '../data/images';
import { toDateKey } from '../logic/progress';
import { buildMuseumRooms, formatMonthLabel } from '../logic/museum';
import { MuseumStackParamList } from '../navigation/types';
import { useProgress } from '../state/ProgressContext';
import { Artwork } from '../types/movement';

type Props = NativeStackScreenProps<MuseumStackParamList, 'Museum'>;

// While we build the museum we have no finished month yet, so this lets us
// open the current month's room. Set it to false before publishing the app.
const DEV_UNLOCK_CURRENT_MONTH = true;

export function MuseumScreen({ navigation }: Props) {
  const { state } = useProgress();
  const todayKey = toDateKey(new Date());
  const rooms = useMemo(
    () => buildMuseumRooms(state.viewHistory, todayKey),
    [state.viewHistory, todayKey]
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Museum</Text>

      {rooms.length === 0 && (
        <Text style={styles.empty}>
          Your first room opens when your first month is over. Keep discovering
          one artwork a day.
        </Text>
      )}

      {rooms.map((room) => {
        const artworks = room.artworkIds
          .map((id) => findArtwork(id)?.artwork)
          .filter((artwork): artwork is Artwork => Boolean(artwork));
        const open = room.complete || DEV_UNLOCK_CURRENT_MONTH;

        return (
          <Pressable
            key={room.monthKey}
            disabled={!open}
            onPress={() => navigation.navigate('Room', { monthKey: room.monthKey })}
            accessibilityRole="button"
            accessibilityLabel={`Open the room for ${formatMonthLabel(room.monthKey)}`}
            style={[styles.card, !open && styles.locked]}
          >
            <View style={styles.previews}>
              {artworks.slice(0, 4).map((artwork) => (
                <Image
                  key={artwork.id}
                  source={images[artwork.imageKey]}
                  style={styles.preview}
                  resizeMode="cover"
                />
              ))}
            </View>
            <Text style={styles.month}>{formatMonthLabel(room.monthKey)}</Text>
            <Text style={styles.meta}>
              {artworks.length} {artworks.length === 1 ? 'artwork' : 'artworks'}
              {room.complete ? '' : ' · opens when the month ends'}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 64,
    paddingBottom: 48,
    backgroundColor: '#FAF8F4',
    minHeight: '100%',
  },
  title: { fontSize: 28, fontWeight: '600', color: '#211D17', marginBottom: 16 },
  empty: { fontSize: 16, lineHeight: 24, color: '#6B6557' },
  card: {
    backgroundColor: '#F0ECE3',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  locked: { opacity: 0.55 },
  previews: { flexDirection: 'row', gap: 6, marginBottom: 12 },
  preview: { flex: 1, height: 70, borderRadius: 8 },
  month: { fontSize: 20, fontWeight: '600', color: '#211D17' },
  meta: { fontSize: 14, color: '#6B6557', marginTop: 2 },
});