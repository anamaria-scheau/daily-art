import { StyleSheet, Text, View } from 'react-native';

function Placeholder({ title }: { title: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
}

export const CalendarScreen = () => <Placeholder title="Calendar" />;
export const FavoritesScreen = () => <Placeholder title="Favorites" />;
export const MuseumScreen = () => <Placeholder title="Museum" />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF8F4',
  },
  text: { fontSize: 24, color: '#211D17' },
});