import { useState, useEffect, useCallback, useRef } from 'react';
import analysisService from '../services/analysisService';
import shopifyValidationService from '../services/shopifyValidationService';
import reportService from '../services/reportService';
import settingsService from '../services/settingsService';
import { initialReport } from '@/utils/rawData';

// Helper function to normalize URL (add https:// if no protocol is present)
const normalizeUrl = (url: string): string => {
  if (!url || url.trim() === '') return url;

  // If URL already has a protocol, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Add https:// if no protocol is present
  return `https://${url}`;
};

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

export interface AnalysisItem {
  problem: string;
  solution: string;
  summary: string;
  screenshotUrl?: string;
  relevantImages?: {
    id: string;
    imageUrl: string;
    useCases: string[];
    uploadDate: string;
    fileName: string;
    createdAt: string;
    updatedAt: string;
    page: string;
    country?: string;
    industry?: string;
    url?: string;
  }[];
  relevantAppReferences?: {
    _id: string;
    id: string;
    name: string;
    iconUrl: string;
    description: string;
    useCases: string[];
    shopifyAppUrl: string;
    category: string;
    scrapedAt: string;
    createdAt: string;
    updatedAt: string;
    page: string;
    // country: string;
    industry?: string;
  }[];
}

export interface Report {
  [key: string]: AnalysisItem[];
}

interface StatusMessage {
  description: string;
  step: number;

}


