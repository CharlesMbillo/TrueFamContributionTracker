// src/services/storage.ts
import { Transaction } from '../types';

const transactions: Transaction[] = [];

export const saveTransaction = async (transaction: Transaction): Promise<void> => {
  transactions.push(transaction);
};

export const getTransactions = async (): Promise<Transaction[]> => {
  return transactions;
};