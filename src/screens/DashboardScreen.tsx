// src/screens/DashboardScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAppContext } from '../context/AppContext';
import TransactionList from '../components/TransactionList';
import StatusIndicator from '../components/StatusIndicator';
import WhatsAppReminderSetup from '../components/WhatsAppReminderSetup';
import { processSMSMessages } from '../services/smsProcessor';
import { uploadToGoogleSheet } from '../services/googleSheets';
import { Button } from 'react-native-paper';

const DashboardScreen = () => {
  const { state, dispatch } = useAppContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const handleRefresh = async () => {
    setIsProcessing(true);
    try {
      const startDate = new Date(state.settings.startDate);
      const endDate = new Date(state.settings.endDate);
      
      const transactions = await processSMSMessages(startDate, endDate);
      if (transactions.length > 0) {
        dispatch({ type: 'ADD_TRANSACTIONS', payload: transactions });
        
        if (state.settings.sheetUrl) {
          await uploadToGoogleSheet(transactions, state.settings.sheetUrl);
        }
      }
      
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>TRUEFAM Contributions</Text>
        <StatusIndicator 
          lastUpdated={lastUpdated} 
          transactionCount={state.transactions.length} 
        />
      </View>
      
      <View style={styles.actions}>
        <Button 
          mode="contained" 
          onPress={handleRefresh}
          loading={isProcessing}
          disabled={isProcessing}
          style={styles.button}
        >
          Refresh Transactions
        </Button>
        
        <Button 
          mode="outlined" 
          onPress={() => dispatch({ type: 'TOGGLE_SELECTED', payload: 'all' })}
          style={styles.button}
        >
          Select All
        </Button>
      </View>
      
      <TransactionList 
        transactions={state.transactions}
        selected={state.selectedTransactions}
      />
      
      <WhatsAppReminderSetup 
        groupId={state.whatsappGroupId}
        onGroupChange={(groupId) => dispatch({ type: 'SET_WHATSAPP_GROUP', payload: groupId })}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default DashboardScreen;