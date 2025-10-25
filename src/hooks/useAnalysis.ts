import { useState, useEffect, useCallback, useRef } from 'react';
import reportService from '../services/reportService';
import settingsService from '../services/settingsService';
import { stepwiseAnalysisService } from '../services/stepwiseAnalysisService';
import { PagewiseAnalysisResult } from './usePagewiseAnalysis';
import { normalizeUrl } from '@/utils/settingsUtils';
import AnalyticsService from '../services/analyticsService';

// Helper function to validate URL format
const validateUrl = (url: string): boolean => {
  if (!url || url.trim() === '') return false;

  try {
    const normalizedUrl = normalizeUrl(url);
    const urlObj = new URL(normalizedUrl);

    // Check if it's a valid URL with a domain
    const hasValidHostname = Boolean(urlObj.hostname) && urlObj.hostname.includes('.');
    const hasValidProtocol = urlObj.protocol === 'http:' || urlObj.protocol === 'https:';

    return hasValidHostname && hasValidProtocol;
  } catch (error) {
    return false;
  }
};

interface UserInfo {
  name: string;
  email: string;
  mobile: string;
}

export interface Report {
  [key: string]: PagewiseAnalysisResult;
}

interface StatusMessage {
  description: string;
  step: number;
}

// Status messages for different analysis states
const statusMessages: Record<string, StatusMessage> = {
  'starting': { description: 'Initializing analysis...', step: 0 },
  'step-1-homepage-start': { description: 'Starting homepage analysis...', step: 1 },
  'screenshot-homepage': { description: 'Capturing homepage screenshot...', step: 1 },
  'analyze-homepage': { description: 'Analyzing homepage with AI...', step: 1 },
  'step-1-homepage-complete': { description: 'Homepage analysis complete', step: 1 },
  'step-2-collection-start': { description: 'Starting collection page analysis...', step: 2 },
  'screenshot-collection': { description: 'Capturing collection page screenshot...', step: 2 },
  'analyze-collection': { description: 'Analyzing collection page with AI...', step: 2 },
  'step-2-collection-complete': { description: 'Collection page analysis complete', step: 2 },
  'step-3-product-start': { description: 'Starting product page analysis...', step: 3 },
  'search-product-page': { description: 'Finding product page...', step: 3 },
  'screenshot-product': { description: 'Capturing product page screenshot...', step: 3 },
  'analyze-product': { description: 'Analyzing product page with AI...', step: 3 },
  'step-3-product-complete': { description: 'Product page analysis complete', step: 3 },
  'step-4-cart-start': { description: 'Starting cart page analysis...', step: 4 },
  'add-cart': { description: 'Adding product to cart...', step: 4 },
  'screenshot-cart': { description: 'Capturing cart page screenshot...', step: 4 },
  'analyze-cart': { description: 'Analyzing cart page with AI...', step: 4 },
  'step-4-cart-complete': { description: 'Cart page analysis complete', step: 4 },
  'cleanup': { description: 'Finalizing analysis...', step: 5 },
  'complete': { description: 'Analysis complete!', step: 5 },
  'all-steps-complete': { description: 'All analysis steps complete!', step: 5 },
  'wait-between-steps': { description: 'Taking a short break between steps...', step: 0 },
  'wait-for-previous-analyses': { description: 'Waiting for previous analyses to complete...', step: 0 },
  'fallback-to-puppeteer': { description: 'Using alternative analysis method...', step: 0 },
  'error-occurred': { description: 'An error occurred during analysis', step: 0 },
};

