import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { ClassroomsScreen } from './src/screens/ClassroomsScreen';
import { MessengerScreen } from './src/screens/MessengerScreen';
import { ExamScreen } from './src/screens/ExamScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: '#0a1628' },
              headerTintColor: '#c8a84e',
              tabBarStyle: { backgroundColor: '#0a1628', borderTopColor: '#1e3a5f' },
              tabBarActiveTintColor: '#c8a84e',
              tabBarInactiveTintColor: '#6b7280',
            }}
          >
            <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarIcon: () => null }} />
            <Tab.Screen name="Classrooms" component={ClassroomsScreen} options={{ tabBarIcon: () => null }} />
            <Tab.Screen name="Messenger" component={MessengerScreen} options={{ tabBarIcon: () => null }} />
            <Tab.Screen name="Exams" component={ExamScreen} options={{ tabBarIcon: () => null }} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: () => null }} />
          </Tab.Navigator>
          <StatusBar style="light" />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
