import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initDatabase } from './src/database/db';
import { favoritesStore } from './src/store/favoritesStore';
import { themeStore } from './src/store/themeStore';
import AppNavigator from './src/navigation/AppNavigator';
import LoadingSpinner from './src/components/LoadingSpinner';

export default function App() {
  const [dbReady, setDbReady] = useState(false);
  const [dbError, setDbError] = useState(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await initDatabase();
        await favoritesStore.initialize();
        await themeStore.initialize();
        setIsDark(themeStore.isDark());
        setDbReady(true);
        
        // Subscribe to theme changes
        const unsubscribe = themeStore.subscribe(() => {
          setIsDark(themeStore.isDark());
        });
        
        return unsubscribe;
      } catch (err) {
        console.error('Failed to initialize app:', err);
        setDbError('Failed to initialize app. Please restart.');
      }
    };
    
    const cleanupPromise = init();
    
    return () => {
      cleanupPromise.then(cleanup => cleanup && cleanup());
    };
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
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
        backgroundColor="transparent"
        translucent
      />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
