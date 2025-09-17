'use client';

import { useState, useEffect, Suspense, memo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ReportLoading from '../../components/report/ReportLoading';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Navbar from '../../components/layout/Navbar';
import { config } from '@/config/config';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/admin/LoginForm';
import { usePagewiseAnalysis } from '../../hooks/useHomepageAnalysis';
import AnalysisReport from '../../components/report/AnalysisReport';
import OverallSummary from '../../components/report/OverallSummary';
import BlurredContent from '../../components/report/BlurredContent';

const PAGE_TITLES: Record<string, string> = {
  homepage: 'Homepage',
  collection: 'Collection Page',
  product: 'Product Page',
  cart: 'Cart Page',
};

const AnalyzingPageContent = memo(function AnalyzingPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const websiteUrl = searchParams.get('url');
  const pageType = searchParams.get('pageType') || 'homepage';

  const [showLoading, setShowLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(pageType);
  const [progress, setProgress] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [flow, setFlow] = useState<'payment' | 'homepage-analysis'>('payment');
  const [hasAttemptedAnalysis, setHasAttemptedAnalysis] = useState(false);
  const [flowLoading, setFlowLoading] = useState(true);

  const {
    loading: analysisLoading,
    error: analysisError,
    result: analysisResult,
    analyzePage,
    reset
  } = usePagewiseAnalysis();

  // Check flow setting on component mount
  useEffect(() => {
    const checkFlow = async () => {
      try {
        const response = await fetch(`${config.backendUrl}/settings`);
        if (response.ok) {
          const settingsData = await response.json();
          setFlow(settingsData.data?.flow || 'payment');
        }
      } catch (error) {
        console.error('Error checking flow setting:', error);
      } finally {
        setFlowLoading(false);
      }
    };

    checkFlow();
  }, []);

  // Auto-analyze page if flow is homepage-analysis
  useEffect(() => {
    if (flow === 'homepage-analysis' && websiteUrl && !analysisResult && !analysisLoading && !hasAttemptedAnalysis) {
      setShowLoading(true);
      setHasAttemptedAnalysis(true);
      // Start progress from 0% for homepage-analysis flow
      setProgress(0);
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress += 0.5;
        if (currentProgress >= 25) {
          clearInterval(progressInterval);
        } else {
          setProgress(currentProgress);
        }
      }, 100);
      
      // Determine if authentication is required based on user authentication status
      // If user is not authenticated, use public route regardless of pageType
      // If user is authenticated and coming from audit routes, use protected route
      const requireAuth = isAuthenticated && pageType !== 'homepage';
      
      // Pass the pageType and auth requirement to the analysis
      analyzePage(websiteUrl, pageType, requireAuth);

      return () => clearInterval(progressInterval);
    }
  }, [flow, websiteUrl, analysisResult, analysisLoading, hasAttemptedAnalysis, analyzePage, pageType, isAuthenticated]);

  // Handle analysis completion
  useEffect(() => {
    if (flow === 'homepage-analysis' && analysisResult && !analysisLoading) {
      // Analysis completed successfully, show 100% progress then navigate to report page
      setProgress(100);
      setTimeout(() => {
        // Navigate to report page using the slug from analysis result
        if (analysisResult.slug) {
          router.push(`/report/${analysisResult.slug}`);
        } else {
          // Fallback: show loading false if no slug available
          setShowLoading(false);
        }
      }, 1500);
    }
  }, [flow, analysisResult, analysisLoading, router]);

  // Handle analysis error
  useEffect(() => {
    if (flow === 'homepage-analysis' && analysisError && !analysisLoading) {
      // Analysis failed, show 100% progress then hide loading
      setProgress(100);
      setTimeout(() => {
        setShowLoading(false);
      }, 1500);
    }
  }, [flow, analysisError, analysisLoading]);

  // Update progress during analysis
  useEffect(() => {
    if (flow === 'homepage-analysis' && analysisLoading) {
      // Start from current progress and slowly move to 80%
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 80) return 80;
          return prev + 0.5; // Increment by 0.5% every 100ms for smooth progression
        });
      }, 100);

      return () => clearInterval(progressInterval);
    }
  }, [flow, analysisLoading]);

  // Separate useEffect for Shopify validation - only for payment flow
  useEffect(() => {
    if (!websiteUrl) {
      router.push('/');
      return;
    }

    // Wait for flow to be determined before proceeding
    if (flowLoading) {
      return;
    }

    // Skip validation for homepage-analysis flow as it's handled by the analysis hook
    if (flow === 'homepage-analysis') {
      return;
    }

    let isMounted = true;

    // Start progress from 0% and move to 25% during validation (only for payment flow)
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      if (!isMounted) return;
      currentProgress += 0.5;
      if (currentProgress >= 25) {
        clearInterval(progressInterval);
      } else {
        setProgress(currentProgress);
      }
    }, 100);

    // Start analysis directly - validation is now handled by the backend
    if (websiteUrl && !hasAttemptedAnalysis) {
      setHasAttemptedAnalysis(true);
      setProgress(25);
      analyzePage(websiteUrl, pageType as 'homepage' | 'collection' | 'product' | 'cart');
    }

    return () => {
      isMounted = false;
      clearInterval(progressInterval);
    };
  }, [websiteUrl, router, flow, flowLoading, hasAttemptedAnalysis, analyzePage, pageType]);

  // Preload images when analysis starts
  useEffect(() => {
    if (!hasAttemptedAnalysis) return;

    const preloadImages = async () => {
      const imageUrls = ['/blured/1.png', '/blured/2.png', '/blured/3.png', '/blured/4.png'];
      const imagePromises = imageUrls.map(url => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(url);
          img.onerror = () => reject(url);
          img.src = url;
        });
      });

      try {
        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        console.error('Failed to preload some images:', error);
        setImagesLoaded(true);
      }
    };

    preloadImages();
  }, [hasAttemptedAnalysis]);

  // Handle initial loading state for non-homepage-analysis flow
  useEffect(() => {
    if (hasAttemptedAnalysis && flow !== 'homepage-analysis' && imagesLoaded) {
      // For payment flow, show progress progression then hide loading
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress += 0.5;
        if (currentProgress >= 25) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setShowLoading(false);
          }, 1000);
        } else {
          setProgress(currentProgress);
        }
      }, 100);

      return () => clearInterval(progressInterval);
    }
  }, [hasAttemptedAnalysis, flow, imagesLoaded]);



  const handlePaymentClick = useCallback(() => {
    router.push(`/payment?url=${encodeURIComponent(websiteUrl || '')}`);
  }, [router, websiteUrl]);



  const isHomepage = activeTab === 'homepage'
  
  if (showLoading || (flow === 'homepage-analysis' && analysisLoading)) {
    return (
      <div className="min-h-screen bg-green-50 relative">
        {/* <Navbar /> */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;25&quot; height=&quot;25&quot; viewBox=&quot;0 0 25 25&quot; fill=&quot;none&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cpath d=&quot;M1 1h1v1H1V1zm0 23h1v1H1v-1zm23 0h1v1h-1v-1zm0-23h1v1h-1V1z&quot; stroke=&quot;%23e5e7eb&quot; stroke-width=&quot;0.5&quot;/%3E%3C/svg%3E')] opacity-30"></div>

        <div className="relative z-10 px-4 py-12 min-h-screen flex flex-col justify-center">
          <div className='mt-[-250px] analyze-loading'>
            <DotLottieReact
              src="https://lottie.host/a1b1eddc-5bf6-4259-bfe0-17b695d57e6f/X7bQ4xuwAv.lottie"
              loop
              autoplay={true}
            />
          </div>

          <ReportLoading
            message={
              flow === 'homepage-analysis' && analysisLoading
                ? `Analyzing ${PAGE_TITLES[pageType]} with AI...`
                : "Analyzing your store for conversion optimization opportunities..."
            }
            showProgress={true}
            progress={progress}
          />

          {/* {!imagesLoaded && (
            <div className="text-center mt-4">
              <div className="inline-flex items-center text-sm text-gray-600">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin mr-2"></div>
                Preloading images...
              </div>
            </div>
          )} */}
        </div>
      </div>
    );
  }

  // Render homepage analysis content if flow is homepage-analysis and we have results
  const renderHomepageContent = () => {
    if (flow !== 'homepage-analysis') {
      return null;
    }

    if (analysisLoading) {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Analyzing {PAGE_TITLES[pageType]}</h3>
          <p className="text-gray-600">Capturing screenshot and analyzing with AI...</p>
        </div>
      );
    }

    if (analysisError) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 text-lg">{analysisError}</p>
          <button
            onClick={() => {
              setHasAttemptedAnalysis(false);
              analyzePage(websiteUrl || '', pageType);
            }}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (analysisResult) {
      // Use the PagewiseAnalysisResult data directly - no conversion needed
      const reportData = {
        [pageType]: analysisResult
      };

      return (
        <div className="space-y-2 relative">
          <OverallSummary
            report={reportData}
            analysisInProgress={{}}
            setShowModal={() => { }}
            noViewReport={true}
            websiteUrl={websiteUrl}
            reportUrl={analysisResult.slug}
          />

          <div className="rounded-lg overflow-hidden sticky top-0 z-10">
            <div className="report__tabs">
              {Object.entries(PAGE_TITLES).map(([key, title]) => (
                <button
                  key={key}
                  className={`report__tab ${activeTab === key ? 'active' : ''}`}
                  onClick={() => setActiveTab(key)}
                >
                  {title.replace('Page', '')}
                </button>
              ))}
            </div>
          </div>

          {/* Show analysis report only for the analyzed page type */}
          {activeTab === pageType && (
            <AnalysisReport
              report={reportData}
              activeTab={pageType}
              setActiveTab={() => { }}
              setShowModal={() => { }}
            />
          )}

          {/* Show blurred content for tabs that don't have analysis results */}
          {activeTab !== pageType && renderBlurredContent()}
        </div>
      );
    }

    return null;
  };

  // Render blurred content for other tabs or when flow is payment
  const renderBlurredContent = () => {
    return (
      <BlurredContent 
        activeTab={activeTab}
        pageType={pageType}
        analysisResult={analysisResult}
        onPaymentClick={handlePaymentClick}
      />
    );
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated AND not doing homepage analysis
  if (!isAuthenticated && pageType !== 'homepage') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          {/* <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Login Required</h1>
            <p className="text-gray-600">Please sign in to access the analysis page</p>
          </div> */}
          <LoginForm  isUserLogin/>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* <Navbar /> */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="rounded-lg overflow-hidden">
          <div className="">
            {renderHomepageContent()}
          </div>
        </div>
      </div>
    </div>
  );
});

export default function AnalyzingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
          <p className="text-gray-600">Preparing your analysis page</p>
        </div>
      </div>
    }>
      <AnalyzingPageContent />
    </Suspense>
  );
} 