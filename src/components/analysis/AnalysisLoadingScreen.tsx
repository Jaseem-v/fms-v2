'use client';

import { useState, useEffect } from 'react';

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
}

const PAGE_TITLES: Record<string, string> = {
  homepage: 'Homepage',
  collection: 'Collection Page',
  product: 'Product Page',
  cart: 'Cart Page',
};

const STEP_MESSAGES: Record<string, string> = {
  'validate_shopify': 'Preparing your store analysis...',
  'take_screenshot': 'Capturing your store\'s current state...',
  'analyze_gemini': 'AI is examining every detail...',
  'analyze_checklist': 'Generating personalized recommendations...'
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
  progress
}: AnalysisLoadingScreenProps) {
  return (
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

          {/* Dynamic quote */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
              {currentQuote}
            </h1>
            <p className="text-lg text-gray-600">
              Analyzing your {PAGE_TITLES[pageType]} for conversion opportunities
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{ 
                  width: `${Math.min(progress, 100)}%`,
                  backgroundColor: '#447c57'
                }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {Math.round(progress)}% Complete
            </p>
          </div>

          {/* Stepwise Progress Indicator - Only show for homepage-analysis flow */}
          {flow === 'homepage-analysis' && analysisLoading && (
            <div className="mt-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {steps.filter(step => step.name !== 'store_analysis').map((step, index) => {
                  const isActive = currentStep === step.name;
                  const isCompleted = step.completed;
                  
                  return (
                    <div key={step.name} className="flex flex-col items-center space-y-2">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        isCompleted 
                          ? 'text-white scale-110' 
                          : isActive 
                            ? 'text-white scale-110 animate-pulse shadow-lg' 
                            : 'bg-gray-200 text-gray-500'
                      }`} style={{
                        backgroundColor: isCompleted || isActive ? '#447c57' : undefined
                      }}>
                        {isCompleted ? '✓' : index + 1}
                      </div>
                      <span className={`text-xs text-center font-medium transition-colors duration-300 ${
                        isCompleted 
                          ? 'text-gray-600' 
                          : isActive 
                            ? 'text-gray-600' 
                            : 'text-gray-400'
                      }`} style={{
                        color: isCompleted || isActive ? '#447c57' : undefined
                      }}>
                        {STEP_MESSAGES[step.name]}
                      </span>
                      {isActive && (
                        <div className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: '#447c57' }}></div>
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
  );
}
