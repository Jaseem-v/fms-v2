import settingsService from '../services/settingsService';

// Utility function to get current payment status
export const getPaymentStatus = (): boolean => {
  return settingsService.isPaymentEnabled();
};

// Utility function to check if user should be redirected to payment
export const shouldRedirectToPayment = (): boolean => {
  return settingsService.isPaymentEnabled();
};

// Utility function to get all current settings
export const getCurrentSettings = () => {
  return settingsService.getSettings();
};

// Utility function to reset settings (useful for testing)
export const resetSettings = (): void => {
  settingsService.resetSettings();
};

// Utility function to set payment enabled/disabled
export const setPaymentEnabled = (enabled: boolean): void => {
  settingsService.updateSetting('paymentEnabled', enabled);
}; 