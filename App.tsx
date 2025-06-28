// App.tsx
import React, { useEffect, useState } from 'react';
import { StatusBar, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AppProvider } from './src/context/AppContext';
import MainNavigator from './src/navigation/MainNavigator';
import { initSecureStorage } from './src/utils/security';
import { loadInitialSettings } from './src/services/settings';
import SplashScreen from './src/components/SplashScreen';
import { setupBackgroundTasks } from './src/services/background';

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      await initSecureStorage();
      await loadInitialSettings();
      await setupBackgroundTasks();
      setIsReady(true);
    };

    initialize();
  }, []);

  if (!isReady) {
    return <SplashScreen />;
  }

  return (
    <AppProvider>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </AppProvider>
  );
}