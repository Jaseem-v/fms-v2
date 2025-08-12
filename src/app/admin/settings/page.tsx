'use client';

import React, { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import { CogIcon, CreditCardIcon, ShieldCheckIcon, ClockIcon, DocumentTextIcon, SparklesIcon } from '@heroicons/react/24/outline';
import settingsService from '../../../services/settingsService';

interface Settings {
  paymentEnabled: boolean;
  report_mode: 'MANUAL' | 'AUTO';
  report_manual_time: number;
}

interface AIProviderStatus {
  currentProvider: 'openai' | 'gemini';
  availableProviders: string[];
  providerStatus: {
    openai: boolean;
    gemini: boolean;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    paymentEnabled: true,
    report_mode: 'AUTO',
    report_manual_time: 24
  });
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  
  const [aiProviderStatus, setAiProviderStatus] = useState<AIProviderStatus>({
    currentProvider: 'openai',
    availableProviders: [],
    providerStatus: { openai: false, gemini: false }
  });
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiTestResult, setAiTestResult] = useState<string>('');

  // Load settings from service on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await settingsService.getSettings();
        setSettings(savedSettings);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadSettings();
  }, []);

  // Load AI provider status on component mount
  useEffect(() => {
    const loadAIProviderStatus = async () => {
      try {
        const status = await settingsService.getAIProviderStatus();
        setAiProviderStatus(status);
      } catch (error) {
        console.error('Error loading AI provider status:', error);
      }
    };

    loadAIProviderStatus();
  }, []);

  // Save settings using service
  const saveSettings = async (newSettings: Settings) => {
    setIsLoading(true);
    setSaveStatus('saving');

    try {
      await settingsService.saveSettings(newSettings);
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

  const handleReportModeChange = async (mode: 'MANUAL' | 'AUTO') => {
    const newSettings = { ...settings, report_mode: mode };
    await saveSettings(newSettings);
  };

  const handleManualTimeChange = async (hours: number) => {
    const newSettings = { ...settings, report_manual_time: hours };
    await saveSettings(newSettings);
  };

  const handleAIProviderChange = async (provider: 'openai' | 'gemini') => {
    setIsLoadingAI(true);
    try {
      await settingsService.setAIProvider(provider);
      const status = await settingsService.getAIProviderStatus();
      setAiProviderStatus(status);
      setAiTestResult(`Successfully switched to ${provider}`);
      setTimeout(() => setAiTestResult(''), 3000);
    } catch (error) {
      console.error('Error switching AI provider:', error);
      setAiTestResult(`Error switching to ${provider}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setTimeout(() => setAiTestResult(''), 5000);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleTestAIConnection = async () => {
    setIsLoadingAI(true);
    try {
      const result = await settingsService.testAIConnection();
      setAiTestResult(`${result.provider} connection: ${result.connectionTest ? 'SUCCESS' : 'FAILED'}`);
      setTimeout(() => setAiTestResult(''), 5000);
    } catch (error) {
      console.error('Error testing AI connection:', error);
      setAiTestResult('Error testing connection');
      setTimeout(() => setAiTestResult(''), 5000);
    } finally {
      setIsLoadingAI(false);
    }
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
          </div>
        </div>

        {/* Report Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <DocumentTextIcon className="h-6 w-6 text-gray-400 mr-3" />
              <h2 className="text-lg font-medium text-gray-900">Report Settings</h2>
            </div>
          </div>
          <div className="px-6 py-4 space-y-6">
            {/* Report Mode */}
            <div>
              <label className="text-sm font-medium text-gray-900">Report Generation Mode</label>
              <p className="text-sm text-gray-500 mt-1 mb-3">
                Choose how reports are generated - automatically or manually after a specified time.
              </p>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="report_mode"
                    value="AUTO"
                    checked={settings.report_mode === 'AUTO'}
                    onChange={(e) => handleReportModeChange(e.target.value as 'MANUAL' | 'AUTO')}
                    disabled={isLoading}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 disabled:opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-900">Automatic</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="report_mode"
                    value="MANUAL"
                    checked={settings.report_mode === 'MANUAL'}
                    onChange={(e) => handleReportModeChange(e.target.value as 'MANUAL' | 'AUTO')}
                    disabled={isLoading}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 disabled:opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-900">Manual</span>
                </label>
              </div>
            </div>

            {/* Manual Time */}
            {settings.report_mode === 'MANUAL' && (
              <div>
                <label htmlFor="manual_time" className="text-sm font-medium text-gray-900">
                  Manual Report Generation Time
                </label>
                <p className="text-sm text-gray-500 mt-1 mb-2">
                  Set the number of hours after which manual reports should be generated (1-168 hours).
                </p>
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="number"
                    id="manual_time"
                    min="1"
                    max="168"
                    value={settings.report_manual_time}
                    onChange={(e) => handleManualTimeChange(Number(e.target.value))}
                    disabled={isLoading}
                    className="block w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-600">hours</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Provider Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <SparklesIcon className="h-6 w-6 text-gray-400 mr-3" />
              <h2 className="text-lg font-medium text-gray-900">AI Provider Settings</h2>
            </div>
          </div>
          <div className="px-6 py-4 space-y-6">
            {/* Current Provider */}
            <div>
              <label className="text-sm font-medium text-gray-900">Current AI Provider</label>
              <p className="text-sm text-gray-500 mt-1 mb-3">
                Choose which AI service to use for analyzing screenshots and generating reports.
              </p>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="ai_provider"
                    value="openai"
                    checked={aiProviderStatus.currentProvider === 'openai'}
                    onChange={(e) => handleAIProviderChange(e.target.value as 'openai' | 'gemini')}
                    disabled={isLoadingAI || !aiProviderStatus.providerStatus.openai}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 disabled:opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-900">OpenAI (GPT-4)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="ai_provider"
                    value="gemini"
                    checked={aiProviderStatus.currentProvider === 'gemini'}
                    onChange={(e) => handleAIProviderChange(e.target.value as 'openai' | 'gemini')}
                    disabled={isLoadingAI || !aiProviderStatus.providerStatus.gemini}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 disabled:opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-900">Google Gemini</span>
                </label>
              </div>
            </div>

            {/* Provider Status */}
            <div>
              <label className="text-sm font-medium text-gray-900">Provider Status</label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${aiProviderStatus.providerStatus.openai ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm text-gray-600">OpenAI: {aiProviderStatus.providerStatus.openai ? 'Available' : 'Not Configured'}</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${aiProviderStatus.providerStatus.gemini ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm text-gray-600">Gemini: {aiProviderStatus.providerStatus.gemini ? 'Available' : 'Not Configured'}</span>
                </div>
              </div>
            </div>

            {/* Test Connection */}
            <div>
              <button
                onClick={handleTestAIConnection}
                disabled={isLoadingAI}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoadingAI ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Testing...
                  </>
                ) : (
                  'Test AI Connection'
                )}
              </button>
            </div>

            {/* AI Test Result */}
            {aiTestResult && (
              <div className={`p-3 rounded-md text-sm ${
                aiTestResult.includes('Error') || aiTestResult.includes('FAILED') 
                  ? 'bg-red-50 text-red-700 border border-red-200' 
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}>
                {aiTestResult}
              </div>
            )}
          </div>
        </div>
            
        {/* Status indicator */}
        {saveStatus !== 'idle' && (
          <div className="bg-white shadow rounded-lg p-4">
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

        {/* Information Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CogIcon className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Settings Information</h3>
              <div className="mt-2 text-sm text-blue-700 space-y-1">
                <p>
                  <strong>Payment Enabled:</strong> {settings.paymentEnabled ? 'Yes' : 'No'}
                </p>
                <p>
                  <strong>Report Mode:</strong> {settings.report_mode}
                </p>
                {settings.report_mode === 'MANUAL' && (
                  <p>
                    <strong>Manual Time:</strong> {settings.report_manual_time} hours
                  </p>
                )}
                <p>
                  <strong>Current AI Provider:</strong> {aiProviderStatus.currentProvider === 'openai' ? 'OpenAI (GPT-4)' : 'Google Gemini'}
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
              <strong>Payment Settings:</strong>
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Payment Enabled: {settings.paymentEnabled ? 'Users must pay before report generation' : 'Reports can be generated without payment'}</li>
            </ul>
            
            <p className="mt-3">
              <strong>Report Generation:</strong>
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Mode: {settings.report_mode}</li>
              {settings.report_mode === 'MANUAL' && (
                <li>Manual reports will be generated after: {settings.report_manual_time} hours</li>
              )}
              {settings.report_mode === 'AUTO' && (
                <li>Reports will be generated automatically when requested</li>
              )}
            </ul>
            
            <p className="mt-3">
              <strong>AI Analysis:</strong>
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Provider: {aiProviderStatus.currentProvider === 'openai' ? 'OpenAI (GPT-4)' : 'Google Gemini'}</li>
              <li>OpenAI Available: {aiProviderStatus.providerStatus.openai ? 'Yes' : 'No'}</li>
              <li>Gemini Available: {aiProviderStatus.providerStatus.gemini ? 'Yes' : 'No'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 