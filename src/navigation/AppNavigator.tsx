import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { COLORS } from '../constants/Colors';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import CommonVerbsScreen from '../screens/CommonVerbsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import VerbDetailScreen from '../screens/VerbDetailScreen';
import QuizSetupScreen from '../screens/QuizSetupScreen';
import QuizScreen from '../screens/QuizScreen';
import ResultsScreen from '../screens/ResultsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          cardStyle: {
            backgroundColor: COLORS.background,
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
        />
        <Stack.Screen
          name="CommonVerbs"
          component={CommonVerbsScreen}
        />
        <Stack.Screen
          name="Favorites"
          component={FavoritesScreen}
        />
        <Stack.Screen
          name="VerbDetail"
          component={VerbDetailScreen}
        />
        <Stack.Screen
          name="QuizSetup"
          component={QuizSetupScreen}
        />
        <Stack.Screen
          name="Quiz"
          component={QuizScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="Results"
          component={ResultsScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
