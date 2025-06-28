// src/services/background.ts
import BackgroundFetch from 'react-native-background-fetch';
import { processSMSMessages } from './smsProcessor';
import { uploadToGoogleSheet } from './googleSheets';
import { useAppContext } from '../context/AppContext';
import { logEvent } from './logger';

export const setupBackgroundTasks = async () => {
  // Configure background fetch
  BackgroundFetch.configure(
    {
      minimumFetchInterval: 15, // Minimum interval in minutes (15 is minimum allowed)
      stopOnTerminate: false,
      startOnBoot: true,
      enableHeadless: true,
    },
    async (taskId) => {
      console.log('[BackgroundFetch] task started');
      
      try {
        const { state } = useAppContext();
        const transactions = await processSMSMessages(
          new Date(state.settings.startDate),
          new Date(state.settings.endDate)
        );
        
        if (transactions.length > 0 && state.settings.sheetUrl) {
          await uploadToGoogleSheet(transactions, state.settings.sheetUrl);
        }
        
        logEvent('BACKGROUND_SYNC_COMPLETE', { processed: transactions.length });
      } catch (error) {
        logEvent('BACKGROUND_SYNC_ERROR', { error: error.message });
      }
      
      BackgroundFetch.finish(taskId);
    },
    (error) => {
      console.log('[BackgroundFetch] ERROR:', error);
      logEvent('BACKGROUND_FETCH_ERROR', { error: error.message });
    }
  );

  // Schedule daily WhatsApp reminders check
  BackgroundFetch.scheduleTask({
    taskId: 'whatsapp-reminders',
    delay: 86400000, // 24 hours
    periodic: true,
    forceAlarmManager: true,
  });
};