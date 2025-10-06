'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UrlForm from '../components/home/UrlForm';
import StatusDisplay from '../components/report/StatusDisplay';
import ScreenshotDisplay from '../components/report/ScreenshotDisplay';
import AnalysisReport from '../components/report/AnalysisReport';
import OverallSummary from '../components/report/OverallSummary';
import DownloadModal from '../components/report/DownloadModal';
import ScreenshotModal from '../components/report/ScreenshotModal';
import FormModal from '../components/layout/FormModal';
import { useAnalysis } from '../hooks/useAnalysis';
import HeroArea from '@/components/home/HeroArea';
import ReportLoading from '@/components/report/ReportLoading';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import authService from '../services/authService';
import PricingSection from '../components/home/PricingSection';
import WhatYouGetSection from '../components/home/WhatYouGetSection';
import AboutSections from '../components/home/AboutSections';
import FAQSection from '../components/home/FAQSection';
import ConversionQuotes from '../components/report/ConversionQuotes';
import Calandly from '@/components/home/Calandly';
import BeforeAfter from '@/components/home/BeforeAfter';
import { config } from '@/config/config';
import FloatingButton from '@/components/ui/FloatingButton';
import CountdownTimer from '@/components/ui/CountdownTimer';
// import { CountdownTimer } from './payment/page';
import { PagewiseAnalysisResult } from '@/hooks/useHomepageAnalysis';
import AnalyticsService from '@/services/analyticsService';


interface UserInfo {
  name: string;
  email: string;
  mobile: string;
}

interface StatusMessage {
  description: string;
  step: number;
}

interface Report {
  [key: string]: PagewiseAnalysisResult;
}

const CRO_QUOTES = [
  "Optimizing your store for maximum conversions...",
  "Every second counts in e-commerce - we're making yours count",
  "Turning browsers into buyers, one optimization at a time",
  "Your store's potential is being unlocked...",
  "Converting visitors into customers with precision",
  "Building trust and removing friction from your customer journey",
  "Every element matters when it comes to conversion",
  "We're analyzing every pixel for conversion opportunities",
  "Your customers' experience is being perfected",
  "Transforming your store into a conversion machine"
];

const STEP_MESSAGES: Record<string, string> = {
  'validate_shopify': 'Preparing your store analysis...',
  'take_screenshot': 'Capturing your store\'s current state...',
  'analyze_gemini': 'AI is examining every detail...',
  'analyze_checklist': 'Generating personalized recommendations...'
};

