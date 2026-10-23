import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ArtworkScreen } from '../screens/ArtworkScreen';
import { MuseumRoomScreen } from '../screens/MuseumRoomScreen';
import { MuseumScreen } from '../screens/MuseumScreen';
import { MuseumStackParamList } from './types';

const Stack = createNativeStackNavigator<MuseumStackParamList>();

export function MuseumStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Museum" component={MuseumScreen} />
      <Stack.Screen
        name="Room"
        component={MuseumRoomScreen}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen
        name="Artwork"
        component={ArtworkScreen}
        options={{ animation: 'fade' }}
      />
    </Stack.Navigator>
  );
}