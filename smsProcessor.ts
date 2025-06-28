// src/services/smsProcessor.ts
import { Platform, PermissionsAndroid } from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';
import { PaymentProvider, TRANSACTION_REGEX } from '../constants';
import { logEvent } from './logger';
import { saveTransaction } from './storage';

export const requestSMSPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') return false;

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_SMS,
      {
        title: 'SMS Permission',
        message: 'App needs access to read transaction SMS',
        buttonPositive: 'OK',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (error) {
    logEvent('SMS_PERMISSION_ERROR', { error });
    return false;
  }
};

export const processSMSMessages = async (
  startDate: Date,
  endDate: Date
): Promise<Transaction[]> => {
  if (Platform.OS !== 'android') return [];

  const hasPermission = await requestSMSPermission();
  if (!hasPermission) return [];

  try {
    const filter = {
      box: 'inbox',
      minDate: startDate.getTime(),
      maxDate: endDate.getTime(),
      bodyRegex: PaymentProvider.join('|'),
    };

    const smsList = await new Promise<any[]>((resolve, reject) => {
      SmsAndroid.list(
        JSON.stringify(filter),
        reject,
        (_, messages) => resolve(JSON.parse(messages))
    });

    const transactions: Transaction[] = [];
    const seenIds = new Set<string>();

    for (const sms of smsList) {
      try {
        const transaction = parseSMSTransaction(sms);
        if (transaction && !seenIds.has(transaction.uid)) {
          transactions.push(transaction);
          seenIds.add(transaction.uid);
          await saveTransaction(transaction);
        }
      } catch (error) {
        logEvent('SMS_PROCESS_ERROR', { error, sms });
      }
    }

    return transactions;
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