import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ArtworkScreen } from '../screens/ArtworkScreen';
import { EpochScreen } from '../screens/EpochScreen';
import { TimelineScreen } from '../screens/TimelineScreen';
import { TimelineStackParamList } from './types';

const Stack = createNativeStackNavigator<TimelineStackParamList>();

export function TimelineStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Timeline" component={TimelineScreen} />
      <Stack.Screen
        name="Epoch"
        component={EpochScreen}
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