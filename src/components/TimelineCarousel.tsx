import { useState } from 'react';
import {
  Dimensions,
  Image,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
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
const ITEM_WIDTH = 160;
const LABEL_HEIGHT = 64;
const MAX_SCALE = 1.15;
const SIDE_PADDING = (SCREEN_WIDTH - ITEM_WIDTH) / 2;

type Layout = {
  height: number;
  axisY: number;
  medallion: number;
  stem: number;
};

function computeLayout(height: number): Layout {
  const axisY = height / 2;
  const maxHalf = axisY / MAX_SCALE - 8;
  const medallion = Math.min(maxHalf * 0.72, ITEM_WIDTH * 0.9);
  return { height, axisY, medallion, stem: maxHalf - medallion };
}

type ItemProps = {
  movement: Movement;
  index: number;
  scrollX: SharedValue<number>;
  layout: Layout;
  onPress: () => void;
};

function TimelineItem({
  movement,
  index,
  scrollX,
  layout,
  onPress,
}: ItemProps) {
  const above = index % 2 === 0;
  const cover = images[movement.artworks[0].imageKey];
  const { axisY, medallion, stem } = layout;

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
            [0.65, MAX_SCALE, 0.65],
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
    <Animated.View
      style={[{ width: ITEM_WIDTH, height: layout.height }, animatedStyle]}
    >
      <View
        style={[
          styles.stem,
          { height: stem, top: above ? axisY - stem : axisY },
        ]}
      />
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Open ${movement.name}`}
        style={[
          styles.medallion,
          {
            width: medallion,
            height: medallion,
            borderRadius: medallion / 2,
            left: (ITEM_WIDTH - medallion) / 2,
            top: above ? axisY - stem - medallion : axisY + stem,
          },
        ]}
      >
        <Image source={cover} style={styles.cover} />
      </Pressable>
      <View
        style={[
          styles.label,
          {
            top: above ? axisY + 16 : axisY - 16 - LABEL_HEIGHT,
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
  onSelect: (movement: Movement) => void;
};

export function TimelineCarousel({
  movements,
  onActiveChange,
  onSelect,
}: Props) {
  const [height, setHeight] = useState(0);
  const scrollX = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((e) => {
    scrollX.value = e.contentOffset.x;
  });

  const onLayout = (e: LayoutChangeEvent) => {
    setHeight(e.nativeEvent.layout.height);
  };

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

  const layout = computeLayout(height);

  return (
    <View style={styles.wrapper} onLayout={onLayout}>
      {height > 0 && (
        <>
          <View style={[styles.axis, { top: layout.axisY }]} />
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
              <TimelineItem
                movement={item}
                index={index}
                scrollX={scrollX}
                layout={layout}
                onPress={() => onSelect(item)}
              />
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  axis: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#CFC6B2',
  },
  stem: {
    position: 'absolute',
    left: ITEM_WIDTH / 2 - 1,
    width: 2,
    backgroundColor: '#CFC6B2',
  },
  medallion: {
    position: 'absolute',
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