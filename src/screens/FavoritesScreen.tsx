import { useMemo } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { movements } from '../data/catalog';
import { images } from '../data/images';
import { groupFavoritesByMovement } from '../logic/favorites';
import { FavoritesStackParamList } from '../navigation/types';
import { useFavorites } from '../state/FavoritesContext';

type Props = NativeStackScreenProps<FavoritesStackParamList, 'Favorites'>;

export function FavoritesScreen({ navigation }: Props) {
  const { favorites } = useFavorites();
  const groups = useMemo(
    () => groupFavoritesByMovement(favorites, movements),
    [favorites]
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Favorites</Text>

      {groups.length === 0 && (
        <Text style={styles.empty}>
          No favorites yet. Tap the heart on any artwork to keep it here.
        </Text>
      )}

      {groups.map(({ movement, artworks }) => (
        <View key={movement.id} style={styles.folder}>
          <View style={styles.folderHeader}>
            <Ionicons name="folder-outline" size={22} color="#7A5C14" />
            <Text style={styles.folderName}>{movement.name}</Text>
            <Text style={styles.folderCount}>{artworks.length}</Text>
          </View>

          <View style={styles.grid}>
            {artworks.map((artwork) => (
              <View key={artwork.id} style={styles.cell}>
                <Pressable
                  onPress={() =>
                    navigation.navigate('Artwork', { artworkId: artwork.id })
                  }
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
          </View>
        </View>
      ))}
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
  folder: { marginBottom: 24 },
  folderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  folderName: { flex: 1, fontSize: 20, fontWeight: '600', color: '#211D17' },
  folderCount: { fontSize: 16, color: '#7A5C14' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -8 },
  cell: { width: '50%', padding: 8 },
  card: {
    aspectRatio: 0.8,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#EFEAE0',
  },
  image: { width: '100%', height: '100%' },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#211D17', marginTop: 8 },
  cardArtist: { fontSize: 13, color: '#6B6557', marginTop: 2 },
});