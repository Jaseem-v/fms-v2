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
      
      // Start all analyses in parallel
      const pageTypes = ['homepage', 'collection', 'product', 'cart'];
      const eventSources = pageTypes.map(pageType => {
        switch (pageType) {
          case 'homepage':
            return analysisService.analyzeHomepage(domain);
          case 'collection':
            return analysisService.analyzeCollection(domain);
          case 'product':
            return analysisService.analyzeProduct(domain);
          case 'cart':
            return analysisService.analyzeCart(domain);
          default:
            throw new Error(`Unknown page type: ${pageType}`);
        }
      });

      // Handle each event source
      eventSources.forEach((eventSource, index) => {
        const pageType = pageTypes[index];
        
        eventSource.onmessage = (event) => {
          console.log(`[${pageType.toUpperCase()}] Received SSE data:`, event.data);
          
          try {
            const data = JSON.parse(event.data);
            
            if (data.type === 'analysis') {
              // Handle instant analysis data
              const analysisData = data.data;
              setReport(prev => ({
                ...prev,
                [pageType]: analysisData
              }));
              
              // Mark analysis as completed for this page type
              setAnalysisInProgress(prev => ({
                ...prev,
                [pageType]: false
              }));
              

              
              // Set the first page type as active tab if not set
              if (!activeTab) {
                setActiveTab(pageType);
              }
            } else if (data.status) {
              // Handle status updates
              if (data.status.startsWith('screenshot-url:')) {
                const parts = data.status.split(':');
                const url = parts.slice(2).join(':');
                setScreenshotUrls(prev => ({
                  ...prev,
                  [pageType]: url
                }));
                setScreenshotsInProgress(prev => ({
                  ...prev,
                  [pageType]: false
                }));
              } else if (data.status.startsWith('screenshot-')) {
                setScreenshotsInProgress(prev => ({
                  ...prev,
                  [pageType]: true
                }));
                setStatus(data.status);
              } else if (data.status.startsWith('analyze-')) {
                setAnalysisInProgress(prev => ({
                  ...prev,
                  [pageType]: true
                }));
                setStatus(data.status);
              }
            } else if (data.success !== undefined) {
              // Handle final result
              setTimerActive(false);
              
              if (data.success) {
                setReport(prev => ({
                  ...prev,
                  [pageType]: data.analysis
                }));
                

                
                if (!activeTab) {
                  setActiveTab(pageType);
                }
              } else {
                setError(data.error || 'Analysis failed');
              }
              
              eventSource.close();
            } else if (data.error) {
              setTimerActive(false);
              setError(data.error);
              eventSource.close();
            }
          } catch (parseError) {
            console.error(`[${pageType.toUpperCase()}] Error parsing SSE data:`, parseError);
            setTimerActive(false);
            setError('Invalid response from server');
            eventSource.close();
          }
        };

        eventSource.onerror = () => {
          console.error(`[${pageType.toUpperCase()}] EventSource failed`);
          setTimerActive(false);
          setError('Connection failed. Please try again.');
          eventSource.close();
        };
      });

      // Check if all analyses are complete
      const checkCompletion = () => {
        const currentReport = reportRef.current;
        const currentAnalysisInProgress = analysisInProgressRef.current;
        
        const allComplete = pageTypes.every(pageType => 
          currentReport?.[pageType] && !currentAnalysisInProgress[pageType]
        );
        
        if (allComplete) {
          setAnalysisComplete(true);
          setLoading(false);
          clearInterval(completionInterval);
        }
      };

      // Check completion every 2 seconds
      const completionInterval = setInterval(checkCompletion, 2000);
      
      // Cleanup interval after 5 minutes
      setTimeout(() => {
        clearInterval(completionInterval);
      }, 300000);

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
      link.download = `cro-analysis-report-${Date.now()}.pdf`;
      
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