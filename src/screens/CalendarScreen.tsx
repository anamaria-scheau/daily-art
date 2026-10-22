import { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { findArtwork } from '../data/catalog';
import { images } from '../data/images';
import { buildMonthGrid, shiftMonth } from '../logic/calendar';
import { toDateKey } from '../logic/progress';
import { analyzeStreak } from '../logic/streak';
import { CalendarStackParamList } from '../navigation/types';
import { useProgress } from '../state/ProgressContext';
import { ViewEntry } from '../types/progress';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

type Props = NativeStackScreenProps<CalendarStackParamList, 'Calendar'>;

export function CalendarScreen({ navigation }: Props) {
  const { state } = useProgress();
  const todayKey = toDateKey(new Date());
  const now = new Date();
  const [month, setMonth] = useState({
    year: now.getFullYear(),
    monthIndex: now.getMonth(),
  });

  const entriesByDate = useMemo(() => {
    const map = new Map<string, ViewEntry>();
    for (const entry of state.viewHistory) map.set(entry.date, entry);
    return map;
  }, [state.viewHistory]);

  const { streak, frozenDays } = useMemo(
    () =>
      analyzeStreak(
        state.viewHistory.map((entry) => entry.date),
        todayKey
      ),
    [state.viewHistory, todayKey]
  );
  const frozen = useMemo(() => new Set(frozenDays), [frozenDays]);
  const grid = useMemo(
    () => buildMonthGrid(month.year, month.monthIndex),
    [month]
  );

  const goToMonth = (delta: number) =>
    setMonth((current) =>
      shiftMonth(current.year, current.monthIndex, delta)
    );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Calendar</Text>
        <View style={styles.streakPill}>
          <Text style={styles.streakText}>
            {streak} {streak === 1 ? 'day' : 'days'}
          </Text>
        </View>
      </View>

      <View style={styles.monthRow}>
        <Pressable
          onPress={() => goToMonth(-1)}
          accessibilityRole="button"
          accessibilityLabel="Previous month"
          style={styles.arrow}
        >
          <Text style={styles.arrowText}>‹</Text>
        </Pressable>
        <Text style={styles.monthLabel}>
          {MONTHS[month.monthIndex]} {month.year}
        </Text>
        <Pressable
          onPress={() => goToMonth(1)}
          accessibilityRole="button"
          accessibilityLabel="Next month"
          style={styles.arrow}
        >
          <Text style={styles.arrowText}>›</Text>
        </Pressable>
      </View>

      <View style={styles.weekRow}>
        {WEEKDAYS.map((label, index) => (
          <Text key={index} style={styles.weekday}>
            {label}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {grid.map((dateKey, index) => {
          if (!dateKey) {
            return <View key={`empty-${index}`} style={styles.cell} />;
          }
          const entry = entriesByDate.get(dateKey);
          const found = entry ? findArtwork(entry.artworkId) : undefined;
          const isToday = dateKey === todayKey;
          const isFrozen = frozen.has(dateKey);

          return (
            <View key={dateKey} style={styles.cell}>
              <Pressable
                disabled={!found}
                onPress={() =>
                  found &&
                  navigation.navigate('Day', { artworkId: found.artwork.id })
                }
                accessibilityRole={found ? 'button' : undefined}
                accessibilityLabel={
                  found ? `Open ${found.artwork.title}` : undefined
                }
                style={[
                  styles.day,
                  isToday && styles.today,
                  isFrozen && styles.frozen,
                ]}
              >
                {found ? (
                  <Image
                    source={images[found.artwork.imageKey]}
                    style={styles.thumb}
                  />
                ) : (
                  <Text style={styles.dayNumber}>{Number(dateKey.slice(8))}</Text>
                )}
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F4',
    paddingTop: 64,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 28, fontWeight: '600', color: '#211D17' },
  streakPill: {
    backgroundColor: '#211D17',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  streakText: { color: '#C9A24B', fontSize: 16, fontWeight: '600' },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  arrow: { padding: 8 },
  arrowText: { fontSize: 28, color: '#7A5C14' },
  monthLabel: { fontSize: 20, fontWeight: '600', color: '#211D17' },
  weekRow: { flexDirection: 'row', marginBottom: 4 },
  weekday: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    fontSize: 14,
    color: '#6B6557',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: `${100 / 7}%`, padding: 2 },
  day: {
    aspectRatio: 0.8,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: 'transparent',
    backgroundColor: '#EFEAE0',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  today: { borderColor: '#C9A24B' },
  frozen: { borderColor: '#6C8FB8' },
  thumb: { width: '100%', height: '100%' },
  dayNumber: { fontSize: 14, color: '#6B6557' },
});