export function useAnalysis() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('');
  
  // Stepwise analysis state
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [steps, setSteps] = useState<Array<{name: string, completed: boolean, error?: string}>>([
    { name: 'validate_shopify', completed: false },
    { name: 'take_screenshot', completed: false },
    { name: 'analyze_gemini', completed: false },
    { name: 'analyze_checklist', completed: false },
  ]);
  const [status, setStatus] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [screenshotUrls, setScreenshotUrls] = useState<{ [key: string]: string }>({});
  const [screenshotsInProgress, setScreenshotsInProgress] = useState<{ [key: string]: boolean }>({});
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisInProgress, setAnalysisInProgress] = useState<{ [key: string]: boolean }>({});
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    mobile: '',
  });

  // Auto-save state
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);
  const [reportUrl, setReportUrl] = useState<string | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  // Timer state
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Download loading state
  const [downloadLoading, setDownloadLoading] = useState(false);

  // Use refs to track current state for completion checking
  const reportRef = useRef<Report | null>(null);
  const analysisInProgressRef = useRef<{ [key: string]: boolean }>({});

  // Update refs when state changes
  useEffect(() => {
    reportRef.current = report;
  }, [report]);

  useEffect(() => {
    analysisInProgressRef.current = analysisInProgress;
  }, [analysisInProgress]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, startTime]);

  // Reset all state
  const resetState = useCallback(() => {
    setUrl('');
    setLoading(false);
    setReport(null);
    setError(null);
    setActiveTab('');
    setCurrentStep(null);
    setSteps([
      { name: 'validate_shopify', completed: false },
      { name: 'take_screenshot', completed: false },
      { name: 'analyze_gemini', completed: false },
      { name: 'analyze_checklist', completed: false },
    ]);
    setStatus(null);
    setShowModal(false);
    setSuccessMessage(null);
    setScreenshotUrls({});
    setScreenshotsInProgress({});
    setAnalysisComplete(false);
    setAnalysisInProgress({});
    setCurrentReportId(null);
    setReportUrl(null);
    setElapsedTime(0);
    setTimerActive(false);
    setStartTime(null);
    setDownloadLoading(false);
  }, []);

  // Stepwise analysis method
  const startStepwiseAnalysis = useCallback(async (url: string, pageType: string = 'homepage') => {
    try {
      setLoading(true);
      setError(null);
      setCurrentStep(null);
      setSteps([
        { name: 'validate_shopify', completed: false },
        { name: 'take_screenshot', completed: false },
        { name: 'analyze_gemini', completed: false },
        { name: 'analyze_checklist', completed: false },
      ]);
      
      // Starting stepwise analysis
      
      // Use the new stepwise analysis service
      const analysisResult = await stepwiseAnalysisService.sequentialAnalysis(
        url, 
        pageType,
        (step, completed, data) => {
          // Step progress update
          setCurrentStep(step);
          setSteps(prev => prev.map(s => 
            s.name === step ? { ...s, completed, error: undefined } : s
          ));
        }
      );
      
      // Convert to the expected format
      const reportData = {
        [pageType]: analysisResult.data
      };
      
      setReport(reportData);
      setCurrentStep(null);
      setLoading(false);
      
      // Analysis completed successfully
      return analysisResult.data;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during analysis';
      setError(errorMessage);
      setCurrentStep(null);
      setLoading(false);
      console.error('[HOMEPAGE STEPWISE] Error:', err);
      throw err;
    }
  }, []);

  // startAnalysisAfterPayment - wrapper for stepwise analysis after payment
  const startAnalysisAfterPayment = useCallback(async (url: string) => {
    try {
      setUrl(url);
      await startStepwiseAnalysis(url, 'homepage');
    } catch (err) {
      console.error('[ANALYSIS AFTER PAYMENT] Error:', err);
      throw err;
    }
  }, [startStepwiseAnalysis]);

  // Handle URL change
  const handleUrlChange = useCallback((newUrl: string) => {
    setUrl(newUrl);
  }, []);

  // Format time helper
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateUrl(url)) {
      setError('Please enter a valid URL');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      setTimerActive(true);
      setStartTime(new Date());
      setElapsedTime(0);

      // Track URL entered event
      await AnalyticsService.trackEvent({
        eventType: 'url_entered',
        sessionId: AnalyticsService.getSessionId(),
        websiteUrl: url,
        websiteName: new URL(normalizeUrl(url)).hostname,
      });

      // Start stepwise analysis
      await startStepwiseAnalysis(url, 'homepage');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
      setTimerActive(false);
    }
  }, [url, startStepwiseAnalysis]);

  const handleUserInfoSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!report) {
      setError('No report available to download');
      return;
    }

    setDownloadLoading(true);
    
    try {
      const reportData = {
        report,
        url,
        userInfo,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000/api'}/download-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url_blob = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url_blob;
      link.download = `fixmystore-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url_blob);

      setShowModal(false);
      setSuccessMessage('Report downloaded successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);

      // Track report download
      await AnalyticsService.trackEvent({
        eventType: 'audit_completed',
        sessionId: AnalyticsService.getSessionId(),
        websiteUrl: url,
        websiteName: new URL(normalizeUrl(url)).hostname,
        reportId: currentReportId || 'unknown',
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download report');
    } finally {
      setDownloadLoading(false);
    }
  }, [report, url, userInfo, currentReportId]);

  const handleUserInfoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  }, []);

  return {
    // State
    url,
    setUrl,
    loading,
    report,
    error,
    activeTab,
    setActiveTab,
    currentStep,
    steps,
    status,
    showModal,
    setShowModal,
    successMessage,
    screenshotUrls,
    screenshotsInProgress,
    analysisComplete,
    analysisInProgress,
    userInfo,
    setUserInfo,
    currentReportId,
    reportUrl,
    autoSaveEnabled,
    setAutoSaveEnabled,
    elapsedTime,
    timerActive,
    downloadLoading,
    
    // Methods
    handleSubmit,
    handleUserInfoSubmit,
    handleUserInfoChange,
    resetState,
    startStepwiseAnalysis,
    startAnalysisAfterPayment,
    handleUrlChange,
    formatTime,
    statusMessages,
  };
}