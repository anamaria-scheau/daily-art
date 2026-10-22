import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ArtworkScreen } from '../screens/ArtworkScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { FavoritesStackParamList } from './types';

const Stack = createNativeStackNavigator<FavoritesStackParamList>();

export function FavoritesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen
        name="Artwork"
        component={ArtworkScreen}
        options={{ animation: 'fade' }}
      />
    </Stack.Navigator>
  );
}