export default function Home() {
  const router = useRouter();
  const [selectedScreenshot, setSelectedScreenshot] = useState<{ pageType: string, url: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [currentQuote, setCurrentQuote] = useState(CRO_QUOTES[0]);

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
    downloadLoading,
    currentReportId,
    reportUrl,
    autoSaveEnabled,
    currentStep,
    steps,
    handleSubmit,
    handleUserInfoSubmit,
    handleUserInfoChange,
    handleUrlChange,
    formatTime,
    statusMessages,
    startAnalysisAfterPayment,
    startStepwiseAnalysis,
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

  // Cycle through CRO quotes during analysis
  useEffect(() => {
    if (loading) {
      const quoteInterval = setInterval(() => {
        setCurrentQuote(prevQuote => {
          const currentIndex = CRO_QUOTES.indexOf(prevQuote);
          const nextIndex = (currentIndex + 1) % CRO_QUOTES.length;
          return CRO_QUOTES[nextIndex];
        });
      }, 3000); // Change quote every 3 seconds

      return () => clearInterval(quoteInterval);
    }
  }, [loading]);

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
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Check server settings for flow configuration
      const response = await fetch(`${config.backendUrl}/settings`);
      if (response.ok) {
        const settingsData = await response.json();
        const serverFlow = settingsData.data?.flow || 'payment';
        
        if (serverFlow === 'homepage-analysis') {
          // Redirect to analyzing page for homepage analysis
          const analysisUrl = `/analyzing?url=${encodeURIComponent(url)}`;
          router.push(analysisUrl);
          return;
        }
      }
    } catch (error) {
      console.error('Error checking server settings:', error);
    }

    // Check localStorage for admin settings
    const adminSettingsStr = localStorage.getItem('adminSettings');
    if (adminSettingsStr) {
      try {
        const adminSettings = JSON.parse(adminSettingsStr);
        if (adminSettings.paymentEnabled === false) {
          // Payment is disabled, start analysis directly
          handleSubmit(e);
          return;
        }
      } catch (error) {
        console.error('Error parsing admin settings:', error);
      }
    }

    // Default: Redirect to payment page with URL as query parameter
    const paymentUrl = `/payment?url=${encodeURIComponent(url)}`;
    router.push(paymentUrl);
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
              "priceCurrency": config.currency,
              "price": `${config.pricing.mainPrice}.00`,
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

      <div className="announcment-bar">
        <p>
          Limited time - ${config.pricing.mainPrice} Only - Offer ends in
          <CountdownTimer />
        </p>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;25&quot; height=&quot;25&quot; viewBox=&quot;0 0 25 25&quot; fill=&quot;none&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cpath d=&quot;M1 1h1v1H1V1zm0 23h1v1H1v-1zm23 0h1v1h-1v-1zm0-23h1v1h-1V1z&quot; stroke=&quot;%23e5e7eb&quot; stroke-width=&quot;0.5&quot;/%3E%3C/svg%3E')] opacity-30"></div>



      <div className="relative z-10  px-4 py-12 min-h-screen flex flex-col justify-center  main-contaier">


        {
          !loading && <HeroArea
            url={url}
            setUrl={handleUrlChange}
            loading={loading}
            onSubmit={handleFormSubmit}
          />
        }

        {loading && (
          <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23f0f9ff&quot; fill-opacity=&quot;0.4&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-60"></div>
            
            {/* Floating elements */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute top-40 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-30 animate-bounce"></div>
            <div className="absolute bottom-40 left-20 w-12 h-12 bg-purple-200 rounded-full opacity-25 animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-24 h-24 bg-yellow-200 rounded-full opacity-20 animate-bounce"></div>

            <div className="relative z-10 px-4 py-12 min-h-screen flex flex-col justify-center items-center">
              {/* Main loading container */}
              <div className="max-w-2xl mx-auto text-center">
                {/* Animated icon */}
                <div className="mb-8">
                  <div className="w-24 h-24 mx-auto mb-6 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
                    <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-green-600 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Dynamic quote */}
                <div className="mb-8">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
                    {currentQuote}
                  </h1>
                  <p className="text-lg text-gray-600">
                    Analyzing your store for conversion opportunities
                  </p>
                </div>

                {/* Progress bar */}
                <div className="mb-8">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${Math.min(calculateProgress(), 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {Math.round(calculateProgress())}% Complete
                  </p>
                </div>

                {/* Stepwise Progress Indicator - Redesigned */}
                {loading && (
                  <div className="mt-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {steps.map((step, index) => {
                        const isActive = currentStep === step.name;
                        const isCompleted = step.completed;
                        
                        return (
                          <div key={step.name} className="flex flex-col items-center space-y-2">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                              isCompleted 
                                ? 'bg-green-500 text-white scale-110' 
                                : isActive 
                                  ? 'bg-blue-500 text-white scale-110 animate-pulse shadow-lg' 
                                  : 'bg-gray-200 text-gray-500'
                            }`}>
                              {isCompleted ? '✓' : index + 1}
                            </div>
                            <span className={`text-xs text-center font-medium transition-colors duration-300 ${
                              isCompleted 
                                ? 'text-green-600' 
                                : isActive 
                                  ? 'text-blue-600' 
                                  : 'text-gray-400'
                            }`}>
                              {STEP_MESSAGES[step.name]}
                            </span>
                            {isActive && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Motivational message */}
                <div className="mt-8 p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-white/20">
                  <p className="text-sm text-gray-600 italic">
                    "The best time to optimize your store was yesterday. The second best time is now."
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}




        {!loading && !report && (
          <>
            <WhatYouGetSection />
            <BeforeAfter />
            <AboutSections />
            <PricingSection />
            <div className='mt-15'>
              <div className="text-center mb-12 flex flex-col gap-8">
                <h2 className="section-header__title">
                  The CRO Team Behind Million-Dollar Shopify Plus Stores

                </h2>
                <p className='section-header__description'>
                  We’ve helped some of the biggest brands turn more clicks into customers. When you work with us, you’re getting proven expertise, not guesswork. Book your call today.

                </p>
              </div>
              <Calandly />
            </div>
            <FAQSection />


          </>
        )}

        {report &&

          <main className="space-y-8">

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

            {report && Object.keys(report).length > 0 && (
              <OverallSummary
                report={report}
                analysisInProgress={analysisInProgress}
                setShowModal={setShowModal}
              />
            )}

            {report && Object.keys(report).length > 0 && (
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
        totalProblems={0}
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        websiteUrl={url}
        isSampleReport={false}
        pageType="homepage"
      />

      <FloatingButton />

    </div>
  );
} 