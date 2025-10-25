'use client';

import { useState, useEffect } from 'react';
import industryService, { Industry } from '@/services/industryService';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface Step {
  name: string;
  completed: boolean;
  error?: string;
}

interface AnalysisLoadingScreenProps {
  pageType: string;
  currentStep: string | null;
  steps: Step[];
  flow: 'payment' | 'homepage-analysis';
  analysisLoading: boolean;
  currentQuote: string;
  progress: number;
  showIndustrySelection?: boolean;
  selectedIndustry?: Industry | null;
  onIndustrySelect?: (industry: Industry | null) => void;
}

// Category icons mapping
const CATEGORY_ICONS: Record<string, string> = {
  'Clothing & Fashion': '👕',
  'Beauty & Personal Care': '💄',
  'Consumer Electronics & Accessories': '📱',
  'Food & Beverages': '🍽️',
  'Health & Wellness': '🧘',
  'Home & Garden': '🏠',
  'Others': '📦'
};

const PAGE_TITLES: Record<string, string> = {
  homepage: 'Homepage',
  collection: 'Collection Page',
  product: 'Product Page',
  cart: 'Cart Page',
};

const STEP_MESSAGES: Record<string, string> = {
  'validate_shopify': 'Validating your store...',
  'take_screenshot': 'Capturing your store...',
  'analyze_gemini': 'AI is analyzing...',
  'analyze_checklist': 'Generating recommendations...'
};

/**
 * Reusable loading screen component for analysis processes
 * 
 * Features:
 * - Animated background with floating elements
 * - Dynamic progress bar synchronized with analysis steps
 * - Step-by-step progress indicator
 * - Rotating motivational quotes
 * - Responsive design with modern UI
 * 
 * @param pageType - Type of page being analyzed (homepage, collection, etc.)
 * @param currentStep - Currently active analysis step
 * @param steps - Array of analysis steps with completion status
 * @param flow - Analysis flow type (payment or homepage-analysis)
 * @param analysisLoading - Whether analysis is currently in progress
 * @param currentQuote - Current motivational quote to display
 * @param progress - Current progress percentage (0-100)
 */
