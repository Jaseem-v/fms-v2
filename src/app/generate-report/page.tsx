'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import paymentService from '../../services/paymentService';
import settingsService from '../../services/settingsService';
import { useAnalysis } from '../../hooks/useAnalysis';
import ReportLoading from '../../components/report/ReportLoading';
import OverallSummary from '../../components/report/OverallSummary';
import AnalysisReport from '../../components/report/AnalysisReport';
import DownloadModal from '../../components/report/DownloadModal';

function GenerateReportContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('order_id');
  const websiteUrl = searchParams.get('url');

  const [status, setStatus] = useState<'verifying' | 'verified' | 'failed' | 'generating' | 'manual_mode'>('verifying');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('homepage');
  const [queuePosition, setQueuePosition] = useState<number>(0);
  const [manualReportTime, setManualReportTime] = useState<number>(12);

  // Helper function to get queue position from localStorage
  const getQueuePositionFromStorage = (orderId: string): number | null => {
    try {
      const stored = localStorage.getItem(`queue_position_${orderId}`);
      if (stored) {
        const data = JSON.parse(stored);
        const now = Date.now();
        // Check if stored data is less than 1 hour old
        if (now - data.timestamp < 60 * 60 * 1000) {
          return data.position;
        } else {
          // Remove expired data
          localStorage.removeItem(`queue_position_${orderId}`);
        }
      }
    } catch (error) {
      console.error('Error reading queue position from localStorage:', error);
    }
    return null;
  };

  // Helper function to store queue position in localStorage
  const storeQueuePosition = (orderId: string, position: number): void => {
    try {
      const data = {
        position,
        timestamp: Date.now()
      };
      localStorage.setItem(`queue_position_${orderId}`, JSON.stringify(data));
    } catch (error) {
      console.error('Error storing queue position in localStorage:', error);
    }
  };

  const {
    url,
    setUrl,
    loading,
    report,
    status: analysisStatus,
    error: analysisError,
    startAnalysisAfterPayment,
    statusMessages,
    showModal,
    setShowModal,
    analysisInProgress,
    shopifyValidationError,
    userInfo,
    handleUserInfoChange,
    handleUserInfoSubmit,
    downloadLoading,
    currentReportId,
    reportUrl,
    autoSaveEnabled,
  } = useAnalysis();

  // Progress calculation function similar to main page
  const calculateProgress = () => {
    if (!analysisStatus) return 0;

    const currentStatus = statusMessages[analysisStatus];
    if (!currentStatus) return 0;

    // Handle special status cases
    if (analysisStatus === 'complete' || analysisStatus === 'all-steps-complete') {
      return 100;
    }

    if (analysisStatus === 'error-occurred') {
      return 0;
    }

    // Define step progress mapping for more granular control
    const stepProgressMap: Record<string, number> = {
      // Step 1: Homepage (0-20%)
      'step-1-homepage-start': 5,
      'screenshot-homepage': 10,
      'analyze-homepage': 15,
      'step-1-homepage-complete': 20,

      // Step 2: Collection (20-40%)
      'step-2-collection-start': 25,
      'screenshot-collection': 30,
      'analyze-collection': 35,
      'step-2-collection-complete': 40,

      // Step 3: Product (40-60%)
      'step-3-product-start': 45,
      'search-product-page': 50,
      'screenshot-product': 55,
      'analyze-product': 60,
      'step-3-product-complete': 65,

      // Step 4: Cart (60-80%)
      'step-4-cart-start': 70,
      'add-cart': 75,
      'screenshot-cart': 80,
      'analyze-cart': 85,
      'step-4-cart-complete': 90,

      // Final steps (90-95%)
      'cleanup': 95,
      'wait-between-steps': 0,
      'wait-for-previous-analyses': 0,
      'fallback-to-puppeteer': 0,
      'starting': 0,
    };

    // Check if we have a specific progress mapping for this status
    if (stepProgressMap[analysisStatus] !== undefined) {
      return stepProgressMap[analysisStatus];
    }

    // Fallback to step-based calculation
    const totalSteps = 5;
    const currentStep = currentStatus.step;

    // If step is 0, it's a waiting or error state, return 0
    if (currentStep === 0) return 0;

    // Calculate percentage: (currentStep / totalSteps) * 100
    let progress = Math.round((currentStep / totalSteps) * 100);

    // Add extra progress for specific status types
    if (analysisStatus.includes('-complete')) {
      // If a step is complete, add 10% more to show progress within the step
      progress += 10;
    } else if (analysisStatus.includes('-start')) {
      // If a step just started, add 5% to show initial progress
      progress += 5;
    }

    // Cap at 95% until analysis is complete
    return Math.min(progress, 95);
  };

  useEffect(() => {
    if (!orderId || !websiteUrl) {
      console.error('[GENERATE REPORT] Missing payment info:', { orderId, websiteUrl });
      setError('Missing payment information. Please try again.');
      setStatus('failed');
      return;
    }

    console.log('[GENERATE REPORT] Starting payment verification:', { orderId, websiteUrl });
    verifyPaymentAndStartAnalysis();
  }, [orderId, websiteUrl]);

  const verifyPaymentAndStartAnalysis = async () => {
    try {
      setStatus('verifying');
      setMessage('Verifying your payment...');
      console.log('[GENERATE REPORT] Verifying payment for order:', orderId);

      // Verify payment using order ID
      if (!orderId) {
        throw new Error('Order ID is missing');
      }

      const result = await paymentService.verifyPaymentByOrderId(orderId);

      console.log('[GENERATE REPORT] Payment verification result:', result);

      if (result.success && result.status === 'completed') {
        setStatus('verified');
        setMessage('Payment verified successfully!');
        console.log('[GENERATE REPORT] Payment verified, checking report mode');

        // Check report mode settings
        try {
          const settings = await settingsService.getServerSettings();
          console.log('[GENERATE REPORT] Settings:', settings);

          if (settings.report_mode === 'MANUAL') {
            // Check if we have a stored queue position for this orderId
            let queuePos = getQueuePositionFromStorage(orderId);
            
            if (!queuePos) {
              // Generate new random queue position (1-60) if none exists or expired
              queuePos = Math.floor(Math.random() * 60) + 1;
              storeQueuePosition(orderId, queuePos);
              console.log('[GENERATE REPORT] Generated new queue position:', queuePos);
            } else {
              console.log('[GENERATE REPORT] Using stored queue position:', queuePos);
            }
            
            setQueuePosition(queuePos);
            setManualReportTime(settings.report_manual_time);
            setStatus('manual_mode');
            console.log('[GENERATE REPORT] Manual mode detected, showing thank you message');
          } else {
            // Auto mode - start analysis
            setMessage('Starting your analysis...');
            console.log('[GENERATE REPORT] Auto mode detected, starting analysis');

            // Set the URL for analysis
            if (websiteUrl) {
              setUrl(websiteUrl);

              // Start analysis after a short delay, but pass the websiteUrl directly
              setTimeout(() => {
                setStatus('generating');
                setMessage('Generating your comprehensive CRO analysis...');
                console.log('[GENERATE REPORT] Starting analysis for URL:', websiteUrl);
                startAnalysisAfterPayment(websiteUrl);
              }, 2000);
            } else {
              setStatus('failed');
              setError('Website URL is missing. Please try again.');
            }
          }
        } catch (settingsError) {
          console.error('[GENERATE REPORT] Error fetching settings:', settingsError);
          // Fallback to auto mode if settings fetch fails
          setMessage('Starting your analysis...');
          console.log('[GENERATE REPORT] Settings fetch failed, defaulting to auto mode');

          if (websiteUrl) {
            setUrl(websiteUrl);
            setTimeout(() => {
              setStatus('generating');
              setMessage('Generating your comprehensive CRO analysis...');
              console.log('[GENERATE REPORT] Starting analysis for URL:', websiteUrl);
              startAnalysisAfterPayment(websiteUrl);
            }, 2000);
          } else {
            setStatus('failed');
            setError('Website URL is missing. Please try again.');
          }
        }

      } else {
        setStatus('failed');
        setError(result.message || 'Payment verification failed. Please contact support.');
        console.error('[GENERATE REPORT] Payment verification failed:', result);
      }
    } catch (error) {
      console.error('[GENERATE REPORT] Payment verification error:', error);
      setStatus('failed');
      setError('Error verifying payment. Please try again.');
    }
  };

  const handleRetry = () => {
    setError(null);
    verifyPaymentAndStartAnalysis();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  console.log('reportUrl', reportUrl);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {status !== 'manual_mode' && (
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Generating Your Report
            </h1>
            <p className="text-gray-600">
              We're analyzing your Shopify store to create a comprehensive CRO report
            </p>
          </div>
        )}

        {/* Status Display */}
        {status !== 'generating' && status !== 'manual_mode' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            {status === 'verifying' && (
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Verifying Payment
                </h2>
                <p className="text-gray-600">{message}</p>
              </div>
            )}

            {status === 'verified' && (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Payment Verified!
                </h2>
                <p className="text-gray-600">{message}</p>
              </div>
            )}

            {status === 'failed' && (
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Verification Failed
                </h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <div className="space-x-4">
                  <button
                    onClick={handleRetry}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={handleGoHome}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    Go Home
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Manual Mode Thank You Message */}
        {status === 'manual_mode' && (
          <div className="min-h-screen bg-green-50 flex items-center justify-center">
            <div className="max-w-lg mx-auto px-6 py-12">
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Thank You!
                </h2>
                <div className="space-y-6">
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Your payment has been verified successfully.
                  </p>
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                    <p className="text-green-800 font-semibold text-xl">
                      You are #{queuePosition} in queue
                    </p>
                  </div>
                  <p className="text-gray-600 text-lg">
                    We will share the audit report to your email in{' '}
                    <span className="font-semibold text-gray-800">{manualReportTime} hours</span>.
                  </p>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <p className="text-gray-700">
                      For any queries, contact{' '}
                      <a 
                        href="mailto:team@fixmystore.com" 
                        className="text-green-600 hover:text-green-700 font-semibold underline"
                      >
                        team@fixmystore.com
                      </a>
                    </p>
                  </div>
                  <button
                    onClick={handleGoHome}
                    className="w-full px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold text-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    Return to Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Report Loading - Show when generating */}
        {status === 'generating' && (
          <div className="">
            <ReportLoading
              message={analysisStatus ? statusMessages[analysisStatus]?.description || analysisStatus : 'Initializing analysis...'}
              showProgress={true}
              progress={calculateProgress()}
              report={report || undefined}
            />
          </div>
        )}

        {/* Report Results */}
        {status === 'generating' && report && Object.keys(report).length > 0 && (
          <div className="space-y-8">
            {shopifyValidationError && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4" role="alert">
                <div className="flex items-center gap-2 text-orange-800">
                  <span className="text-orange-500">🛒</span>
                  <div>
                    <div className="font-semibold">Shopify Site Required</div>
                    <div>{shopifyValidationError}</div>
                  </div>
                </div>
              </div>
            )}

            {analysisError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4" role="alert">
                <div className="flex items-center gap-2 text-red-800">
                  <span className="text-red-500">⚠️</span>
                  {analysisError}
                </div>
              </div>
            )}

            {!shopifyValidationError && report && Object.keys(report).length > 0 && (
              <OverallSummary
                report={report}
                analysisInProgress={analysisInProgress}
                setShowModal={setShowModal}
                reportUrl={reportUrl || undefined}
              />
            )}

            {!shopifyValidationError && report && Object.keys(report).length > 0 && (
              <AnalysisReport
                report={report}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setShowModal={setShowModal}
              />
            )}
          </div>
        )}

        {/* Error Display */}
        {status === 'generating' && analysisError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4" role="alert">
            <div className="flex items-center gap-2 text-red-800">
              <span className="text-red-500">⚠️</span>
              <div>
                <div className="font-semibold">Analysis Error</div>
                <div>{analysisError}</div>
              </div>
            </div>
          </div>
        )}

        {/* Download Modal */}
        <DownloadModal
          showModal={showModal}
          setShowModal={setShowModal}
          userInfo={userInfo}
          handleUserInfoChange={handleUserInfoChange}
          handleUserInfoSubmit={handleUserInfoSubmit}
          downloadLoading={downloadLoading}
          reportUrl={reportUrl}
        />
      </div>
    </div>
  );
}

export default function GenerateReportPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
          <p className="text-gray-600">Preparing your report generation page</p>
        </div>
      </div>
    }>
      <GenerateReportContent />
    </Suspense>
  );
}