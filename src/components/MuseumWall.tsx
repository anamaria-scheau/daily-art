import { Image, Pressable, StyleSheet, View } from 'react-native';
import { images } from '../data/images';
import { fitTiles } from '../logic/wallLayout';
import { Artwork } from '../types/movement';

// How far the side walls turn. Swap the sign of this number if on your
// phone the walls lean the wrong way.
export const WALL_ANGLE = 42;

const PADDING = 8;

type Props = {
  artworks: Artwork[];
  width: number;
  height: number;
  tilt: 'left' | 'right' | 'none';
  onOpen: (artworkId: string) => void;
};

export function MuseumWall({ artworks, width, height, tilt, onOpen }: Props) {
  const layout = fitTiles(
    artworks.length,
    width - PADDING * 2,
    height - PADDING * 2
  );

  const rows: Artwork[][] = [];
  if (layout.columns > 0) {
    for (let index = 0; index < artworks.length; index += layout.columns) {
      rows.push(artworks.slice(index, index + layout.columns));
    }
  }

  const tiltStyle =
    tilt === 'left'
      ? {
          transformOrigin: 'right center' as const,
          transform: [{ perspective: 800 }, { rotateY: `${WALL_ANGLE}deg` }],
        }
      : tilt === 'right'
        ? {
            transformOrigin: 'left center' as const,
            transform: [{ perspective: 800 }, { rotateY: `${-WALL_ANGLE}deg` }],
          }
        : undefined;

  return (
    <View style={[styles.wall, { width, height }, tiltStyle]}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((artwork) => (
            <Pressable
              key={artwork.id}
              onPress={() => onOpen(artwork.id)}
              accessibilityRole="button"
              accessibilityLabel={`Open ${artwork.title}`}
              style={{ width: layout.tileWidth, height: layout.tileHeight }}
            >
              <Image
                source={images[artwork.imageKey]}
                style={styles.image}
                resizeMode="cover"
              />
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wall: {
    overflow: 'hidden',
    backgroundColor: '#E4D4BE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: { flexDirection: 'row', justifyContent: 'center' },
  image: { width: '100%', height: '100%' },
});