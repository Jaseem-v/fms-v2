import settingsService from '../services/settingsService';

export const isPaymentEnabled = (): boolean => {
  return settingsService.isPaymentEnabled();
};

export const checkPaymentRequired = (): boolean => {
  return settingsService.isPaymentEnabled();
};

export const getCurrentSettings = async () => {
  return await settingsService.getSettings();
};

export const resetSettings = async (): Promise<void> => {
  await settingsService.resetSettings();
};

export const updatePaymentSetting = (enabled: boolean): void => {
  settingsService.updateSetting('paymentEnabled', enabled);
};

export const updateReportMode = async (mode: 'MANUAL' | 'AUTO'): Promise<void> => {
  await settingsService.updateSetting('report_mode', mode);
};

export const updateManualTime = async (time: string): Promise<void> => {
  const timeNumber = parseInt(time, 10);
  if (isNaN(timeNumber)) {
    throw new Error('Invalid time value. Please provide a valid number.');
  }
  await settingsService.updateSetting('report_manual_time', timeNumber);
}; 



export const normalizeUrl = (url: string): string => {
  if (!url) return url;

  // Check if URL already has a protocol (http://, https://, etc.)
  if (url.match(/^https?:\/\//)) {
      return url;
  }

  // Add https:// if no protocol is present
  return `https://${url}`;
};