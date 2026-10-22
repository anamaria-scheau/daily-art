import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CalendarScreen } from '../screens/CalendarScreen';
import { DayScreen } from '../screens/DayScreen';
import { CalendarStackParamList } from './types';

const Stack = createNativeStackNavigator<CalendarStackParamList>();

export function CalendarStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Calendar" component={CalendarScreen} />
      <Stack.Screen
        name="Day"
        component={DayScreen}
        options={{ animation: 'fade' }}
      />
    </Stack.Navigator>
  );
}