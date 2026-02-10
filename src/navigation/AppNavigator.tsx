import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { COLORS } from '../constants/Colors';

// Import screens (we'll create these next)
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import VerbDetailScreen from '../screens/VerbDetailScreen';
import QuizSetupScreen from '../screens/QuizSetupScreen';
import QuizScreen from '../screens/QuizScreen';
import ResultsScreen from '../screens/ResultsScreen';

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: COLORS.white,
          headerTitleStyle: {
            fontWeight: '600',
          },
          cardStyle: {
            backgroundColor: COLORS.background,
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Tiempo' }}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{ title: 'Search Verbs' }}
        />
        <Stack.Screen
          name="VerbDetail"
          component={VerbDetailScreen}
          options={{ title: 'Verb Conjugations' }}
        />
        <Stack.Screen
          name="QuizSetup"
          component={QuizSetupScreen}
          options={{ title: 'Setup Quiz' }}
        />
        <Stack.Screen
          name="Quiz"
          component={QuizScreen}
          options={{ title: 'Quiz', headerLeft: () => null }} // Prevent going back during quiz
        />
        <Stack.Screen
          name="Results"
          component={ResultsScreen}
          options={{ title: 'Quiz Results', headerLeft: () => null }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
