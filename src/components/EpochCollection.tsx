import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { images } from '../data/images';
import { Artwork, Movement } from '../types/movement';

type Props = {
  movement: Movement;
  discovered: Artwork[];
  onBack: () => void;
  onOpenArtwork: (artworkId: string) => void;
};

export function EpochCollection({
  movement,
  discovered,
  onBack,
  onOpenArtwork,
}: Props) {
  const total = movement.artworks.length;
  const locked = Math.max(total - discovered.length, 0);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={styles.back}
      >
        <Text style={styles.backText}>‹ Back</Text>
      </Pressable>

      <Text style={styles.title}>{movement.name}</Text>
      <Text style={styles.years}>{movement.yearRange}</Text>
      <Text style={styles.count}>
        {discovered.length} of {total} discovered
      </Text>

      {discovered.length === 0 && (
        <Text style={styles.empty}>
          Nothing discovered in this epoch yet. Your journey will reach it
          soon.
        </Text>
      )}

      <View style={styles.grid}>
        {discovered.map((artwork) => (
          <View key={artwork.id} style={styles.cell}>
            <Pressable
              onPress={() => onOpenArtwork(artwork.id)}
              accessibilityRole="button"
              accessibilityLabel={`Open ${artwork.title}`}
              style={styles.card}
            >
              <Image
                source={images[artwork.imageKey]}
                style={styles.image}
                resizeMode="cover"
              />
            </Pressable>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {artwork.title}
            </Text>
            <Text style={styles.cardArtist} numberOfLines={1}>
              {artwork.artist}
            </Text>
          </View>
        ))}

        {Array.from({ length: locked }).map((_, index) => (
          <View key={`locked-${index}`} style={styles.cell}>
            <View style={[styles.card, styles.lockedCard]}>
              <Text style={styles.lockedMark}>?</Text>
            </View>
            <Text style={styles.cardTitle}>Not discovered yet</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 64,
    paddingBottom: 48,
    backgroundColor: '#f5e8d9',
    minHeight: '100%',
  },
  back: { alignSelf: 'flex-start', paddingVertical: 8, marginBottom: 8 },
  backText: { fontSize: 18, color: '#7A5C14' },
  title: { fontSize: 30, fontWeight: '600', color: '#211D17' },
  years: { fontSize: 16, color: '#6B6557', marginTop: 4 },
  count: { fontSize: 16, color: '#7A5C14', marginTop: 12, marginBottom: 20 },
  empty: { fontSize: 16, lineHeight: 24, color: '#6B6557', marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -8 },
  cell: { width: '50%', padding: 8 },
  card: {
    aspectRatio: 0.8,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#EFEAE0',
  },
  image: { width: '100%', height: '100%' },
  lockedCard: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#C9A24B',
    backgroundColor: 'transparent',
  },
  lockedMark: { fontSize: 40, color: '#C9A24B' },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#211D17', marginTop: 8 },
  cardArtist: { fontSize: 13, color: '#6B6557', marginTop: 2 },
});