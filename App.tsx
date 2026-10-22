import { StatusBar } from 'expo-status-bar';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Accordion } from './src/components/Accordion';
import movements from './src/data/movements.json';
import { images } from './src/data/images';
import { Movement } from './src/types/movement';
import { ZoomableImage } from './src/components/ZoomableImage';


const movement = (movements as Movement[])[0];
const artwork = movement.artworks[0];

export default function App() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.movement}>{movement.name}</Text>
      <ZoomableImage
        source={images[artwork.imageKey]}
        style={styles.image}
        resizeMode="contain"
      />
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

      <StatusBar style="auto" />
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
  image: { width: '100%', height: 420, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '600', marginBottom: 4 },
  artist: { fontSize: 16, color: '#6B6557', marginBottom: 16 },
  body: { fontSize: 16, lineHeight: 24, marginBottom: 12 },
  sections: { marginTop: 16 },
});