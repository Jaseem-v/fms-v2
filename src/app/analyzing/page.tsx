'use client';

import { useState, useEffect, Suspense, memo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AnalysisLoadingScreen from '../../components/analysis/AnalysisLoadingScreen';
import IndustrySelection from '../../components/analysis/IndustrySelection';
import AnalyticsService from '../../services/analyticsService';
import { Industry } from '../../services/industryService';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/layout/LoginForm';
import { usePagewiseAnalysis } from '../../hooks/usePagewiseAnalysis';
import { config } from '@/config/config';

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

const AnalyzingPageContent = memo(function AnalyzingPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const websiteUrl = searchParams.get('url');
  const pageType = searchParams.get('pageType') || 'homepage';

  const [showLoading, setShowLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [flow, setFlow] = useState<'payment' | 'homepage-analysis'>('payment');
  const [hasAttemptedAnalysis, setHasAttemptedAnalysis] = useState(false);
  const [flowLoading, setFlowLoading] = useState(true);
  const [currentQuote, setCurrentQuote] = useState(CRO_QUOTES[0]);
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
  const [showIndustrySelection, setShowIndustrySelection] = useState(false);
  const [geminiAnalysisComplete, setGeminiAnalysisComplete] = useState(false);

  const {
    loading: analysisLoading,
    error: analysisError,
    result: analysisResult,
    currentStep,
    steps,
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

  // Cycle through CRO quotes during analysis
  useEffect(() => {
    if (analysisLoading) {
      const quoteInterval = setInterval(() => {
        setCurrentQuote((prevQuote: string) => {
          const currentIndex = CRO_QUOTES.indexOf(prevQuote);
          const nextIndex = (currentIndex + 1) % CRO_QUOTES.length;
          return CRO_QUOTES[nextIndex];
        });
      }, 3000); // Change quote every 3 seconds

      return () => clearInterval(quoteInterval);
    }
  }, [analysisLoading]);

  // Track page selection when component mounts
  useEffect(() => {
    if (websiteUrl && pageType) {
      AnalyticsService.trackPageSelected(
        pageType,
        websiteUrl,
        AnalyticsService.extractWebsiteName(websiteUrl)
      );
    }
  }, [websiteUrl, pageType]);

  // Auto-analyze page if flow is homepage-analysis
  useEffect(() => {
    if (flow === 'homepage-analysis' && websiteUrl && !analysisResult && !analysisLoading && !hasAttemptedAnalysis) {
      setShowLoading(true);
      setHasAttemptedAnalysis(true);
      // Start progress from 0% for homepage-analysis flow
      setProgress(0);
      
      // Determine if authentication is required based on user authentication status
      // If user is not authenticated, use public route regardless of pageType
      // If user is authenticated and coming from audit routes, use protected route
      const requireAuth = isAuthenticated && pageType !== 'homepage';
      
      // Pass the pageType and auth requirement to the analysis (no category to stop after Gemini)
      analyzePage(websiteUrl, pageType, requireAuth);
    }
  }, [flow, websiteUrl, analysisResult, analysisLoading, hasAttemptedAnalysis, analyzePage, pageType, isAuthenticated]);

  // Handle Gemini analysis completion - show industry selection
  useEffect(() => {
    // Debug logging for industry selection
    // console.log('Checking for industry selection:', {
    //   flow,
    //   currentStep,
    //   steps: steps.map(s => ({ name: s.name, completed: s.completed })),
    //   geminiCompleted: steps.find(s => s.name === 'analyze_gemini')?.completed,
    //   checklistCompleted: steps.find(s => s.name === 'analyze_checklist')?.completed,
    //   showIndustrySelection,
    //   analysisResult: !!analysisResult,
    //   analysisLoading
    // });
    
    if (flow === 'homepage-analysis' && 
        steps.find(s => s.name === 'analyze_gemini')?.completed && 
        !steps.find(s => s.name === 'analyze_checklist')?.completed &&
        !showIndustrySelection && 
        !analysisLoading &&
        analysisResult) {
      // console.log('Gemini analysis completed, showing industry selection');
      setGeminiAnalysisComplete(true);
      setShowIndustrySelection(true);
      setShowLoading(false);
    }
  }, [flow, currentStep, steps, showIndustrySelection, analysisResult, analysisLoading]);

  // Handle industry selection and continue with checklist analysis
  const handleIndustrySelect = useCallback(async (industry: Industry | null) => {
    setSelectedIndustry(industry);
    if (industry && websiteUrl) {
      setShowIndustrySelection(false);
      setShowLoading(true);
      
      // Continue with full analysis using the selected industry category
      try {
        await analyzePage(websiteUrl, pageType, false, industry.name);
      } catch (error) {
        console.error('Error continuing analysis with industry:', error);
        setShowLoading(false);
      }
    }
  }, [websiteUrl, pageType, analyzePage]);

  // Handle analysis completion
  useEffect(() => {
    if (flow === 'homepage-analysis' && analysisResult && !analysisLoading && !showIndustrySelection) {
      // Analysis completed
      
      // Analysis completed successfully, show 100% progress then navigate to report page
      setProgress(100);
      setTimeout(() => {
        // Navigate to report page using the slug from analysis result
        if (analysisResult.slug) {
          // Redirecting to report page
          router.push(`/report/${analysisResult.slug}`);
        } else {
          // No slug available
          // Fallback: show loading false if no slug available
          setShowLoading(false);
        }
      }, 1500);
    }
  }, [flow, analysisResult, analysisLoading, router, showIndustrySelection]);

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

  // Update progress based on completed steps (start from 10%, scale remaining 90% across 4 UI steps)
  useEffect(() => {
    if (analysisLoading && steps) {
      // Only count the first 4 steps (excluding store_analysis) for UI progress
      const uiSteps = steps.filter(step => step.name !== 'store_analysis');
      const completedSteps = uiSteps.filter(step => step.completed).length;
      const totalSteps = uiSteps.length;
      // Start from 10%, scale the remaining 90% across the 4 UI steps
      const stepProgress = 10 + (completedSteps / totalSteps) * 90;
      
      // Set progress directly to the step-based percentage
      setProgress(stepProgress);
    }
  }, [analysisLoading, steps]);

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

    // Start analysis directly - validation is now handled by the backend
    if (websiteUrl && !hasAttemptedAnalysis) {
      setHasAttemptedAnalysis(true);
      setProgress(0); // Start from 10%, progress will be updated by step completion
      analyzePage(websiteUrl, pageType as 'homepage' | 'collection' | 'product' | 'cart');
    }

    return () => {
      isMounted = false;
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
      // For payment flow, hide loading after images are loaded
      setTimeout(() => {
        setShowLoading(false);
      }, 1000);
    }
  }, [hasAttemptedAnalysis, flow, imagesLoaded]);



  const handlePaymentClick = useCallback(() => {
    router.push(`/payment?url=${encodeURIComponent(websiteUrl || '')}`);
  }, [router, websiteUrl]);



  const isHomepage = pageType === 'homepage'
  
  if (showLoading || (flow === 'homepage-analysis' && analysisLoading) || showIndustrySelection) {
    return (
      <AnalysisLoadingScreen
        pageType={pageType}
        currentStep={currentStep}
        steps={steps}
        flow={flow}
        analysisLoading={analysisLoading}
        currentQuote={currentQuote}
        progress={progress}
        showIndustrySelection={showIndustrySelection}
        selectedIndustry={selectedIndustry}
        onIndustrySelect={handleIndustrySelect}
      />
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
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Analyzing {pageType === 'homepage' ? 'Homepage' : pageType === 'collection' ? 'Collection Page' : pageType === 'product' ? 'Product Page' : 'Cart Page'}</h3>
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
      // Redirect to the report page instead of showing the report here
      useEffect(() => {
        const reportUrl = `/report/${analysisResult.slug}?pageType=${pageType}&url=${encodeURIComponent(websiteUrl || '')}`;
        router.push(reportUrl);
      }, [analysisResult, pageType, websiteUrl, router]);

      return (
        <div className="min-h-screen bg-green-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Analysis Complete!</h2>
            <p className="text-gray-600">Redirecting you to your detailed report...</p>
          </div>
        </div>
      );
    }

    return null;
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