// src/services/smsProcessor.ts
import { Platform } from 'react-native';
import { PaymentProvider, TRANSACTION_REGEX } from '../constants';
import { Transaction } from '../types';
import { logEvent } from './logger';
import { saveTransaction } from './storage';

export const requestSMSPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') return false;
  
  // Mock permission for demo
  logEvent('SMS_PERMISSION_REQUESTED');
  return true;
};

export const processSMSMessages = async (
  startDate: Date,
  endDate: Date
): Promise<Transaction[]> => {
  if (Platform.OS !== 'android') {
    // Return mock data for demo
    const mockTransactions: Transaction[] = [
      {
        uid: 'mock-1',
        provider: 'Zelle',
        sender: 'John Doe',
        amount: 50.00,
        memberId: '123456',
        date: '12/30/2024',
        rawText: 'Zelle: You received $50.00 from John Doe on 12/30/2024. Memo: 123456',
        source: 'sms',
        timestamp: Date.now(),
        status: 'unprocessed',
      },
      {
        uid: 'mock-2',
        provider: 'Venmo',
        sender: 'Jane Smith',
        amount: 75.00,
        memberId: '789012',
        date: '12/29/2024',
        rawText: 'Venmo: Jane Smith paid you $75.00 – "789012" on 12/29/2024',
        source: 'sms',
        timestamp: Date.now() - 86400000,
        status: 'unprocessed',
      },
    ];
    
    for (const transaction of mockTransactions) {
      await saveTransaction(transaction);
    }
    
    return mockTransactions;
  }

  const hasPermission = await requestSMSPermission();
  if (!hasPermission) return [];

  try {
    // Real SMS processing would go here
    logEvent('SMS_PROCESSING_STARTED', { startDate, endDate });
    return [];
  } catch (error) {
    logEvent('SMS_PROCESSING_ERROR', { error });
    return [];
  }
};

const parseSMSTransaction = (sms: any): Transaction | null => {
  for (const [provider, regex] of Object.entries(TRANSACTION_REGEX)) {
    const match = sms.body.match(regex);
    if (match) {
      const [, amount, sender, date, memberId] = match;
      return {
        uid: `sms-${sms.date}-${provider}`,
        provider,
        sender,
        amount: parseFloat(amount),
        memberId,
        date,
        rawText: sms.body,
        source: 'sms',
        timestamp: parseInt(sms.date),
        status: 'unprocessed',
      };
    }
  }
  return null;
};