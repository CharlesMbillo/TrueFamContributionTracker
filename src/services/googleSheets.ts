// src/services/googleSheets.ts
import { Transaction } from '../types';

export const linkGoogleAccount = async (): Promise<void> => {
  console.log('Google account linking would be implemented here');
};

export const uploadToGoogleSheet = async (
  transactions: Transaction[],
  sheetUrl: string
): Promise<void> => {
  console.log('Uploading transactions to Google Sheet:', transactions.length);
};