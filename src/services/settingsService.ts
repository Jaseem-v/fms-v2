interface Settings {
  paymentEnabled: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  paymentEnabled: true
};

class SettingsService {
  private settingsKey = 'adminSettings';

  // Get settings from localStorage
  getSettings(): Settings {
    try {
      const savedSettings = localStorage.getItem(this.settingsKey);
      if (savedSettings) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) };
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
    return { ...DEFAULT_SETTINGS };
  }

  // Save settings to localStorage
  saveSettings(settings: Settings): void {
    try {
      localStorage.setItem(this.settingsKey, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }

  // Update specific setting
  updateSetting<K extends keyof Settings>(key: K, value: Settings[K]): void {
    const currentSettings = this.getSettings();
    const newSettings = { ...currentSettings, [key]: value };
    this.saveSettings(newSettings);
  }

  // Check if payment is enabled
  isPaymentEnabled(): boolean {
    return this.getSettings().paymentEnabled;
  }

  // Reset settings to default
  resetSettings(): void {
    this.saveSettings(DEFAULT_SETTINGS);
  }
}

const settingsService = new SettingsService();
export default settingsService; 