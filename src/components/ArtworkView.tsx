import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { images } from '../data/images';
import { useFavorites } from '../state/FavoritesContext';
import { Artwork } from '../types/movement';
import { Accordion } from './Accordion';
import { ZoomableImage } from './ZoomableImage';

function Paragraphs({ items }: { items: string[] }) {
  return (
    <>
      {items.map((text) => (
        <Text key={text} style={styles.body}>
          {text}
        </Text>
      ))}
    </>
  );
}

type Props = {
  movementName: string;
  artwork: Artwork;
  onBack: () => void;
};

export function ArtworkView({ movementName, artwork, onBack }: Props) {
  const { isFavorite, toggle } = useFavorites();
  const favorite = isFavorite(artwork.id);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topRow}>
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.back}
        >
          <Text style={styles.backText}>‹ Back</Text>
        </Pressable>

        <Pressable
          onPress={() => toggle(artwork.id)}
          accessibilityRole="button"
          accessibilityLabel={
            favorite ? 'Remove from favorites' : 'Add to favorites'
          }
          accessibilityState={{ selected: favorite }}
          hitSlop={12}
          style={styles.heart}
        >
          <Ionicons
            name={favorite ? 'heart' : 'heart-outline'}
            size={28}
            color={favorite ? '#B3412F' : '#7A5C14'}
          />
        </Pressable>
      </View>

      <Text style={styles.movement}>{movementName}</Text>
      <ZoomableImage source={images[artwork.imageKey]} />
      <Text style={styles.title}>{artwork.title}</Text>
      <Text style={styles.artist}>
        {artwork.artist}, {artwork.year}
      </Text>
      <Text style={styles.body}>{artwork.description}</Text>

      <View style={styles.sections}>
        <Accordion title="The Gossip" defaultOpen>
          <Paragraphs items={artwork.story} />
        </Accordion>

        <Accordion title="Look closer">
          {artwork.lookCloser.map((tip) => (
            <Text key={tip} style={styles.body}>
              • {tip}
            </Text>
          ))}
        </Accordion>

        <Accordion title="History & Context">
          <Paragraphs items={artwork.context} />
        </Accordion>

        <Accordion title="About the artist">
          <Text style={styles.subtitle}>{artwork.artist}</Text>
          <Text style={styles.body}>{artwork.artistBio}</Text>
          <Text style={styles.subtitle}>When this was painted</Text>
          <Text style={styles.body}>{artwork.artistAtTheTime}</Text>
        </Accordion>

        <Accordion title="The Details">
          <Text style={styles.body}>{artwork.details.medium}</Text>
          <Text style={styles.body}>{artwork.details.dimensions}</Text>
          <Text style={styles.body}>{artwork.details.location}</Text>
        </Accordion>
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
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  back: { paddingVertical: 8 },
  backText: { fontSize: 18, color: '#7A5C14' },
  heart: { padding: 4 },
  movement: { fontSize: 16, color: '#7A5C14', marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '600', marginBottom: 4 },
  artist: { fontSize: 16, color: '#6B6557', marginBottom: 16 },
  body: { fontSize: 16, lineHeight: 24, marginBottom: 12 },
  subtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7A5C14',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  sections: { marginTop: 16 },
});