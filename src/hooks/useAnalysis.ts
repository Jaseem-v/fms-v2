import { useState, useEffect, useCallback, useRef } from 'react';
import analysisService from '../services/analysisService';

interface UserInfo {
  name: string;
  email: string;
  mobile: string;
}

interface AnalysisItem {
  problem: string;
  solution: string;
}

interface Report {
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
  const [screenshotUrls, setScreenshotUrls] = useState<{[key: string]: string}>({});
  const [screenshotsInProgress, setScreenshotsInProgress] = useState<{[key: string]: boolean}>({});
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisInProgress, setAnalysisInProgress] = useState<{[key: string]: boolean}>({});
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    mobile: '',
  });
  
  // Timer state
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Use refs to track current state for completion checking
  const reportRef = useRef<Report | null>(null);
  const analysisInProgressRef = useRef<{[key: string]: boolean}>({});
  const completedJobsRef = useRef<Set<string>>(new Set());
  
  // Update refs when state changes
  useEffect(() => {
    reportRef.current = report;
  }, [report]);
  
  useEffect(() => {
    analysisInProgressRef.current = analysisInProgress;
  }, [analysisInProgress]);

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

  const resetState = useCallback(() => {
    setLoading(true);
    setError(null);
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
      const domain = new URL(url).hostname;
      
      console.log('[SEQUENTIAL] Starting sequential analysis for domain:', domain);
      
      // Start sequential analysis
      const result = await analysisService.startSequentialAnalysis(domain);
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
            clearInterval(pollInterval);
            return;
          }

          // Update status
          if (status.status) {
            setStatus(status.status);
            
            // Handle screenshot URL updates
            if (status.status.startsWith('screenshot-url:')) {
              const [_, pageType, screenshotUrl] = status.status.split(':');
              if (pageType && screenshotUrl) {
                setScreenshotUrls(prev => ({
                  ...prev,
                  [pageType]: screenshotUrl
                }));
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
            setReport(status.analysis);
            
            // Clear all analysis progress
            setAnalysisInProgress({
              homepage: false,
              collection: false,
              product: false,
              cart: false
            });

            // Set the first page type as active tab
            const pageTypes = Object.keys(status.analysis);
            if (pageTypes.length > 0 && !activeTab) {
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
            setReport(prevReport => {
              const newReport = { ...prevReport, ...status.analysis };
              console.log('[SEQUENTIAL] New report state:', newReport);
              return newReport;
            });
            
            // Set active tab only if not already set by user
            if (!activeTab || activeTab === '') {
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
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  }, [url, activeTab, report, analysisInProgress, resetState]);

  const handleUserInfoSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setShowModal(false);
      setError(null);
      setSuccessMessage('Generating your PDF report...');

      const pdfBlob = await analysisService.downloadReport(report, url, userInfo);

      // Create a download link
      const downloadUrl = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      // Create filename with website URL and "audit report"
      const domain = new URL(url).hostname;
      const cleanDomain = domain.replace(/[^a-zA-Z0-9.-]/g, '-');
      const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      link.download = `${cleanDomain}-audit-report-${timestamp}.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL
      window.URL.revokeObjectURL(downloadUrl);

      // Show success message
      setSuccessMessage('Your PDF report has been downloaded successfully!');
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (error) {
      console.error('Error downloading report:', error);
      setError('Failed to download report. Please try again.');
    }
  }, [report, url, userInfo]);

  const handleUserInfoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    
    // Functions
    handleSubmit,
    handleUserInfoSubmit,
    handleUserInfoChange,
    formatTime,
    statusMessages,
  };
} 