import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initDatabase } from './src/database/db';
import { favoritesStore } from './src/store/favoritesStore';
import { themeStore } from './src/store/themeStore';
import AppNavigator from './src/navigation/AppNavigator';
import LoadingSpinner from './src/components/LoadingSpinner';
import { useTheme } from './src/hooks/useTheme';

function AppContent() {
  const { isDark } = useTheme();
  
  return (
    <>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
        backgroundColor="transparent"
        translucent
      />
      <AppNavigator />
    </>
  );
}

export default function App() {
  const [dbReady, setDbReady] = useState(false);
  const [dbError, setDbError] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        await initDatabase();
        await favoritesStore.initialize();
        await themeStore.initialize();
        setDbReady(true);
      } catch (err) {
        console.error('Failed to initialize app:', err);
        setDbError('Failed to initialize app. Please restart.');
      }
    };
    init();
  }, []);

  if (dbError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{dbError}</Text>
      </View>
    );
  }

  if (!dbReady) {
    return <LoadingSpinner message="Loading Tiempo..." />;
  }

  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}
