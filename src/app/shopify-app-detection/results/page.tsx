/**
 * Shopify App Detection Results Page
 * Displays the detected apps and analysis results
 */

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Head from 'next/head';
import { AppDashboard } from '@/components/app-detection/AppDashboard';
import { LoadingSpinner } from '@/components/app-detection/LoadingSpinner';
import { ProgressLoadingSpinner } from '@/components/app-detection/ProgressLoadingSpinner';
import { ApiService } from '@/lib/api';
import { DetectionResult } from '@/lib/types';

type AppState = 'loading' | 'results' | 'error';

function ResultsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<AppState>('loading');
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string>('');
  const [progress, setProgress] = useState<any>(null);
  const [useStepByStep, setUseStepByStep] = useState<boolean>(true);

  // Get URL from search params
  const storeUrl = searchParams.get('url');

  useEffect(() => {
    if (!storeUrl) {
      // If no URL provided, redirect back to main page
      router.push('/shopify-app-detection');
      return;
    }

    // Start detection automatically
    handleDetect(storeUrl);
  }, [storeUrl, router]);

  const handleDetect = async (url: string) => {
    setState('loading');
    setError('');
    setResult(null);
    setProgress(null);

    try {
      console.log('Starting app detection for:', url);

      if (useStepByStep) {
        const detectionResult = await ApiService.detectAppsStepByStep(url, (progressData) => {
          console.log('Progress update:', progressData);
          setProgress(progressData);
        });
        setResult(detectionResult);
      } else {
        const detectionResult = await ApiService.detectApps(url);
        setResult(detectionResult);
      }

      setState('results');
    } catch (err) {
      console.error('Detection error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setState('error');
    }
  };

  const handleNewSearch = () => {
    router.push('/shopify-app-detection');
  };

  const renderContent = () => {
    switch (state) {
      case 'loading':
        return useStepByStep ? (
          <ProgressLoadingSpinner
            message="Finding your apps..."
            subMessage="This will only take a moment"
            progress={progress}
          />
        ) : (
          <LoadingSpinner
            message="Finding your apps..."
            subMessage="This will only take a moment"
          />
        );

      case 'results':
        return result ? (
          <AppDashboard
            storeUrl={result.storeUrl}
            detectedApps={result.detectedApps}
            onNewSearch={handleNewSearch}
          />
        ) : null;

      case 'error':
        return (
          <div className="w-full max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                Detection Failed
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {error}
              </p>
              <button
                onClick={handleNewSearch}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Try Again
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Head>
        <meta property="og:title" content="Shopify App Detection Results" />
        <meta property="og:description" content="View detected Shopify apps and get insights into the store's app strategy." />
        <meta property="og:image" content="/og-image/app-detect.jpeg" />
        <meta property="og:url" content="https://fixmystore.com/shopify-app-detection/results" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Shopify App Detection Results" />
        <meta name="twitter:description" content="View detected Shopify apps and get insights into the store's app strategy." />
        <meta name="twitter:image" content="/og-image/app-detect.jpeg" />
      </Head>
      <div className="min-h-screen bg-app-green">
        <div className="container mx-auto px-4 py-8">
          {renderContent()}
        </div>
      </div>
    </>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-app-green flex items-center justify-center"><LoadingSpinner /></div>}>
      <ResultsPageContent />
    </Suspense>
  );
}
