// src/utils/notification.ts
export const scheduleLocalNotification = async (
  id: string,
  title: string,
  message: string,
  triggerDate: Date,
  callback?: () => void
): Promise<void> => {
  console.log('Notification scheduled:', { id, title, triggerDate });
};