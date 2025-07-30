'use client';

import React, { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import { CogIcon, CreditCardIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import settingsService from '../../../services/settingsService';

interface Settings {
  paymentEnabled: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    paymentEnabled: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Load settings from service on component mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedSettings = settingsService.getSettings();
        setSettings(savedSettings);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadSettings();
  }, []);

  // Save settings using service
  const saveSettings = async (newSettings: Settings) => {
    setIsLoading(true);
    setSaveStatus('saving');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      settingsService.saveSettings(newSettings);
      setSettings(newSettings);
      setSaveStatus('saved');
      
      // Reset status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus('error');
      
      // Reset error status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentToggle = async (enabled: boolean) => {
    const newSettings = { ...settings, paymentEnabled: enabled };
    await saveSettings(newSettings);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-sm text-gray-600">
          Configure application settings and preferences
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-8">
        {/* Payment Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <CreditCardIcon className="h-6 w-6 text-gray-400 mr-3" />
              <h2 className="text-lg font-medium text-gray-900">Payment Settings</h2>
            </div>
          </div>
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">Enable Payment Gateway</h3>
                <p className="text-sm text-gray-500 mt-1">
                  When enabled, users will be redirected to the payment page before generating reports. 
                  When disabled, users can generate reports directly without payment.
                </p>
              </div>
              <div className="ml-6">
                <Switch
                  checked={settings.paymentEnabled}
                  onChange={handlePaymentToggle}
                  disabled={isLoading}
                  className={`${
                    settings.paymentEnabled ? 'bg-blue-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50`}
                >
                  <span
                    className={`${
                      settings.paymentEnabled ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>
            </div>
            
            {/* Status indicator */}
            {saveStatus !== 'idle' && (
              <div className="mt-4">
                {saveStatus === 'saving' && (
                  <div className="flex items-center text-sm text-blue-600">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                    Saving settings...
                  </div>
                )}
                {saveStatus === 'saved' && (
                  <div className="flex items-center text-sm text-green-600">
                    <ShieldCheckIcon className="w-4 h-4 mr-2" />
                    Settings saved successfully!
                  </div>
                )}
                {saveStatus === 'error' && (
                  <div className="flex items-center text-sm text-red-600">
                    <span className="mr-2">⚠️</span>
                    Error saving settings. Please try again.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Information Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CogIcon className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Settings Information</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  <strong>Payment Enabled:</strong> {settings.paymentEnabled ? 'Yes' : 'No'}
                </p>
                <p className="mt-1">
                  {settings.paymentEnabled 
                    ? 'Users will be redirected to payment page before report generation.'
                    : 'Users can generate reports directly without payment verification.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Behavior */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Current Behavior</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              <strong>When Payment is Enabled:</strong>
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>User enters website URL</li>
              <li>System validates Shopify site</li>
              <li>User is redirected to payment page</li>
              <li>After payment, user is redirected to report generation</li>
            </ul>
            
            <p className="mt-3">
              <strong>When Payment is Disabled:</strong>
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>User enters website URL</li>
              <li>System validates Shopify site</li>
              <li>Report generation starts immediately</li>
              <li>No payment verification required</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 