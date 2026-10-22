import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TimelineCarousel } from '../components/TimelineCarousel';
import movementsData from '../data/movements.json';
import { Movement } from '../types/movement';

const movements = movementsData as Movement[];

export function TimelineScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = movements[activeIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Daily Art</Text>
      <TimelineCarousel
        movements={movements}
        onActiveChange={setActiveIndex}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{active.name}</Text>
        <Text style={styles.years}>{active.yearRange}</Text>
        <Text style={styles.description}>{active.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF8F4', paddingTop: 64 },
  header: {
    fontSize: 28,
    fontWeight: '600',
    color: '#211D17',
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  info: { paddingHorizontal: 24, paddingTop: 8 },
  name: { fontSize: 22, fontWeight: '600', color: '#211D17' },
  years: { fontSize: 14, color: '#7A5C14', marginBottom: 8 },
  description: { fontSize: 16, lineHeight: 24, color: '#4A4332' },
});