export function useAnalysis() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('');
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

  // Shopify validation state
  const [validatingShopify, setValidatingShopify] = useState(false);
  const [shopifyValidationError, setShopifyValidationError] = useState<string | null>(null);

  // Timer state
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Download loading state
  const [downloadLoading, setDownloadLoading] = useState(false);

  // Use refs to track current state for completion checking
  const reportRef = useRef<Report | null>(null);
  const analysisInProgressRef = useRef<{ [key: string]: boolean }>({});
  const completedJobsRef = useRef<Set<string>>(new Set());
  const activeTabRef = useRef<string>('');

  // Update refs when state changes
  useEffect(() => {
    reportRef.current = report;
  }, [report]);

  useEffect(() => {
    analysisInProgressRef.current = analysisInProgress;
  }, [analysisInProgress]);

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  // Debug reportUrl changes
  useEffect(() => {
    console.log('[DEBUG] reportUrl changed:', reportUrl);
  }, [reportUrl]);

  const statusMessages: Record<string, StatusMessage> = {
    // Sequential step-by-step process messages
    'step-1-homepage-start': { description: '🚀 Starting Step 1: Homepage Analysis', step: 1 },
    'step-1-homepage-complete': { description: '✅ Step 1 Complete: Homepage Analysis', step: 1 },
    'step-2-collection-start': { description: '🚀 Starting Step 2: Collection Page Analysis', step: 2 },
    'step-2-collection-complete': { description: '✅ Step 2 Complete: Collection Page Analysis', step: 2 },
    'step-3-product-start': { description: '🚀 Starting Step 3: Product Page Analysis', step: 3 },
    'step-3-product-complete': { description: '✅ Step 3 Complete: Product Page Analysis', step: 3 },
    'step-4-cart-start': { description: '🚀 Starting Step 4: Cart Page Analysis', step: 4 },
    'step-4-cart-complete': { description: '✅ Step 4 Complete: Cart Page Analysis', step: 4 },
    'wait-between-steps': { description: '⏳ Waiting between steps...', step: 0 },
    'wait-for-previous-analyses': { description: '⏳ Waiting for previous analyses to complete...', step: 0 },
    'fallback-to-puppeteer': { description: '🔄 External API failed, using local screenshot...', step: 0 },
    'all-steps-complete': { description: '🎉 All Analysis Steps Completed!', step: 5 },
    'error-occurred': { description: '❌ An error occurred during analysis', step: 0 },
    'starting': { description: '🚀 Initializing sequential analysis...', step: 0 },
    'complete': { description: '✅ Analysis completed successfully!', step: 5 },

    // Individual process messages
    'screenshot-homepage': { description: '📸 Taking homepage screenshot...', step: 1 },
    'screenshot-collection': { description: '📸 Taking collection page screenshot...', step: 2 },
    'search-product-page': { description: '🔍 Searching for product page...', step: 3 },
    'screenshot-product': { description: '📸 Taking product page screenshot...', step: 3 },
    'add-cart': { description: '🛒 Adding product to cart...', step: 4 },
    'screenshot-cart': { description: '📸 Taking cart page screenshot...', step: 4 },
    'cart-error': { description: '❌ Could not add product to cart', step: 4 },
    'no-products': { description: '❌ No in-stock products found', step: 3 },
    'analyze-homepage': { description: '🧠 Analyzing home page...', step: 1 },
    'analyze-collection': { description: '🧠 Analyzing collection page...', step: 2 },
    'analyze-product': { description: '🧠 Analyzing product page...', step: 3 },
    'analyze-cart': { description: '🧠 Analyzing cart page...', step: 4 },
    'cleanup': { description: '🧹 Cleaning up temporary files...', step: 5 },
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerActive) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timerActive]);

  // Format time function
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Auto-save functions
  const createInitialReport = useCallback(async (websiteUrl: string) => {
    if (!autoSaveEnabled) return null;

    try {
      const result = await reportService.createReport({
        websiteUrl,
        analysisData: {},
        screenshots: {}
      });

      if (result.success && result.report) {
        setCurrentReportId(result.report.id);
        
        // Set report URL - use backend response or construct manually
        let reportUrl = result.reportUrl;
        if (!reportUrl && result.report.slug) {
          // Fallback: construct URL manually
          const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || window.location.origin;
          reportUrl = `${frontendUrl}/report/${result.report.slug}`;
        }
        
        setReportUrl(reportUrl || null);
        console.log('[AUTO-SAVE] Created initial report:', result.report.id, 'URL:', reportUrl);
        return result.report.id;
      }
    } catch (error) {
      console.error('[AUTO-SAVE] Error creating initial report:', error);
    }
    return null;
  }, [autoSaveEnabled]);

  const updateReportProgress = useCallback(async (currentStep: number, totalSteps: number, currentPage?: string) => {
    if (!autoSaveEnabled || !currentReportId) return;

    try {
      const completedPages = Object.keys(reportRef.current || {});
      
      await reportService.updateReportProgress(currentReportId, {
        currentStep,
        totalSteps,
        currentPage,
        completedPages
      });
      
      console.log('[AUTO-SAVE] Updated progress:', { currentStep, totalSteps, currentPage });
    } catch (error) {
      console.error('[AUTO-SAVE] Error updating progress:', error);
    }
  }, [autoSaveEnabled, currentReportId]);

  const updateReportAnalysisData = useCallback(async (newReportData: Report) => {
    if (!autoSaveEnabled || !currentReportId) return;

    try {
      await reportService.updateReportAnalysisData(currentReportId, newReportData);
      console.log('[AUTO-SAVE] Updated analysis data');
    } catch (error) {
      console.error('[AUTO-SAVE] Error updating analysis data:', error);
    }
  }, [autoSaveEnabled, currentReportId]);

  const updateReportScreenshots = useCallback(async (newScreenshots: { [key: string]: string }) => {
    if (!autoSaveEnabled || !currentReportId) return;

    try {
      const screenshotsData = Object.entries(newScreenshots).reduce((acc, [pageType, url]) => {
        acc[pageType] = {
          filename: `${pageType}-screenshot.png`,
          url
        };
        return acc;
      }, {} as { [key: string]: { filename: string; url: string } });

      await reportService.updateReportScreenshots(currentReportId, screenshotsData);
      console.log('[AUTO-SAVE] Updated screenshots');
    } catch (error) {
      console.error('[AUTO-SAVE] Error updating screenshots:', error);
    }
  }, [autoSaveEnabled, currentReportId]);

  const completeReport = useCallback(async () => {
    if (!autoSaveEnabled || !currentReportId) return;

    try {
      const result = await reportService.completeReport(currentReportId);
      console.log('[AUTO-SAVE] Marked report as completed');
      
      // Update report URL if not already set
      if (!reportUrl && result.reportUrl) {
        setReportUrl(result.reportUrl);
        console.log('[AUTO-SAVE] Updated report URL:', result.reportUrl);
      }
    } catch (error) {
      console.error('[AUTO-SAVE] Error completing report:', error);
    }
  }, [autoSaveEnabled, currentReportId, reportUrl]);

  const failReport = useCallback(async () => {
    if (!autoSaveEnabled || !currentReportId) return;

    try {
      await reportService.failReport(currentReportId);
      console.log('[AUTO-SAVE] Marked report as failed');
    } catch (error) {
      console.error('[AUTO-SAVE] Error failing report:', error);
    }
  }, [autoSaveEnabled, currentReportId]);

  const resetState = useCallback(() => {
    setLoading(true);
    setError(null);
    setShopifyValidationError(null); // Clear any previous validation errors
    setReport(null);
    setActiveTab('');
    setStatus(null);
    setScreenshotUrls({});
    setScreenshotsInProgress({});
    setAnalysisComplete(false);
    setAnalysisInProgress({});

    // Reset completed jobs tracking
    completedJobsRef.current.clear();

    // Start timer
    setElapsedTime(0);
    setStartTime(new Date());
    setTimerActive(true);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    resetState();

    try {
      // First, validate if it's a Shopify site
      setValidatingShopify(true);
      console.log('[SHOPIFY VALIDATION] Starting validation for URL:', url);

      const validationResult = await shopifyValidationService.validateShopifySite(url);

      if (!validationResult.isShopify) {
        setShopifyValidationError(validationResult.message || 'This does not appear to be a Shopify site');
        setValidatingShopify(false);
        setLoading(false);
        setTimerActive(false);
        return;
      }

      console.log('[SHOPIFY VALIDATION] ✅ Validated as Shopify site');
      setValidatingShopify(false);

      // Validate and normalize URL
      if (!validateUrl(url)) {
        setError('Please enter a valid website URL (e.g., example.com or https://example.com)');
        setValidatingShopify(false);
        setLoading(false);
        setTimerActive(false);
        return;
      }

      const normalizedUrl = normalizeUrl(url);

      // Check payment settings
      const isPaymentEnabled = settingsService.isPaymentEnabled();

      if (isPaymentEnabled) {
        // Redirect to payment page if payment is enabled
        console.log('[PAYMENT] Payment is enabled, redirecting to payment page');
        const encodedUrl = encodeURIComponent(normalizedUrl);
        window.location.href = `/payment?url=${encodedUrl}`;
      } else {
        // Start analysis directly if payment is disabled
        console.log('[PAYMENT] Payment is disabled, starting analysis directly');
        setUrl(normalizedUrl);
        startAnalysisAfterPayment(normalizedUrl);
      }

    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setError('An error occurred. Please try again.');
      setValidatingShopify(false);
      setLoading(false);
      setTimerActive(false);
    }
  }, [url, resetState, setValidatingShopify, setShopifyValidationError, setLoading, setTimerActive, setError]);

  const handleUserInfoSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setDownloadLoading(true);
      setError(null);
      setSuccessMessage('Generating your PDF report...');

      // Validate URL before using it
      if (!url) {
        throw new Error('No URL provided for report generation');
      }

      const pdfBlob = await analysisService.downloadReport(report, url, userInfo);

      // Create a download link
      const downloadUrl = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;

      // Create filename with website URL and "audit report"
      try {
        const normalizedUrl = normalizeUrl(url);
        const domain = new URL(normalizedUrl).hostname;
        const cleanDomain = domain.replace(/[^a-zA-Z0-9.-]/g, '-');
        const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        link.download = `${cleanDomain}-audit-report-${timestamp}.pdf`;
      } catch (urlError) {
        // Fallback if URL parsing fails
        const timestamp = new Date().toISOString().split('T')[0];
        link.download = `audit-report-${timestamp}.pdf`;
      }

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL
      window.URL.revokeObjectURL(downloadUrl);

      // Show success message
      setSuccessMessage('Your PDF report has been downloaded successfully!');
      setDownloadLoading(false);
      setShowModal(false);

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (error) {
      console.error('Error downloading report:', error);
      setError('Failed to download report. Please try again.');
      setDownloadLoading(false);
    }
  }, [report, url, userInfo]);

  const handleUserInfoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleUrlChange = useCallback((newUrl: string) => {
    setUrl(newUrl);
    // Clear validation errors when user starts typing a new URL
    if (shopifyValidationError) {
      setShopifyValidationError(null);
    }
  }, [shopifyValidationError]);

  const startAnalysisAfterPayment = useCallback(async (analysisUrl?: string) => {
    try {
      // Use the provided URL or fall back to the state URL
      const urlToAnalyze = analysisUrl || url;

      if (!urlToAnalyze) {
        throw new Error('No URL provided for analysis');
      }

      // Validate URL format before proceeding
      if (!validateUrl(urlToAnalyze)) {
        throw new Error('Invalid URL format. Please provide a valid website URL.');
      }

      const normalizedUrl = normalizeUrl(urlToAnalyze);
      const domain = new URL(normalizedUrl).hostname;

      console.log('[SEQUENTIAL] Starting sequential analysis for domain:', domain);

      // Create initial report for auto-saving
      const reportId = await createInitialReport(normalizedUrl);
      if (reportId) {
        console.log('[AUTO-SAVE] Initial report created with ID:', reportId);
      }

      // Start sequential analysis
      const orderId = new URLSearchParams(window.location.search).get('order_id');
      console.log('[SEQUENTIAL] Starting analysis with orderId:', orderId);
      const result = await analysisService.startSequentialAnalysis(domain, orderId || undefined);
      const jobId = result.jobId;

      console.log('[SEQUENTIAL] Started with jobId:', jobId);

      // Poll for sequential analysis results
      const pollInterval = setInterval(async () => {
        try {
          const status = await analysisService.getSequentialAnalysisStatus(jobId);
          console.log('[SEQUENTIAL] Status:', status);

          if (status.error) {
            console.error('[SEQUENTIAL] Analysis error:', status.error);
            setError(`Analysis failed: ${status.error}`);
            // Auto-save failed status
            await failReport();
            clearInterval(pollInterval);
            return;
          }

          // Update status
          if (status.status) {
            setStatus(status.status);

            // Auto-save progress based on status
            const currentStatus = statusMessages[status.status];
            if (currentStatus) {
              updateReportProgress(currentStatus.step, 5, status.status.includes('-') ? status.status.split('-')[1] : undefined);
            }

            // Handle screenshot URL updates
            if (status.status.startsWith('screenshot-url:')) {
              const parts = status.status.split(':');
              if (parts.length >= 4) {
                const pageType = parts[1];
                const screenshotUrl = parts.slice(2).join(':'); // Rejoin the URL parts
                console.log('[SCREENSHOT] Received URL for', pageType, ':', screenshotUrl);
                setScreenshotUrls(prev => {
                  const newScreenshots = {
                    ...prev,
                    [pageType]: screenshotUrl
                  };
                  // Auto-save screenshots
                  updateReportScreenshots(newScreenshots);
                  return newScreenshots;
                });
                setScreenshotsInProgress(prev => ({
                  ...prev,
                  [pageType]: false
                }));
              }
            }

            // Handle screenshot progress
            if (status.status.startsWith('screenshot-') && !status.status.startsWith('screenshot-url:')) {
              const pageType = status.status.replace('screenshot-', '');
              setScreenshotsInProgress(prev => ({
                ...prev,
                [pageType]: true
              }));
            }

            // Handle analysis progress
            if (status.status.startsWith('analyze-')) {
              const pageType = status.status.replace('analyze-', '');
              setAnalysisInProgress(prev => ({
                ...prev,
                [pageType]: true
              }));
            }
          }

          // Check if analysis is complete
          if (status.complete && status.analysis) {
            console.log('[COMPLETE] Final analysis data:', status.analysis);
            console.log('[COMPLETE] Screenshot URLs:', screenshotUrls);
            console.log('[COMPLETE] Screenshots from backend:', status.screenshots);

            // Add screenshot URLs to final analysis data
            const finalReport = { ...status.analysis };
            Object.keys(status.analysis).forEach(pageType => {
              // Try to get screenshot URL from backend screenshots first, then fallback to status updates
              let screenshotUrl = null;
              if (status.screenshots && status.screenshots[pageType]) {
                const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace('/api', '') || 'http://localhost:4000';
                screenshotUrl = `${backendBaseUrl}/screenshots/${status.screenshots[pageType].filename}`;
                console.log(`[COMPLETE] Using backend screenshot for ${pageType}:`, screenshotUrl);
              } else {
                screenshotUrl = screenshotUrls[pageType];
                console.log(`[COMPLETE] Using status screenshot for ${pageType}:`, screenshotUrl);
              }

              if (screenshotUrl && status.analysis[pageType]) {
                // Add screenshot URL to each analysis item
                finalReport[pageType] = status.analysis[pageType].map((item: any) => ({
                  ...item,
                  screenshotUrl: screenshotUrl
                }));
              }
            });

            console.log('[COMPLETE] Final report with screenshots:', finalReport);
            setReport(finalReport);

            // Handle report URL from status response
            if (status.reportUrl) {
              console.log('[COMPLETE] Report URL from status:', status.reportUrl);
              setReportUrl(status.reportUrl);
            }

            // Auto-save final analysis data
            await updateReportAnalysisData(finalReport);
            await completeReport();

            // Create report in database (legacy - keeping for backward compatibility)
            try {
              const reportResult = await reportService.createReport({
                websiteUrl: urlToAnalyze,
                analysisData: finalReport,
                screenshots: status.screenshots || {},
                userInfo: {
                  name: localStorage.getItem('customerName') || '',
                  email: localStorage.getItem('customerEmail') || '',
                },
                orderId: new URLSearchParams(window.location.search).get('order_id') || undefined,
              });

              if (reportResult.success && reportResult.reportUrl) {
                console.log('[REPORT] Report created successfully:', reportResult.reportUrl);
              } else {
                console.error('[REPORT] Failed to create report:', reportResult.message);
              }
            } catch (error) {
              console.error('[REPORT] Error creating report:', error);
            }

            // Clear all analysis progress
            setAnalysisInProgress({
              homepage: false,
              collection: false,
              product: false,
              cart: false
            });

            // Set the first page type as active tab only if no tab is currently selected
            const pageTypes = Object.keys(status.analysis);
            if (pageTypes.length > 0 && (!activeTabRef.current || activeTabRef.current === '')) {
              setActiveTab(pageTypes[0]);
            }

            clearInterval(pollInterval);
            setAnalysisComplete(true);
            setLoading(false);
            setTimerActive(false);
            console.log('[SEQUENTIAL] All analyses completed!');
          } else if (status.complete && status.error) {
            // Handle error completion
            setAnalysisInProgress({
              homepage: false,
              collection: false,
              product: false,
              cart: false
            });

            clearInterval(pollInterval);
            setError(`Analysis failed: ${status.error}`);
            setLoading(false);
            setTimerActive(false);

            console.log('[SEQUENTIAL] Analysis failed:', status.error);
          }

          // Update report incrementally if analysis data is available
          if (status.analysis && Object.keys(status.analysis).length > 0) {
            console.log('[SEQUENTIAL] Updating report with:', status.analysis);
            console.log('[SCREENSHOT] Current screenshot URLs:', screenshotUrls);
            console.log('[SCREENSHOT] Backend screenshots:', status.screenshots);
            setReport(prevReport => {
              const newReport = { ...prevReport };

              // Add screenshot URLs to analysis data
              Object.keys(status.analysis).forEach(pageType => {
                // Try to get screenshot URL from backend screenshots first, then fallback to status updates
                let screenshotUrl = null;
                if (status.screenshots && status.screenshots[pageType]) {
                  const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace('/api', '') || 'http://localhost:4000';
                  screenshotUrl = `${backendBaseUrl}/screenshots/${status.screenshots[pageType].filename}`;
                  console.log(`[SCREENSHOT] Using backend screenshot for ${pageType}:`, screenshotUrl);
                } else {
                  screenshotUrl = screenshotUrls[pageType];
                  console.log(`[SCREENSHOT] Using status screenshot for ${pageType}:`, screenshotUrl);
                }

                if (screenshotUrl && status.analysis[pageType]) {
                  // Add screenshot URL to each analysis item
                  newReport[pageType] = status.analysis[pageType].map((item: any) => ({
                    ...item,
                    screenshotUrl: screenshotUrl
                  }));
                } else {
                  newReport[pageType] = status.analysis[pageType];
                }
              });

              console.log('[SEQUENTIAL] New report state with screenshots:', newReport);
              return newReport;
            });

            // Handle report URL from status response (for incremental updates)
            if (status.reportUrl && !reportUrl) {
              console.log('[SEQUENTIAL] Report URL from status (incremental):', status.reportUrl);
              setReportUrl(status.reportUrl);
            }

            // Set active tab only if no tab is currently selected by user
            if (!activeTabRef.current || activeTabRef.current === '') {
              const pageTypes = Object.keys(status.analysis);
              if (pageTypes.length > 0) {
                setActiveTab(pageTypes[0]);
              }
            }
          }
        } catch (error) {
          console.error('[SEQUENTIAL] Error polling for status:', error);
          setError('Failed to check analysis status');
          clearInterval(pollInterval);
          setLoading(false);
          setTimerActive(false);
        }
      }, 2000); // Poll every 2 seconds

      // Cleanup interval after 10 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
      }, 600000);

    } catch (err) {
      setTimerActive(false);
      setValidatingShopify(false);

      // Check if it's a validation error
      if (err instanceof Error && err.message.includes('Shopify')) {
        setShopifyValidationError(err.message);
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
      setLoading(false);
    }
  }, [url, report, analysisInProgress, resetState]);

  return {
    // State
    url,
    setUrl,
    loading,
    report,
    error,
    activeTab,
    setActiveTab,
    status,
    showModal,
    setShowModal,
    successMessage,
    screenshotUrls,
    screenshotsInProgress,
    analysisComplete,
    analysisInProgress,
    userInfo,
    elapsedTime,
    timerActive,
    validatingShopify,
    shopifyValidationError,
    downloadLoading,
    currentReportId,
    reportUrl,
    autoSaveEnabled,

    // Functions
    handleSubmit,
    handleUserInfoSubmit,
    handleUserInfoChange,
    handleUrlChange,
    formatTime,
    statusMessages,
    startAnalysisAfterPayment,
  };
} 