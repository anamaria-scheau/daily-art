import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Accordion } from '../components/Accordion';
import { ZoomableImage } from '../components/ZoomableImage';
import movementsData from '../data/movements.json';
import { images } from '../data/images';
import { TimelineStackParamList } from '../navigation/types';
import { useProgress } from '../state/ProgressContext';
import { Movement } from '../types/movement';

const movements = movementsData as Movement[];

type Props = NativeStackScreenProps<TimelineStackParamList, 'Epoch'>;

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
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Back to timeline"
        style={styles.back}
      >
        <Text style={styles.backText}>‹ Back</Text>
      </Pressable>

      <Text style={styles.movement}>{movement.name}</Text>
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

export function EpochScreen({ route, navigation }: Props) {
  const movement = movements.find((m) => m.id === route.params.movementId);
  if (!movement) return null;
  return (
    <EpochContent movement={movement} onBack={() => navigation.goBack()} />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 64,
    paddingBottom: 48,
    backgroundColor: '#f5e8d9',
  },
  back: { alignSelf: 'flex-start', paddingVertical: 8, marginBottom: 8 },
  backText: { fontSize: 18, color: '#7A5C14' },
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