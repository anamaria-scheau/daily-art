import { StyleSheet, Text, View } from 'react-native';

export function MuseumScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Museum</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF8F4',
  },
  title: { fontSize: 28, fontWeight: '600', color: '#211D17' },
});