// src/services/whatsappService.ts
import { Linking, Platform } from 'react-native';
import { getSecuredValue } from '../utils/security';
import { scheduleLocalNotification } from '../utils/notification';
import { logEvent } from './logger';

interface ReminderTemplate {
  memberName: string;
  memberNumber: string;
  deceasedRelation: string;
  contributionAmount: number;
  startDate: string;
  endDate: string;
  paymentOptions: string[];
  dashboardLink: string;
}

export const sendWhatsAppMessage = async (
  message: string,
  groupId?: string,
  phoneNumbers?: string[]
): Promise<boolean> => {
  try {
    let url: string;
    
    if (groupId) {
      url = `whatsapp://chat?code=${groupId}&text=${encodeURIComponent(message)}`;
    } else if (phoneNumbers?.length) {
      // For individual messages (limited to one at a time due to WhatsApp restrictions)
      url = `whatsapp://send?text=${encodeURIComponent(message)}&phone=${phoneNumbers[0]}`;
    } else {
      throw new Error('No recipient specified');
    }

    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      throw new Error('WhatsApp not installed');
    }

    await Linking.openURL(url);
    logEvent('WHATSAPP_MESSAGE_SENT', { groupId, recipients: phoneNumbers?.length || 1 });
    return true;
  } catch (error) {
    logEvent('WHATSAPP_SEND_ERROR', { error: error.message });
    return false;
  }
};

export const scheduleDailyReminders = async (
  template: ReminderTemplate,
  groupId: string,
  days: number = 7
): Promise<void> => {
  try {
    const message = generateReminderMessage(template);
    const startDate = new Date(template.startDate);
    
    for (let day = 1; day <= days; day++) {
      const triggerDate = new Date(startDate);
      triggerDate.setDate(triggerDate.getDate() + day - 1);
      triggerDate.setHours(10, 0, 0); // 10 AM daily
      
      await scheduleLocalNotification(
        `reminder_day_${day}`,
        'TRUEFAM Reminder',
        message,
        triggerDate,
        async () => {
          await sendWhatsAppMessage(message, groupId);
        }
      );
    }
    
    logEvent('REMINDERS_SCHEDULED', { count: days });
  } catch (error) {
    logEvent('REMINDER_SCHEDULE_ERROR', { error: error.message });
  }
};

const generateReminderMessage = (template: ReminderTemplate): string => {
  const paymentOptions = template.paymentOptions
    .map(opt => `• ${opt}`)
    .join('\n');
    
  return `Dear TRUEFAM Family,

We regret to inform you that our member ${template.memberName} (Member No: ${template.memberNumber}) has lost their ${template.deceasedRelation}.

In line with our support model, each member is kindly asked to contribute ₹${template.contributionAmount} within the next 7 days, from ${template.startDate} to ${template.endDate}.

💳 Payment Options:
${paymentOptions}

📊 Contribution Dashboard: ${template.dashboardLink}

Your timely contribution ensures dignity, love, and unity during this difficult moment. Let's stand together — as we always do.

With compassion,
TRUEFAM Welfare Admin`;
};