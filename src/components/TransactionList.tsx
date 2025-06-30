// src/components/TransactionList.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Transaction } from '../types';

interface Props {
  transactions: Transaction[];
  selected: string[];
}

const TransactionList: React.FC<Props> = ({ transactions, selected }) => {
  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.item}>
      <Text style={styles.provider}>{item.provider}</Text>
      <Text style={styles.amount}>${item.amount}</Text>
      <Text style={styles.sender}>{item.sender}</Text>
      <Text style={styles.date}>{item.date}</Text>
    </View>
  );

  return (
    <FlatList
      data={transactions}
      renderItem={renderTransaction}
      keyExtractor={(item) => item.uid}
      style={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  item: {
    padding: 16,
    backgroundColor: '#fff',
    marginVertical: 4,
    borderRadius: 8,
  },
  provider: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  amount: {
    fontSize: 18,
    color: '#27ae60',
  },
  sender: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  date: {
    fontSize: 12,
    color: '#95a5a6',
  },
});

export default TransactionList;