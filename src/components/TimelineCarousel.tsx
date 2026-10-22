import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { images } from '../data/images';
import { indexFromOffset } from '../logic/timeline';
import { Movement } from '../types/movement';

const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = 140;
const ITEM_HEIGHT = 400;
const AXIS_Y = 200;
const MEDALLION = 120;
const STEM = 70;
const LABEL_HEIGHT = 64;
const SIDE_PADDING = (SCREEN_WIDTH - ITEM_WIDTH) / 2;

type ItemProps = {
  movement: Movement;
  index: number;
  scrollX: SharedValue<number>;
};

function TimelineItem({ movement, index, scrollX }: ItemProps) {
  const above = index % 2 === 0;
  const cover = images[movement.artworks[0].imageKey];

  const animatedStyle = useAnimatedStyle(() => {
    const input = [
      (index - 1) * ITEM_WIDTH,
      index * ITEM_WIDTH,
      (index + 1) * ITEM_WIDTH,
    ];
    return {
      transform: [
        {
          scale: interpolate(
            scrollX.value,
            input,
            [0.65, 1.15, 0.65],
            Extrapolation.CLAMP
          ),
        },
      ],
      opacity: interpolate(
        scrollX.value,
        input,
        [0.6, 1, 0.6],
        Extrapolation.CLAMP
      ),
    };
  });

  return (
    <Animated.View style={[styles.item, animatedStyle]}>
      <View style={[styles.stem, { top: above ? AXIS_Y - STEM : AXIS_Y }]} />
      <View
        style={[
          styles.medallion,
          { top: above ? AXIS_Y - STEM - MEDALLION : AXIS_Y + STEM },
        ]}
      >
        <Image source={cover} style={styles.cover} />
      </View>
      <View
        style={[
          styles.label,
          {
            top: above ? AXIS_Y + 16 : AXIS_Y - 16 - LABEL_HEIGHT,
            justifyContent: above ? 'flex-start' : 'flex-end',
          },
        ]}
      >
        <Text style={styles.name} numberOfLines={2}>
          {movement.name}
        </Text>
        <Text style={styles.years}>{movement.yearRange}</Text>
      </View>
    </Animated.View>
  );
}

type Props = {
  movements: Movement[];
  onActiveChange: (index: number) => void;
};

export function TimelineCarousel({ movements, onActiveChange }: Props) {
  const scrollX = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((e) => {
    scrollX.value = e.contentOffset.x;
  });

  const onMomentumScrollEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    onActiveChange(
      indexFromOffset(
        e.nativeEvent.contentOffset.x,
        ITEM_WIDTH,
        movements.length
      )
    );
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.axis} />
      <Animated.FlatList
        data={movements}
        keyExtractor={(m) => m.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        scrollEventThrottle={16}
        onScroll={onScroll}
        onMomentumScrollEnd={onMomentumScrollEnd}
        contentContainerStyle={{ paddingHorizontal: SIDE_PADDING }}
        renderItem={({ item, index }) => (
          <TimelineItem movement={item} index={index} scrollX={scrollX} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { height: ITEM_HEIGHT },
  axis: {
    position: 'absolute',
    top: AXIS_Y,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#CFC6B2',
  },
  item: { width: ITEM_WIDTH, height: ITEM_HEIGHT },
  stem: {
    position: 'absolute',
    left: ITEM_WIDTH / 2 - 1,
    width: 2,
    height: STEM,
    backgroundColor: '#CFC6B2',
  },
  medallion: {
    position: 'absolute',
    left: (ITEM_WIDTH - MEDALLION) / 2,
    width: MEDALLION,
    height: MEDALLION,
    borderRadius: MEDALLION / 2,
    borderWidth: 3,
    borderColor: '#C9A24B',
    overflow: 'hidden',
    backgroundColor: '#E3DCC9',
  },
  cover: { width: '100%', height: '100%' },
  label: {
    position: 'absolute',
    left: 0,
    width: ITEM_WIDTH,
    height: LABEL_HEIGHT,
    alignItems: 'center',
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: '#211D17',
    textAlign: 'center',
  },
  years: { fontSize: 12, color: '#6B6557' },
});