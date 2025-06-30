// src/services/settings.ts
import { Settings } from '../types';

let currentSettings: Settings = {
  sheetUrl: '',
  monitorSMS: true,
  monitorEmail: true,
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  isConfigured: false,
};

export const saveSettings = async (settings: Partial<Settings>): Promise<void> => {
  currentSettings = { ...currentSettings, ...settings };
};

export const loadInitialSettings = async (): Promise<Settings> => {
  return currentSettings;
};