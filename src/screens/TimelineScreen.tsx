import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TimelineCarousel } from '../components/TimelineCarousel';
import movementsData from '../data/movements.json';
import { TimelineStackParamList } from '../navigation/types';
import { Movement } from '../types/movement';

const movements = movementsData as Movement[];

type Props = NativeStackScreenProps<TimelineStackParamList, 'Timeline'>;

export function TimelineScreen({ navigation }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = movements[activeIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Daily Art</Text>

      <View style={styles.timeline}>
        <TimelineCarousel
          movements={movements}
          onActiveChange={setActiveIndex}
          onSelect={(movement) =>
            navigation.navigate('Epoch', { movementId: movement.id })
          }
        />
      </View>

      <ScrollView style={styles.info} contentContainerStyle={styles.infoContent}>
        <Text style={styles.name}>{active.name}</Text>
        <Text style={styles.years}>{active.yearRange}</Text>
        <Text style={styles.description}>{active.description}</Text>
      </ScrollView>
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
  timeline: { flex: 2 },
  info: { flex: 1 },
  infoContent: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16 },
  name: { fontSize: 22, fontWeight: '600', color: '#211D17' },
  years: { fontSize: 14, color: '#7A5C14', marginBottom: 8 },
  description: { fontSize: 16, lineHeight: 24, color: '#4A4332' },
});