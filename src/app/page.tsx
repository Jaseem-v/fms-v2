'use client';

import { useState, useEffect } from 'react';

interface UserInfo {
  name: string;
  email: string;
  mobile: string;
}

interface StatusMessage {
  description: string;
  step: number;
}

interface AnalysisItem {
  problem: string;
  solution: string;
}

interface Report {
  [key: string]: AnalysisItem[];
}

export default function Home() {
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
  const [selectedScreenshot, setSelectedScreenshot] = useState<{pageType: string, url: string} | null>(null);
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
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Debug logging for analysisComplete state
  useEffect(() => {
    console.log('[FRONTEND] Analysis complete state changed:', analysisComplete);
  }, [analysisComplete]);

  // Keyboard support for screenshot modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedScreenshot) {
        setSelectedScreenshot(null);
      }
    };

    if (selectedScreenshot) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedScreenshot]);

  console.log("screenshotUrls", screenshotUrls);
  

  const statusMessages: Record<string, StatusMessage> = {
    'screenshot-homepage': {
      description: 'Taking screenshot of the home page...',
      step: 1,
    },
    'screenshot-collection': {
      description: 'Taking screenshot of the collection page...',
      step: 3,
    },
    'search-products': {
      description: 'Searching for available products...',
      step: 5,
    },
    'screenshot-product': {
      description: 'Taking screenshot of the product page...',
      step: 6,
    },
    'add-cart': {
      description: 'Adding product to cart...',
      step: 9,
    },
    'screenshot-cart': {
      description: 'Taking screenshot of the cart page...',
      step: 10,
    },
    'cart-error': {
      description: 'Could not add product to cart',
      step: 11,
    },
    'no-products': {
      description: 'No in-stock products found',
      step: 8,
    },
    'analyze-homepage': {
      description: 'Analyzing home page...',
      step: 2,
    },
    'analyze-collection': {
      description: 'Analyzing collection page...',
      step: 4,
    },
    'analyze-product': {
      description: 'Analyzing product page...',
      step: 7,
    },
    'analyze-cart': {
      description: 'Analyzing cart page...',
      step: 12,
    },
    cleanup: {
      description: 'Cleaning up temporary files...',
      step: 13,
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

    try {
      const eventSource = new EventSource(
        `/api/ecommerce-screenshots?domain=${encodeURIComponent(
          new URL(url).hostname
        )}`
      );

      // Add timeout to prevent getting stuck
      // const timeout = setTimeout(() => {
      //   console.log('[FRONTEND] Analysis timeout - closing connection');
      //   eventSource.close();
      //   setError('Analysis timed out. Please try again.');
      //   setLoading(false);
      // }, 300000); // 5 minutes timeout

      eventSource.onmessage = (event) => {
        console.log('[FRONTEND] Received SSE data:', event.data);
        
        try {
          const data = JSON.parse(event.data);
          console.log('[FRONTEND] Parsed data:', data);
                      console.log('[FRONTEND] Parsed data:', data);

            if (data.type === 'analysis') {
              // Handle instant analysis data
              const pageType = data.pageType;
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
            console.log('[FRONTEND] Status update:', data.status);
            // Check if this is a screenshot URL message
            if (data.status.startsWith('screenshot-url:')) {
              const parts = data.status.split(':');
              const pageType = parts[1];
              const url = parts.slice(2).join(':'); // Rejoin the rest as URL (handles http://)
              console.log('[FRONTEND] Screenshot URL for', pageType, ':', url);
              setScreenshotUrls(prev => ({
                ...prev,
                [pageType]: url
              }));
              // Mark screenshot as completed
              setScreenshotsInProgress(prev => ({
                ...prev,
                [pageType]: false
              }));

            } else if (data.status.startsWith('screenshot-')) {
              // Extract page type from screenshot status
              const pageType = data.status.replace('screenshot-', '');
              console.log('[FRONTEND] Screenshot in progress for:', pageType);
              setScreenshotsInProgress(prev => ({
                ...prev,
                [pageType]: true
              }));
              setStatus(data.status);
            } else if (data.status.startsWith('analyze-')) {
              // Mark analysis as in progress
              const pageType = data.status.replace('analyze-', '');
              console.log('[FRONTEND] Analysis in progress for:', pageType);
              setAnalysisInProgress(prev => ({
                ...prev,
                [pageType]: true
              }));
              setStatus(data.status);
            } else if (data.status === 'cleanup') {
              console.log('[FRONTEND] Cleanup status received - analysis complete');
              setStatus('Analysis complete - preparing results...');
              setAnalysisComplete(true);
            } else {
              console.log('[FRONTEND] General status update:', data.status);
              setStatus(data.status);
            }
          } else if (data.success !== undefined) {
            console.log('[FRONTEND] Final result received:', data);
            console.log('[FRONTEND] Success value:', data.success);
            console.log('[FRONTEND] Result data (analysis):', data.result);
            console.log('[FRONTEND] Screenshots data:', data.screenshots);
            // clearTimeout(timeout); // Clear timeout on success
            
            // Stop timer
            setTimerActive(false);
            
            if (data.success) {
              console.log('[FRONTEND] Final result received, merging with instant data');
              // Merge final result with any instant analysis data we already have
              setReport(prev => ({
                ...prev,
                ...data.result
              }));
              
              // Set the first page type as active tab if not already set
              if (!activeTab && data.result && Object.keys(data.result).length > 0) {
                const firstPageType = Object.keys(data.result)[0];
                console.log('[FRONTEND] Setting active tab to:', firstPageType);
                setActiveTab(firstPageType);
              }
              setLoading(false);
              setAnalysisComplete(true);
              console.log('[FRONTEND] Analysis completed successfully');
            } else {
              console.log('[FRONTEND] Analysis failed with error:', data.error);
              setError(data.error || 'Analysis failed');
              setLoading(false);
            }
            eventSource.close();
            console.log('[FRONTEND] EventSource closed');
          } else if (data.error) {
            console.log('[FRONTEND] Error received:', data.error);
            // clearTimeout(timeout); // Clear timeout on error
            
            // Stop timer
            setTimerActive(false);
            
            setError(data.error);
            eventSource.close();
            setLoading(false);
          } else {
            console.log('[FRONTEND] Unknown data format:', data);
            setStatus(null);
          }
        } catch (parseError) {
          console.error('[FRONTEND] Error parsing SSE data:', parseError);
          console.error('[FRONTEND] Raw data was:', event.data);
          
          // Stop timer
          setTimerActive(false);
          
          setError('Invalid response from server');
          eventSource.close();
          setLoading(false);
        }
      };

      eventSource.onerror = () => {
        console.error('[FRONTEND] EventSource failed');
        // clearTimeout(timeout); // Clear timeout on error
        
        // Stop timer
        setTimerActive(false);
        
        setError('Connection failed. Please try again.');
        eventSource.close();
        setLoading(false);
      };
    } catch (err) {
      // Stop timer
      setTimerActive(false);
      
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const handleUserInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Show success message immediately
      setShowModal(false);
      setError(null);
      setSuccessMessage('Your report will be sent to your email shortly!');

      // Send the request without waiting for response
      fetch('/api/send-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          report,
          url,
          userInfo,
        }),
      }).catch(() => {
        console.error('Error sending report');
        setSuccessMessage(null);
        setError('Failed to send report. Please try again.');
      });
    } catch {
      setError('Failed to process your request. Please try again.');
    }
  };

  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const renderAnalysisItem = (item: AnalysisItem, index: number) => {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
            {index + 1}
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  🤔 Problem
                </span>
              </div>
              <p className="text-gray-700">{item.problem}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  💡 Solution
                </span>
              </div>
              <p className="text-gray-700">{item.solution}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;25&quot; height=&quot;25&quot; viewBox=&quot;0 0 25 25&quot; fill=&quot;none&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cpath d=&quot;M1 1h1v1H1V1zm0 23h1v1H1v-1zm23 0h1v1h-1v-1zm0-23h1v1h-1V1z&quot; stroke=&quot;%23e5e7eb&quot; stroke-width=&quot;0.5&quot;/%3E%3C/svg%3E')] opacity-30"></div>
      
      {/* Gradient Blob */}
      <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-80 w-[1000px] h-[500px] bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full blur-[200px] opacity-20"></div>

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-6xl min-h-screen flex flex-col justify-center">
        <header className="text-center mb-12">
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              🚀 Instant Analysis
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              🎯 Actionable Insights
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              ⏰ Real-Time Results
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CRO Analysis
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 transform rotate-1 rounded-lg"></div>
            </span>{' '}
            for Your Online Store
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Why aren&apos;t your visitors buying? Get{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
              clear answers
            </span>{' '}
            and{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
              simple fixes
            </span>{' '}
            to turn{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
              browsers into buyers
            </span>
            .{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
              No guesswork
            </span>{' '}
            - just{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
              straightforward solutions
            </span>{' '}
            to boost your sales and grow your business.
          </p>
        </header>

        <main className="space-y-8">
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">

            <div className="flex gap-3 bg-white rounded-xl shadow-sm border border-gray-200 p-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter website URL (e.g., https://example.com)"
                required
                disabled={loading}
                className="flex-1 px-4 py-3 text-lg border-0 outline-none focus:ring-0 bg-transparent text-black"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Analyzing...
                  </>
                ) : (
                  'Generate Report'
                )}
              </button>
            </div>
          </form>
          


          {error && (
            <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-lg p-4" role="alert">
              <div className="flex items-center gap-2 text-red-800">
                <span className="text-red-500">⚠️</span>
                {error}
              </div>
            </div>
          )}

          {analysisComplete && !loading && report && (
            <div className="max-w-2xl mx-auto bg-green-50 border border-green-200 rounded-lg p-4" role="alert">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-green-800">
                  <span className="text-green-500">🎉</span>
                  Analysis completed successfully! Your CRO report is ready below.
                </div>
                <div className="text-center">
                  <div className="text-lg font-mono font-bold text-green-800">
                    {formatTime(elapsedTime)}
                  </div>
                  <div className="text-xs text-green-600">Total Time</div>
                </div>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="max-w-2xl mx-auto bg-green-50 border border-green-200 rounded-lg p-4" role="alert">
              <div className="flex items-center gap-2 text-green-800">
                <span className="text-green-500">✓</span>
                {successMessage}
              </div>
            </div>
          )}

          {/* Screenshot Display - Show immediately when available */}
          {Object.keys(screenshotUrls).length > 0 && (
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Screenshots</h2>
                <p className="text-gray-600 mt-1">Real-time screenshots as they're captured</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(screenshotUrls).map(([pageType, url]) => (
                    <div key={pageType} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-900 capitalize">
                          {pageType}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = `${pageType}-screenshot.png`;
                            link.click();
                          }}
                          className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          Download
                        </button>
                      </div>
                      <div 
                        className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
                        onClick={() => setSelectedScreenshot({pageType, url})}
                      >
                        <img 
                          src={url} 
                          alt={`${pageType} screenshot`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement!.innerHTML = '<div class="flex items-center justify-center h-full"><p class="text-gray-500 text-center text-sm">Screenshot not available</p></div>';
                          }}
                        />
                        {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                          <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm font-medium">
                            Click to view full size
                          </span>
                        </div> */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {status && (
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  {status === 'cleanup' || status.includes('Analysis complete') ? (
                    <span className="text-white text-xl">✓</span>
                  ) : (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {status === 'cleanup' || status.includes('Analysis complete') ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✅ Complete
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        ⏳ Processing
                      </span>
                    )}
                  </div>
                  <div className="text-gray-700 font-medium">
                    {statusMessages[status]?.description || status}
                  </div>
                  <div className="text-sm text-gray-500">
                    {status === 'cleanup' || status.includes('Analysis complete') ? (
                      'Finalizing results...'
                    ) : (
                      `Step ${statusMessages[status]?.step || 0} of ${Object.keys(statusMessages).length}`
                    )}
                  </div>
                  
                  {/* Page Progress Indicator */}
                  {!analysisComplete && (
                    <div className="mt-3">
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                        <span>Page Progress:</span>
                        <span className="font-medium">
                          {Object.keys(report || {}).length}/4 analyzed
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {['homepage', 'collection', 'product', 'cart'].map((pageType) => (
                          <div
                            key={pageType}
                            className={`flex-1 h-2 rounded-full ${
                              report?.[pageType] 
                                ? 'bg-green-500' 
                                : analysisInProgress[pageType]
                                ? 'bg-purple-500 animate-pulse'
                                : 'bg-gray-200'
                            }`}
                            title={`${pageType}: ${
                              report?.[pageType] 
                                ? 'Complete' 
                                : analysisInProgress[pageType]
                                ? 'Analyzing...'
                                : 'Pending'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {/* Timer Display */}
                <div className="flex-shrink-0">
                  <div className="text-center">
                    <div className="text-2xl font-mono font-bold text-gray-900">
                      {formatTime(elapsedTime)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {timerActive ? 'Elapsed' : 'Total Time'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Show timer even when no status but analysis is in progress */}
          {loading && !status && (
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <div>
                    <div className="text-gray-700 font-medium">Initializing analysis...</div>
                    <div className="text-sm text-gray-500">Preparing to capture screenshots</div>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="text-center">
                    <div className="text-2xl font-mono font-bold text-gray-900">
                      {formatTime(elapsedTime)}
                    </div>
                    <div className="text-xs text-gray-500">Elapsed</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(report && Object.keys(report).length > 0) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  Analysis Report
                  {!analysisComplete && (
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      (Live updates in progress...)
                    </span>
                  )}
                  {!analysisComplete && report && Object.keys(report).length > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                      {Object.keys(report).length} of 4 pages analyzed
                    </div>
                  )}
                </h2>
                {analysisComplete && (
                  <button
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
                    onClick={() => setShowModal(true)}
                  >
                    ⬇️ Download Report
                  </button>
                )}
              </div>
              
              <div className="border-b border-gray-200">
                <div className="flex overflow-x-auto">
                  {Object.keys(report).map((pageType) => (
                    <button
                      key={pageType}
                      className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                        activeTab === pageType
                          ? 'border-blue-500 text-blue-600 bg-blue-50'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => setActiveTab(pageType)}
                    >
                      {pageType.charAt(0).toUpperCase() + pageType.slice(1)} Page
                      {screenshotsInProgress[pageType] && (
                        <span className="text-blue-500 animate-spin" title="Taking screenshot...">
                          📸
                        </span>
                      )}
                      {screenshotUrls[pageType] && !screenshotsInProgress[pageType] && (
                        <span className="text-green-500" title="Screenshot available">
                          ✅
                        </span>
                      )}
                      {analysisInProgress[pageType] && (
                        <span className="text-purple-500 animate-spin" title="Analyzing...">
                          🔍
                        </span>
                      )}
                      {report[pageType] && !analysisInProgress[pageType] && (
                        <span className="text-green-500" title="Analysis complete">
                          📊
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {activeTab && (
                <div className="p-6">
                  {analysisInProgress[activeTab] ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Analyzing {activeTab} page...</h3>
                      <p className="text-gray-600">Our AI is examining the page structure and identifying conversion opportunities.</p>
                    </div>
                  ) : report[activeTab] ? (
                    <div className="space-y-4">
                      {Array.isArray(report[activeTab]) ? (
                        report[activeTab].map((item, index) => (
                          <div key={index}>
                            {renderAnalysisItem(item, index)}
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-gray-500 py-8">
                          No analysis data available for this page type.
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-2xl">⏳</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Waiting for {activeTab} analysis...</h3>
                      <p className="text-gray-600">This page will be analyzed after the screenshot is captured.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Please enter your information</h2>
              <p className="text-gray-600">We will send you a copy of the report to your email.</p>
            </div>
            <form onSubmit={handleUserInfoSubmit} className="space-y-4">
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                value={userInfo.name}
                onChange={handleUserInfoChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={userInfo.email}
                onChange={handleUserInfoChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <input
                type="tel"
                id="mobile"
                name="mobile"
                placeholder="Mobile (optional)"
                value={userInfo.mobile}
                onChange={handleUserInfoChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Download Report
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Screenshot Popup Modal */}
      {selectedScreenshot && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 capitalize">
                {selectedScreenshot.pageType} Screenshot
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = selectedScreenshot.url;
                    link.download = `${selectedScreenshot.pageType}-screenshot.png`;
                    link.click();
                  }}
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                >
                  Download
                </button>
                <button
                  onClick={() => setSelectedScreenshot(null)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
              <img 
                src={selectedScreenshot.url} 
                alt={`${selectedScreenshot.pageType} screenshot`}
                className="w-full h-auto rounded-lg shadow-sm border border-gray-200"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = '<div class="flex items-center justify-center h-64"><p class="text-gray-500 text-center">Screenshot not available</p></div>';
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
