'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Metadata } from 'next';
import ReportLoading from '../../components/report/ReportLoading';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Navbar from '../../components/layout/Navbar';
import { config } from '@/config/config';
import { useToast } from '@/contexts/ToastContext';
import shopifyValidationService from '@/services/shopifyValidationService';
import { useHomepageAnalysis } from '../../hooks/useHomepageAnalysis';
import AnalysisReport from '../../components/report/AnalysisReport';
import OverallSummary from '../../components/report/OverallSummary';

export const metadata: Metadata = {
  title: 'Analyzing Store - FixMyStore',
  description: 'Analyzing your Shopify store for conversion optimization opportunities',
  robots: {
    index: false,
    follow: false,
  },
};

const PAGE_TITLES: Record<string, string> = {
  homepage: 'Homepage',
  collection: 'Collection Page',
  product: 'Product Page',
  cart: 'Cart Page',
};

function AnalyzingPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const websiteUrl = searchParams.get('url');

  const [showLoading, setShowLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('homepage');
  const [progress, setProgress] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [flow, setFlow] = useState<'payment' | 'homepage-analysis'>('payment');

  const {
    loading: analysisLoading,
    error: analysisError,
    result: analysisResult,
    analyzeHomepage,
    reset
  } = useHomepageAnalysis();

  console.log("analysisResult", analysisResult);


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
      }
    };

    checkFlow();
  }, []);

  // Auto-analyze homepage if flow is homepage-analysis
  useEffect(() => {
    if (flow === 'homepage-analysis' && websiteUrl && !analysisResult && !analysisLoading) {
      setShowLoading(true);
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
      
      analyzeHomepage(websiteUrl);

      return () => clearInterval(progressInterval);
    }
  }, [flow, websiteUrl, analysisResult, analysisLoading, analyzeHomepage]);

  // Handle analysis completion
  useEffect(() => {
    if (flow === 'homepage-analysis' && analysisResult && !analysisLoading) {
      // Analysis completed successfully, show 100% progress then hide loading
      setProgress(100);
      setTimeout(() => {
        setShowLoading(false);
      }, 1500);
    }
  }, [flow, analysisResult, analysisLoading]);

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

  // Separate useEffect for Shopify validation
  useEffect(() => {
    if (!websiteUrl) {
      router.push('/');
      return;
    }

    let isMounted = true;

    // Start progress from 0% and move to 25% during validation (only for non-homepage-analysis flow)
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      if (!isMounted || flow === 'homepage-analysis') return;
      currentProgress += 0.5;
      if (currentProgress >= 25) {
        clearInterval(progressInterval);
      } else {
        setProgress(currentProgress);
      }
    }, 100);

    const validateShopifySite = async () => {
      try {
        const result = await shopifyValidationService.validateShopifySite(websiteUrl);

        if (!isMounted) return;

        if (!result.isShopify) {
          showToast('This site is not a Shopify store. Please enter a valid Shopify store URL.', 'error');
          router.push('/');
          return;
        }

        setIsValidating(false);
        // Set progress to 25% after successful validation (only for non-homepage-analysis flow)
        if (flow !== 'homepage-analysis') {
          setProgress(25);
        }
      } catch (error) {
        console.error('Shopify validation error:', error);
        // Fallback to client-side validation
        try {
          const clientResult = await shopifyValidationService.validateShopifyClientSide(websiteUrl);

          if (!isMounted) return;

          if (!clientResult.isShopify) {
            showToast('This site is not a Shopify store. Please enter a valid Shopify store URL.', 'error');
            router.push('/');
            return;
          }
          setIsValidating(false);
          // Set progress to 25% after successful client-side validation (only for non-homepage-analysis flow)
          if (flow !== 'homepage-analysis') {
            setProgress(25);
          }
        } catch (clientError) {
          console.error('Client-side validation error:', clientError);
          if (isMounted) {
            showToast('Unable to validate site. Please ensure you enter a valid Shopify store URL.', 'error');
          }
          return;
        }
      }
    };

    validateShopifySite();

    return () => {
      isMounted = false;
      clearInterval(progressInterval);
    };
  }, [websiteUrl, router, showToast, flow]);

  // Preload images when validation is complete
  useEffect(() => {
    if (isValidating) return;

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
  }, [isValidating]);

  // Handle initial loading state for non-homepage-analysis flow
  useEffect(() => {
    if (!isValidating && flow !== 'homepage-analysis' && imagesLoaded) {
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
  }, [isValidating, flow, imagesLoaded]);



  const handlePaymentClick = () => {
    router.push(`/payment?url=${encodeURIComponent(websiteUrl || '')}`);
  };



  const blurredImg = activeTab === 'homepage' ? '1' : activeTab === 'collection' ? '2' : activeTab === 'product' ? '3' : '4'
  const isHomepage = activeTab === 'homepage'
  
  if (showLoading || isValidating || (flow === 'homepage-analysis' && analysisLoading)) {
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
              isValidating 
                ? "Validating Shopify store..." 
                : flow === 'homepage-analysis' && analysisLoading
                ? "Analyzing homepage with AI..."
                : "Analyzing your store for conversion optimization opportunities..."
            }
            showProgress={true}
            progress={progress}
          />

          {/* {!imagesLoaded && !isValidating && (
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
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Analyzing Homepage</h3>
          <p className="text-gray-600">Capturing screenshot and analyzing with AI...</p>
        </div>
      );
    }

    if (analysisError) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 text-lg">{analysisError}</p>
          <button
            onClick={() => analyzeHomepage(websiteUrl || '')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (analysisResult) {
      // Use the HomepageAnalysisResult data directly - no conversion needed
      const reportData = {
        homepage: analysisResult
      };

      return (
        <div className="space-y-2 relative">
          <OverallSummary
            report={reportData}
            analysisInProgress={{}}
            setShowModal={() => { }}
            noViewReport={true}
            websiteUrl={websiteUrl}
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

          {isHomepage && <AnalysisReport
            report={reportData}
            activeTab="homepage"
            setActiveTab={() => { }}
            setShowModal={() => { }}
          />}
        </div>
      );
    }

    return null;
  };

  // Render blurred content for other tabs or when flow is payment
  const renderBlurredContent = () => {
    if (activeTab === 'homepage' && flow === 'homepage-analysis' && analysisResult) {
      return null;
    }

    return (
      <div className="relative mt-4">
        <div className="w-full rounded-lg overflow-hidden">
          <img
            className='w-full md:h-full h-[400px] '
            src={`/blured/${blurredImg}.png`}
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="text-center text-black">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">
                {PAGE_TITLES[activeTab]} Analysis
              </h3>
              <p className="text-sm opacity-90 mb-6">
                Unlock detailed insights and actionable recommendations
              </p>
              <button
                onClick={handlePaymentClick}
                className="download-button"
              >
                Unlock Full Report - ${config.pricing.mainPrice}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-green-50">
      {/* <Navbar /> */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="rounded-lg overflow-hidden">
          <div className="">
            {renderHomepageContent()}
            {renderBlurredContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

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