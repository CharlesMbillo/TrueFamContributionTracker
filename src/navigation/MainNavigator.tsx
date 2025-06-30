// src/navigation/MainNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppContext } from '../context/AppContext';
import DashboardScreen from '../screens/DashboardScreen';
import SetupScreen from '../screens/SetupScreen';

const Stack = createStackNavigator();

const MainNavigator = () => {
  const { state } = useAppContext();

  return (
    <Stack.Navigator
      initialRouteName={state.settings.isConfigured ? 'Dashboard' : 'Setup'}
    >
      <Stack.Screen 
        name="Setup" 
        component={SetupScreen}
        options={{ title: 'App Setup' }}
      />
      <Stack.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'TRUEFAM Dashboard' }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;