import { Image, Pressable, StyleSheet, View } from 'react-native';
import { images } from '../data/images';
import { wallColumns } from '../logic/museum';
import { Artwork } from '../types/movement';

// How far the side walls turn. Swap the sign of this number if on your
// phone the walls lean the wrong way.
export const WALL_ANGLE = 42;

type Props = {
  artworks: Artwork[];
  width: number;
  height: number;
  tilt: 'left' | 'right' | 'none';
  onOpen: (artworkId: string) => void;
};

export function MuseumWall({ artworks, width, height, tilt, onOpen }: Props) {
  const columns = wallColumns(artworks.length);
  const rows = Math.max(1, Math.ceil(artworks.length / columns));
  const tileHeight = height / rows;

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
      {artworks.map((artwork) => (
        <Pressable
          key={artwork.id}
          onPress={() => onOpen(artwork.id)}
          accessibilityRole="button"
          accessibilityLabel={`Open ${artwork.title}`}
          style={{ width: `${100 / columns}%`, height: tileHeight }}
        >
          <Image
            source={images[artwork.imageKey]}
            style={styles.image}
            resizeMode="cover"
          />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wall: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'hidden',
    backgroundColor: '#E4D4BE',
  },
  image: { width: '100%', height: '100%' },
});