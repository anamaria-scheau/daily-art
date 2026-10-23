import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRandomArtwork } from '../hooks/useRandomArtwork';

type ImageStatus = 'loading' | 'loaded' | 'failed';

function ArtworkImage({ uri, label }: { uri: string; label: string }) {
  const [status, setStatus] = useState<ImageStatus>('loading');

  return (
    <View style={styles.frame}>
      <Image
        source={{
          uri,
          headers: { 'AIC-User-Agent': 'daily-art-learning-project' },
        }}
        style={styles.image}
        resizeMode="contain"
        accessibilityLabel={label}
        onLoad={() => setStatus('loaded')}
        onError={(event) => {
          console.log('Image failed to load:', uri, event.nativeEvent.error);
          setStatus('failed');
        }}
      />
      {status === 'loading' && (
        <View style={styles.overlay}>
          <ActivityIndicator color="#7A5C14" />
        </View>
      )}
      {status === 'failed' && (
        <View style={styles.overlay}>
          <Text style={styles.hint}>The image could not be loaded.</Text>
        </View>
      )}
    </View>
  );
}

export function SurpriseScreen() {
  const { state, reload } = useRandomArtwork();

  if (state.status === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7A5C14" />
        <Text style={styles.hint}>
          Fetching a surprise from the Art Institute of Chicago…
        </Text>
      </View>
    );
  }

  if (state.status === 'error') {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Oops, no surprise this time</Text>
        <Text style={styles.hint}>{state.message}</Text>
        <Pressable
          onPress={reload}
          accessibilityRole="button"
          style={styles.button}
        >
          <Text style={styles.buttonText}>Try again</Text>
        </Pressable>
      </View>
    );
  }

  const { artwork } = state;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Surprise me</Text>
      <ArtworkImage
        key={artwork.imageUrl}
        uri={artwork.imageUrl}
        label={artwork.title}
      />
      <Text style={styles.title}>{artwork.title}</Text>
      <Text style={styles.artist}>
        {artwork.artist}
        {artwork.year ? `, ${artwork.year}` : ''}
      </Text>
      {artwork.medium !== '' && (
        <Text style={styles.medium}>{artwork.medium}</Text>
      )}
      <Pressable
        onPress={reload}
        accessibilityRole="button"
        style={styles.button}
      >
        <Text style={styles.buttonText}>Another surprise</Text>
      </Pressable>
      <Text style={styles.credit}>
        Image and data: Art Institute of Chicago (public domain)
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#FAF8F4',
    gap: 16,
  },
  container: {
    padding: 24,
    paddingTop: 64,
    paddingBottom: 48,
    backgroundColor: '#FAF8F4',
    minHeight: '100%',
  },
  heading: { fontSize: 28, fontWeight: '600', color: '#211D17', marginBottom: 16 },
  frame: {
    height: 360,
    borderRadius: 12,
    backgroundColor: '#EFEAE0',
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: { width: '100%', height: '100%' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: { fontSize: 24, fontWeight: '600', color: '#211D17', marginBottom: 4 },
  artist: { fontSize: 16, color: '#6B6557', marginBottom: 4 },
  medium: { fontSize: 14, color: '#6B6557', marginBottom: 16 },
  hint: { fontSize: 16, lineHeight: 24, color: '#6B6557', textAlign: 'center' },
  errorTitle: { fontSize: 22, fontWeight: '600', color: '#211D17' },
  button: {
    alignSelf: 'center',
    backgroundColor: '#211D17',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginTop: 8,
  },
  buttonText: { color: '#C9A24B', fontSize: 16, fontWeight: '600' },
  credit: {
    fontSize: 12,
    color: '#6B6557',
    textAlign: 'center',
    marginTop: 24,
  },
});