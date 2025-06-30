// src/components/WhatsAppReminderSetup.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

interface Props {
  groupId?: string;
  onGroupChange: (groupId: string) => void;
}

const WhatsAppReminderSetup: React.FC<Props> = ({ groupId, onGroupChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>WhatsApp Group Setup</Text>
      <TextInput
        label="Group ID"
        value={groupId || ''}
        onChangeText={onGroupChange}
        style={styles.input}
        mode="outlined"
      />
      <Button mode="contained" style={styles.button}>
        Test Connection
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
  },
});

export default WhatsAppReminderSetup;