export default function AnalysisLoadingScreen({
  pageType,
  currentStep,
  steps,
  flow,
  analysisLoading,
  currentQuote,
  progress,
  showIndustrySelection = false,
  selectedIndustry = null,
  onIndustrySelect
}: AnalysisLoadingScreenProps) {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loadingIndustries, setLoadingIndustries] = useState(false);
  const [industryError, setIndustryError] = useState<string | null>(null);

  // Load industries when showing industry selection
  useEffect(() => {
    if (showIndustrySelection && industries.length === 0) {
      const fetchIndustries = async () => {
        try {
          setLoadingIndustries(true);
          setIndustryError(null);
          const data = await industryService.getAllIndustries();
          setIndustries(data);
        } catch (err) {
          console.error('Error fetching industries:', err);
          setIndustryError('Failed to load industries');
        } finally {
          setLoadingIndustries(false);
        }
      };

      fetchIndustries();
    }
  }, [showIndustrySelection, industries.length]);

  const handleIndustrySelect = (industry: Industry) => {
    if (onIndustrySelect) {
      // Auto-proceed when category is selected
      setTimeout(() => {
        onIndustrySelect(industry);
      }, 500); // Small delay to show the selection
    }
  };
  // Handle loading and error states for industry selection
  if (showIndustrySelection && loadingIndustries) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (showIndustrySelection && industryError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">{industryError}</div>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="relative z-10 px-4 py-12 min-h-screen flex flex-col justify-center items-center">
        {/* Main loading container */}
        <div className="max-w-4xl mx-auto text-center w-full">

          {/* Main title and subtitle */}
          <div className="mb-12 w-full">
            <h1 className="loading-header">
              {showIndustrySelection ? 'Which category are you in?' : 'Preparing your Audit'}
            </h1>
            <p className="loding-bar-sub-header mt-2">
              {showIndustrySelection ? 'Choose the category that best matches your store.' : 'Wait few seconds'}
            </p>
          </div>

          {/* Show category selection or loading animation */}
          {showIndustrySelection ? (
            <div className="mb-12">
              {/* Category selection grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {industries.map((industry) => {
                  const isSelected = selectedIndustry?.id === industry.id;
                  const icon = CATEGORY_ICONS[industry.name] || '📦';

                  return (
                    <button
                      key={industry.id}
                      onClick={() => handleIndustrySelect(industry)}
                      className={`category-capsule ${isSelected
                        ? 'active'
                        : ''
                        } cursor-pointer`}
                    >
                      <div className="text-2xl">{icon}</div>
                      <span >{industry.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Next button */}

            </div>
          ) : (
            /* Concentric circles loading animation */
            <div className="mb-12 flex justify-center">
              <div className="relative">
                <DotLottieReact
                  src="https://lottie.host/6dd55d45-53e1-4181-add3-9a70b6337a9f/qs45O6mETR.lottie"
                  loop
                  autoplay
                />
              </div>
            </div>
          )}

          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="loding-bar-indicator">
                {showIndustrySelection
                  ? 'Selecting the category...'
                  : currentStep ? STEP_MESSAGES[currentStep] || 'Preparing the Audit...' : 'Preparing the Audit...'
                }
              </span>
              <div className="flex items-center space-x-1">
                <span className="loading-step-label">
                  {showIndustrySelection 
                    ? 3 
                    : selectedIndustry 
                      ? 4 
                      : steps.filter(step => step.completed).length
                  }
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                  <g clip-path="url(#clip0_1038_14484)">
                    <path d="M12 0.5C5.383 0.5 0 5.883 0 12.5C0 19.117 5.383 24.5 12 24.5C18.617 24.5 24 19.117 24 12.5C24 5.883 18.617 0.5 12 0.5ZM11.909 15.919C11.522 16.306 11.013 16.499 10.502 16.499C9.991 16.499 9.477 16.304 9.086 15.914L6.304 13.218L7.697 11.781L10.49 14.488L16.299 8.787L17.703 10.212L11.909 15.919Z" fill="#41A563" />
                  </g>
                  <defs>
                    <clipPath id="clip0_1038_14484">
                      <rect width="24" height="24" fill="white" transform="translate(0 0.5)" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>

            {/* 5-segment progress bar with different sizes */}
            <div className="w-full rounded-full h-4 overflow-hidden">
              <div className="flex h-full gap-1">
                {/* Segment 1 - Store validation */}
                <div className={`rounded-full w-[12%] h-full transition-all duration-1000 ease-out ${steps.find(s => s.name === 'validate_shopify')?.completed ? 'loading-bar active' : 'bg-gray-200'}`}></div>

                {/* Segment 2 - Screenshot capture */}
                <div className={`rounded-full w-[16%] h-full transition-all duration-1000 ease-out ${steps.find(s => s.name === 'take_screenshot')?.completed ? 'loading-bar active' : 'bg-gray-200'}`}></div>

                {/* Segment 3 - AI Analysis */}
                <div className={`rounded-full w-[16%] h-full transition-all duration-1000 ease-out ${steps.find(s => s.name === 'analyze_gemini')?.completed ? 'loading-bar active' : 'bg-gray-200'}`}></div>

                {/* Segment 4 - Category selection */}
                <div className={`rounded-full w-[20%] h-full transition-all duration-1000 ease-out ${selectedIndustry ? 'loading-bar active' : 'bg-gray-200'}`}></div>

                {/* Segment 5 - Final recommendations */}
                <div className={`rounded-full flex-1 h-full transition-all duration-1000 ease-out ${steps.find(s => s.name === 'analyze_checklist')?.completed ? 'loading-bar active' : 'bg-gray-200'}`}></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
