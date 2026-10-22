import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { CalendarStack } from './src/navigation/CalendarStack';
import { TimelineStack } from './src/navigation/TimelineStack';
import { FavoritesScreen, MuseumScreen } from './src/screens/placeholders';
import { ProgressProvider } from './src/state/ProgressContext';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <ProgressProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#7A5C14',
            tabBarInactiveTintColor: '#6B6557',
          }}
        >
          <Tab.Screen
            name="Chronological"
            component={TimelineStack}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="time-outline" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Calendar"
            component={CalendarStack}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="calendar-outline" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Favorites"
            component={FavoritesScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="heart-outline" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Museum"
            component={MuseumScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="business-outline" color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </ProgressProvider>
  );
}