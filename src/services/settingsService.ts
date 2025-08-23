interface LocalSettings {
  paymentEnabled: boolean;
}

interface ServerSettings {
  report_mode: 'MANUAL' | 'AUTO';
  report_manual_time: number;
  ai_provider: 'openai' | 'gemini';
  flow: 'payment' | 'homepage-analysis';
}

interface AIProviderStatus {
  currentProvider: 'openai' | 'gemini';
  availableProviders: string[];
  providerStatus: {
    openai: boolean;
    gemini: boolean;
  };
}

interface AIConnectionTest {
  provider: 'openai' | 'gemini';
  connectionTest: boolean;
  message: string;
}

interface Settings extends LocalSettings, ServerSettings {}

const DEFAULT_LOCAL_SETTINGS: LocalSettings = {
  paymentEnabled: true
};

const DEFAULT_SERVER_SETTINGS: ServerSettings = {
  report_mode: 'AUTO',
  report_manual_time: 24,
  ai_provider: 'openai',
  flow: 'payment'
};

class SettingsService {
  private settingsKey = 'adminSettings';
  private baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000/api';

  // Get local settings from localStorage
  getLocalSettings(): LocalSettings {
    try {
      const savedSettings = localStorage.getItem(this.settingsKey);
      if (savedSettings) {
        return { ...DEFAULT_LOCAL_SETTINGS, ...JSON.parse(savedSettings) };
      }
    } catch (error) {
      console.error('Error loading local settings:', error);
    }
    return { ...DEFAULT_LOCAL_SETTINGS };
  }

  // Save local settings to localStorage
  saveLocalSettings(settings: LocalSettings): void {
    try {
      localStorage.setItem(this.settingsKey, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving local settings:', error);
      throw error;
    }
  }

  // Get server settings from API
  async getServerSettings(): Promise<ServerSettings> {
    try {
      const response = await fetch(`${this.baseUrl}/settings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data || DEFAULT_SERVER_SETTINGS;
    } catch (error) {
      console.error('Error fetching server settings:', error);
      return DEFAULT_SERVER_SETTINGS;
    }
  }

  // Update server settings via API
  async updateServerSettings(settings: Partial<ServerSettings>): Promise<ServerSettings> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseUrl}/settings`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error text:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error updating server settings:', error);
      throw error;
    }
  }

  // Reset server settings to default
  async resetServerSettings(): Promise<ServerSettings> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseUrl}/settings/reset`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error resetting server settings:', error);
      throw error;
    }
  }

  // Get all settings (local + server)
  async getSettings(): Promise<Settings> {
    const localSettings = this.getLocalSettings();
    const serverSettings = await this.getServerSettings();
    
    return {
      ...localSettings,
      ...serverSettings
    };
  }

  // Save all settings
  async saveSettings(settings: Partial<Settings>): Promise<Settings> {
    const localSettings: Partial<LocalSettings> = {};
    const serverSettings: Partial<ServerSettings> = {};

    // Separate local and server settings
    if ('paymentEnabled' in settings) {
      localSettings.paymentEnabled = settings.paymentEnabled;
    }
    if ('report_mode' in settings) {
      serverSettings.report_mode = settings.report_mode;
    }
    if ('report_manual_time' in settings) {
      serverSettings.report_manual_time = settings.report_manual_time;
    }
    if ('ai_provider' in settings) {
      serverSettings.ai_provider = settings.ai_provider;
    }
    if ('flow' in settings) {
      serverSettings.flow = settings.flow;
    }

    // Save local settings
    if (Object.keys(localSettings).length > 0) {
      const currentLocal = this.getLocalSettings();
      this.saveLocalSettings({ ...currentLocal, ...localSettings });
    }

    // Save server settings
    if (Object.keys(serverSettings).length > 0) {
      await this.updateServerSettings(serverSettings);
    }

    return this.getSettings();
  }

  // Update specific setting
  async updateSetting<K extends keyof Settings>(key: K, value: Settings[K]): Promise<void> {
    if (key === 'paymentEnabled') {
      const currentSettings = this.getLocalSettings();
      this.saveLocalSettings({ ...currentSettings, [key]: value });
    } else {
      await this.updateServerSettings({ [key]: value } as Partial<ServerSettings>);
    }
  }

  // Check if payment is enabled (local only)
  isPaymentEnabled(): boolean {
    return this.getLocalSettings().paymentEnabled;
  }

  // Reset all settings to default
  async resetSettings(): Promise<void> {
    this.saveLocalSettings(DEFAULT_LOCAL_SETTINGS);
    await this.resetServerSettings();
  }

  // Get AI provider status
  async getAIProviderStatus(): Promise<AIProviderStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/settings/ai-provider`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching AI provider status:', error);
      throw error;
    }
  }

  // Set AI provider
  async setAIProvider(provider: 'openai' | 'gemini'): Promise<AIProviderStatus> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseUrl}/settings/ai-provider`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ provider })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error setting AI provider:', error);
      throw error;
    }
  }

  // Test AI connection
  async testAIConnection(): Promise<AIConnectionTest> {
    try {
      const response = await fetch(`${this.baseUrl}/settings/ai-provider/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error testing AI connection:', error);
      throw error;
    }
  }
}

const settingsService = new SettingsService();
export default settingsService; 