import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { initDatabase } from './src/database/db';
import AppNavigator from './src/navigation/AppNavigator';
import LoadingSpinner from './src/components/LoadingSpinner';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize database
      await initDatabase();
      setIsReady(true);
    } catch (err) {
      console.error('Failed to initialize app:', err);
      setError('Failed to initialize app. Please restart.');
    }
  };

  if (error) {
    return <LoadingSpinner message={error} />;
  }

  if (!isReady) {
    return <LoadingSpinner message="Loading Tiempo..." />;
  }

  return (
    <>
      <StatusBar style="light" />
      <AppNavigator />
    </>
  );
}
