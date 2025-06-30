// src/components/StatusIndicator.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  lastUpdated: string | null;
  transactionCount: number;
}

const StatusIndicator: React.FC<Props> = ({ lastUpdated, transactionCount }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.count}>Transactions: {transactionCount}</Text>
      {lastUpdated && (
        <Text style={styles.updated}>Last updated: {lastUpdated}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#ecf0f1',
    borderRadius: 8,
    marginVertical: 8,
  },
  count: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  updated: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },
});

export default StatusIndicator;