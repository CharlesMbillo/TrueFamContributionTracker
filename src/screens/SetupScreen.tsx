// src/screens/SetupScreen.tsx
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, TextInput, Switch, Text } from 'react-native-paper';
import { useAppContext } from '../context/AppContext';
import { linkGoogleAccount } from '../services/googleSheets';
import { saveSettings } from '../services/settings';

interface SetupScreenProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

const SetupScreen: React.FC<SetupScreenProps> = ({ navigation }) => {
  const { state, dispatch } = useAppContext();
  const [sheetUrl, setSheetUrl] = useState(state.settings.sheetUrl);
  const [monitorSMS, setMonitorSMS] = useState(state.settings.monitorSMS);
  const [startDate, setStartDate] = useState(new Date(state.settings.startDate));
  const [endDate, setEndDate] = useState(new Date(state.settings.endDate));

  const handleSave = async () => {
    const newSettings = {
      sheetUrl,
      monitorSMS,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      isConfigured: true,
    };
    
    await saveSettings(newSettings);
    dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings });
    navigation.navigate('Dashboard');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>App Configuration</Text>
      
      <TextInput
        label="Google Sheet URL"
        value={sheetUrl}
        onChangeText={setSheetUrl}
        style={styles.input}
        mode="outlined"
      />
      
      <Button 
        mode="contained" 
        onPress={linkGoogleAccount}
        style={styles.button}
        icon="google"
      >
        Link Google Account
      </Button>
      
      <View style={styles.switchContainer}>
        <Text>Monitor SMS Transactions:</Text>
        <Switch 
          value={monitorSMS} 
          onValueChange={setMonitorSMS}
        />
      </View>
      
      <View style={styles.dateContainer}>
        <Text>Monitoring Period:</Text>
        <Button 
          mode="outlined"
          style={styles.dateButton}
        >
          Start: {startDate.toLocaleDateString()}
        </Button>
        
        <Button 
          mode="outlined"
          style={styles.dateButton}
        >
          End: {endDate.toLocaleDateString()}
        </Button>
      </View>
      
      <Button 
        mode="contained" 
        onPress={handleSave}
        style={styles.saveButton}
        disabled={!sheetUrl}
      >
        Save Configuration
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
  },
  dateContainer: {
    marginBottom: 20,
  },
  dateButton: {
    marginVertical: 5,
  },
  saveButton: {
    marginTop: 20,
  },
});

export default SetupScreen;