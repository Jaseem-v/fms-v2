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
    'screenshot-homepage': { description: 'Checking the home page...', step: 1 },
    'screenshot-collection': { description: 'Checking the collection page...', step: 3 },
    'search-products': { description: 'Searching for available products...', step: 5 },
    'screenshot-product': { description: 'Checking the product page...', step: 6 },
    'add-cart': { description: 'Adding product to cart...', step: 9 },
    'screenshot-cart': { description: 'Checking the cart page...', step: 10 },
    'cart-error': { description: 'Could not add product to cart', step: 11 },
    'no-products': { description: 'No in-stock products found', step: 8 },
    'analyze-homepage': { description: 'Analyzing home page...', step: 2 },
    'analyze-collection': { description: 'Analyzing collection page...', step: 4 },
    'analyze-product': { description: 'Analyzing product page...', step: 7 },
    'analyze-cart': { description: 'Analyzing cart page...', step: 12 },
    cleanup: { description: 'Cleaning up temporary files...', step: 13 },
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
      
      // Start all analyses in parallel using polling
      const pageTypes = ['homepage', 'collection', 'product', 'cart'];
      const jobIds: { [key: string]: string } = {};

      // Start analysis for each page type
      for (const pageType of pageTypes) {
        try {
          let jobId: string;
          switch (pageType) {
            case 'homepage':
              const homepageResult = await analysisService.startHomepageAnalysis(domain);
              jobId = homepageResult.jobId;
              break;
            case 'collection':
              const collectionResult = await analysisService.startCollectionAnalysis(domain);
              jobId = collectionResult.jobId;
              break;
            case 'product':
              const productResult = await analysisService.startProductAnalysis(domain);
              jobId = productResult.jobId;
              break;
            case 'cart':
              const cartResult = await analysisService.startCartAnalysis(domain);
              jobId = cartResult.jobId;
              break;
            default:
              throw new Error(`Unknown page type: ${pageType}`);
          }
          
          jobIds[pageType] = jobId;
          console.log(`[${pageType.toUpperCase()}] Started analysis with jobId:`, jobId);
        } catch (error) {
          console.error(`[${pageType.toUpperCase()}] Failed to start analysis:`, error);
          setError(`Failed to start ${pageType} analysis`);
          return;
        }
      }

      // Poll for results
      const pollInterval = setInterval(async () => {
        try {
          for (const pageType of pageTypes) {
            const jobId = jobIds[pageType];
            if (!jobId) continue;

            const status = await analysisService.getAnalysisStatus(pageType, jobId);
            console.log(`[${pageType.toUpperCase()}] Status:`, status);

            if (status.error) {
              console.error(`[${pageType.toUpperCase()}] Analysis error:`, status.error);
              setError(`Analysis failed for ${pageType}: ${status.error}`);
              clearInterval(pollInterval);
              return;
            }

            // Update status
            if (status.status) {
              setStatus(status.status);
              
              // Handle screenshot URL
              if (status.screenshotUrl) {
                setScreenshotUrls(prev => ({
                  ...prev,
                  [pageType]: status.screenshotUrl
                }));
                setScreenshotsInProgress(prev => ({
                  ...prev,
                  [pageType]: false
                }));
              }

              // Handle screenshot progress
              if (status.status.startsWith('screenshot-')) {
                setScreenshotsInProgress(prev => ({
                  ...prev,
                  [pageType]: true
                }));
              }

              // Handle analysis progress
              if (status.status.startsWith('analyze-')) {
                setAnalysisInProgress(prev => ({
                  ...prev,
                  [pageType]: true
                }));
              }
            }

            // Check if analysis is complete
            if (status.complete && status.analysis) {
              setReport(prev => ({
                ...prev,
                [pageType]: status.analysis
              }));
              
              // Clear analysis progress for this page type
              setAnalysisInProgress(prev => ({
                ...prev,
                [pageType]: false
              }));

              // Track completion
              completedJobsRef.current.add(pageType);

              // Set the first page type as active tab if not set
              if (!activeTab) {
                setActiveTab(pageType);
              }

              console.log(`[${pageType.toUpperCase()}] Analysis completed`);
            } else if (status.complete && status.error) {
              // Handle error completion
              setAnalysisInProgress(prev => ({
                ...prev,
                [pageType]: false
              }));
              
              // Track completion even for errors
              completedJobsRef.current.add(pageType);
              
              console.log(`[${pageType.toUpperCase()}] Analysis failed:`, status.error);
            }
          }

          // Check if all analyses are complete
          const allComplete = pageTypes.every(pageType => 
            completedJobsRef.current.has(pageType)
          );
          
          console.log('Completion check:', {
            completedJobs: Array.from(completedJobsRef.current),
            allComplete,
            pageTypes
          });
          
          if (allComplete) {
            clearInterval(pollInterval);
            setAnalysisComplete(true);
            setLoading(false);
            setTimerActive(false);
            console.log('All analyses completed!');
          }
        } catch (error) {
          console.error('Error polling for status:', error);
          setError('Failed to check analysis status');
          clearInterval(pollInterval);
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