// src/types/index.ts
export interface Transaction {
  uid: string;
  provider: string;
  sender: string;
  amount: number;
  memberId: string;
  date: string;
  rawText: string;
  source: 'sms' | 'email';
  timestamp: number;
  status: 'unprocessed' | 'uploaded' | 'failed';
}

export interface Settings {
  sheetUrl: string;
  monitorSMS: boolean;
  monitorEmail: boolean;
  startDate: string;
  endDate: string;
  isConfigured: boolean;
}

export type PaymentProvider = 'Zelle' | 'Venmo' | 'Cash App';