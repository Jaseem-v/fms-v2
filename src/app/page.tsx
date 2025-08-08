'use client';

import { useState, useEffect } from 'react';
import UrlForm from '../components/ui/UrlForm';
import StatusDisplay from '../components/StatusDisplay';
import ScreenshotDisplay from '../components/ScreenshotDisplay';
import AnalysisReport from '../components/AnalysisReport';
import OverallSummary from '../components/OverallSummary';
import DownloadModal from '../components/DownloadModal';
import ScreenshotModal from '../components/ScreenshotModal';
import FormModal from '../components/FormModal';
import { useAnalysis } from '../hooks/useAnalysis';
import HeroArea from '@/components/ui/HeroArea';
import ReportLoading from '@/components/ReportLoading';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import authService from '../services/authService';
import PricingSection from '../components/ui/PricingSection';
import WhatYouGetSection from '../components/ui/WhatYouGetSection';
import AboutSections from '../components/ui/AboutSections';
import FAQSection from '../components/ui/FAQSection';
import ConversionQuotes from '../components/ConversionQuotes';
import Calandly from '@/components/Calandly';
import BeforeAfter from '@/components/ui/BeforeAfter';



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
  summary: string;
}

interface Report {
  [key: string]: AnalysisItem[];
}

export default function Home() {
  const [selectedScreenshot, setSelectedScreenshot] = useState<{ pageType: string, url: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const {
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
    handleSubmit,
    handleUserInfoSubmit,
    handleUserInfoChange,
    handleUrlChange,
    formatTime,
    statusMessages,
    startAnalysisAfterPayment,
  } = useAnalysis();

  // Check authentication status on component mount
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const result = await authService.verifyToken();
  //       setIsAuthenticated(result.valid);
  //     } catch (error) {
  //       console.error('Auth check error:', error);
  //       setIsAuthenticated(false);
  //     } finally {
  //       setIsCheckingAuth(false);
  //     }
  //   };

  //   checkAuth();
  // }, []);

  // Calculate progress percentage based on status
  const calculateProgress = () => {
    if (!status) return 0;

    const currentStatus = statusMessages[status];
    if (!currentStatus) return 0;

    // Handle special status cases
    if (status === 'complete' || status === 'all-steps-complete') {
      return 100;
    }

    if (status === 'error-occurred') {
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
    if (stepProgressMap[status] !== undefined) {
      return stepProgressMap[status];
    }

    // Fallback to step-based calculation
    const totalSteps = 5;
    const currentStep = currentStatus.step;

    // If step is 0, it's a waiting or error state, return 0
    if (currentStep === 0) return 0;

    // Calculate percentage: (currentStep / totalSteps) * 100
    let progress = Math.round((currentStep / totalSteps) * 100);

    // Add extra progress for specific status types
    if (status.includes('-complete')) {
      // If a step is complete, add 10% more to show progress within the step
      progress += 10;
    } else if (status.includes('-start')) {
      // If a step just started, add 5% to show initial progress
      progress += 5;
    }

    // Cap at 95% until analysis is complete
    return Math.min(progress, 95);
  };

  // Debug log for report
  console.log('Report data:', report);

  // Wrapper function to handle form submission with authentication check
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Redirect to analyzing page with URL as query parameter
    const analyzingUrl = `/analyzing?url=${encodeURIComponent(url)}`;
    window.location.href = analyzingUrl;
  };

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

  return (
    <div className="min-h-screen bg-green-50 relative overflow-hidden">

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Shopify CRO Audit",
            "description": "Fix My Store offers a Shopify CRO Audit that doesn't just list issues — we show exactly how to fix them with examples and actionable insights to boost conversions.",
            "brand": {
              "@type": "Organization",
              "name": "Fix My Store"
            },
            "sku": "FMS-CRO-001",
            "url": "https://fixmystore.com/",
            "offers": {
              "@type": "Offer",
              "url": "https://fixmystore.com/",
              "priceCurrency": "USD",
              "price": "49.00",
              "availability": "https://schema.org/InStock",
              "itemCondition": "https://schema.org/NewCondition",
              "seller": {
                "@type": "Organization",
                "name": "Conversion AB"
              }
            },
            "review": {
              "@type": "Review",
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": "5",
                "bestRating": "5"
              },
              "author": {
                "@type": "Person",
                "name": "Verified Shopify Merchant"
              }
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "37"
            },
            "sameAs": [
              "https://x.com/fixyourstore?s=21",
              "https://www.instagram.com/fixmystore_com",
              "https://www.youtube.com/@FixMyStore"
            ]
          })
        }}
      />

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;25&quot; height=&quot;25&quot; viewBox=&quot;0 0 25 25&quot; fill=&quot;none&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cpath d=&quot;M1 1h1v1H1V1zm0 23h1v1H1v-1zm23 0h1v1h-1v-1zm0-23h1v1h-1V1z&quot; stroke=&quot;%23e5e7eb&quot; stroke-width=&quot;0.5&quot;/%3E%3C/svg%3E')] opacity-30"></div>



      <div className="relative z-10  px-4 py-12 min-h-screen flex flex-col justify-center  main-contaier">


        {
          !loading && <HeroArea
            url={url}
            setUrl={handleUrlChange}
            loading={loading}
            validatingShopify={validatingShopify}
            onSubmit={handleFormSubmit}
          />
        }

        {loading &&

          <div className='mt-[-100px]'>
            <DotLottieReact
              src="https://lottie.host/a1b1eddc-5bf6-4259-bfe0-17b695d57e6f/X7bQ4xuwAv.lottie"
              loop
              autoplay={true}
            />
          </div>
        }

        {loading && <ConversionQuotes />}

        {loading && <ReportLoading
          message={status ? statusMessages[status]?.description || status : 'Initializing analysis...'}
          showProgress={true}
          progress={calculateProgress()}
        />}




        {!loading && !report && (
          <>
            <WhatYouGetSection />
            <BeforeAfter />
            <AboutSections />
            <PricingSection />
            <div className='mt-15'>
              <div className="text-center mb-12 flex flex-col gap-8">
                <h2 className="section-header__title">
                  Need help/ have queries? Let’s talk.
                </h2>
                <p className='section-header__description'>
                  We’re not some random folks on the internet. We’re CRO experts works with million dollar Shopify Plus brands. Book a call.
                </p>
              </div>
              <Calandly />
            </div>
            <FAQSection />


          </>
        )}

        {report && <main className="space-y-8">
          {shopifyValidationError && (
            <div className="max-w-4xl mx-auto bg-orange-50 border border-orange-200 rounded-lg p-4" role="alert">
              <div className="flex items-center gap-2 text-orange-800">
                <span className="text-orange-500">🛒</span>
                <div>
                  <div className="font-semibold">Shopify Site Required</div>
                  <div>{shopifyValidationError}</div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="max-w-4xl mx-auto bg-red-50 border border-red-200 rounded-lg p-4" role="alert">
              <div className="flex items-center gap-2 text-red-800">
                <span className="text-red-500">⚠️</span>
                {error}
              </div>
            </div>
          )}

          {<ReportLoading
            message={status ? statusMessages[status]?.description || status : 'Initializing analysis...'}
            showProgress={true}
            progress={analysisComplete ? 100 : calculateProgress()}
            report={report}
          />}

          {!shopifyValidationError && report && Object.keys(report).length > 0 && (
            <OverallSummary
              report={report}
              analysisInProgress={analysisInProgress}
              setShowModal={setShowModal}
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
        </main>}
      </div>

      <DownloadModal
        showModal={showModal}
        setShowModal={setShowModal}
        userInfo={userInfo}
        handleUserInfoChange={handleUserInfoChange}
        handleUserInfoSubmit={handleUserInfoSubmit}
        downloadLoading={downloadLoading}
        reportUrl={reportUrl}
      />

      <ScreenshotModal
        selectedScreenshot={selectedScreenshot}
        setSelectedScreenshot={setSelectedScreenshot}
      />

      <FormModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        websiteUrl={url}
      />
    </div>
  );
} 