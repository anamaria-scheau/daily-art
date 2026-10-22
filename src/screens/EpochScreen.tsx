import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Accordion } from '../components/Accordion';
import { ZoomableImage } from '../components/ZoomableImage';
import movements from '../data/movements.json';
import { images } from '../data/images';
import { Movement } from '../types/movement';

const movement = (movements as Movement[])[0];
const artwork = movement.artworks[0];

export function EpochScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.movement}>{movement.name}</Text>
      <ZoomableImage source={images[artwork.imageKey]} />
      <Text style={styles.title}>{artwork.title}</Text>
      <Text style={styles.artist}>
        {artwork.artist}, {artwork.year}
      </Text>
      <Text style={styles.body}>{artwork.description}</Text>

      <View style={styles.sections}>
        <Accordion title="The Gossip" defaultOpen>
          <Text style={styles.body}>{artwork.story}</Text>
        </Accordion>

        <Accordion title="Look closer">
          {artwork.lookCloser.map((tip) => (
            <Text key={tip} style={styles.body}>
              • {tip}
            </Text>
          ))}
        </Accordion>

        <Accordion title="The Details">
          <Text style={styles.body}>{artwork.details.medium}</Text>
          <Text style={styles.body}>{artwork.details.dimensions}</Text>
          <Text style={styles.body}>{artwork.details.location}</Text>
        </Accordion>

        <Accordion title="History & Context">
          <Text style={styles.body}>{artwork.context}</Text>
        </Accordion>

        <Accordion title="About the artist">
          <Text style={styles.body}>{artwork.artistBio}</Text>
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
    backgroundColor: '#f1bc7e',
  },
  movement: { fontSize: 16, color: '#7A5C14', marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '600', marginBottom: 4 },
  artist: { fontSize: 16, color: '#6B6557', marginBottom: 16 },
  body: { fontSize: 16, lineHeight: 24, marginBottom: 12 },
  sections: { marginTop: 16 },
});