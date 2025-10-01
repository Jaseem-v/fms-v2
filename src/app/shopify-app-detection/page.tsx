/**
 * Shopify App Detector - Main Page
 * Main application page with URL input and results display
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { UrlInput } from '@/components/app-detection/UrlInput';
import { LoadingSpinner } from '@/components/app-detection/LoadingSpinner';
import { ProgressLoadingSpinner } from '@/components/app-detection/ProgressLoadingSpinner';
import { HowItWorks } from '@/components/app-detection/HowItWorks';
import { WhyOptimize } from '@/components/app-detection/WhyOptimize';
import { WhyPickingRight } from '@/components/app-detection/WhyPickingRight';
import { WhoIsItFor } from '@/components/app-detection/WhoIsItFor';
import { ApiService } from '@/lib/api';
import FAQSection from '@/components/home/FAQSection';

type AppState = 'idle' | 'loading' | 'error';

export default function Home() {
  const router = useRouter();
  const [state, setState] = useState<AppState>('idle');
  const [error, setError] = useState<string>('');
  const [progress, setProgress] = useState<any>(null);
  const [useStepByStep, setUseStepByStep] = useState<boolean>(true);
  // const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // // Check backend health on component mount
  // useEffect(() => {
  //   const checkBackend = async () => {
  //     try {
  //       const isHealthy = await ApiService.checkHealth();
  //       setBackendStatus(isHealthy ? 'online' : 'offline');
  //     } catch {
  //       setBackendStatus('offline');
  //     }
  //   };

  //   checkBackend();
  // }, []);

  const handleDetect = async (url: string) => {
    setState('loading');
    setError('');
    setProgress(null);

    try {
      console.log('Starting app detection for:', url);
      
      // Redirect to results page with URL parameter
      router.push(`/shopify-app-detection/results?url=${encodeURIComponent(url)}`);
    } catch (err) {
      console.error('Detection error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setState('error');
    }
  };

  const handleNewSearch = () => {
    setState('idle');
    setError('');
  };

  const renderContent = () => {
    switch (state) {
      case 'loading':
        return (
          <LoadingSpinner
            message="Redirecting to results..."
            subMessage="Please wait"
          />
        );

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
        return (
          <UrlInput
            onDetect={handleDetect}
            isLoading={false}
            error={error}
          />
        );
    }
  };

  return (
    <>
      <Head>
        <meta property="og:title" content="Shopify App Detector - Find Apps Installed on Any Store" />
        <meta property="og:description" content="Discover which Shopify apps are installed on any store. Get insights into competitor strategies and optimize your own app stack." />
        <meta property="og:image" content="https://fixmystore.com/og-image/app-detect.jpeg" />
        <meta property="og:url" content="https://fixmystore.com/shopify-app-detection" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Shopify App Detector - Find Apps Installed on Any Store" />
        <meta name="twitter:description" content="Discover which Shopify apps are installed on any store. Get insights into competitor strategies and optimize your own app stack." />
        <meta name="twitter:image" content="https://fixmystore.com/og-image/app-detect.jpeg" />
      </Head>
      <div className="min-h-screen bg-app-green">
      {/* Streaming Toggle */}


      {/* Main Content */}
      <div className="min-h-screen">

          {/* Hero Section with URL Input */}
          <div className="gradient-bg relative">
            <div className="container mx-auto px-4 py-20 ">
              <div className="flex items-center justify-center ">
                {renderContent()}
              </div>
            </div>

            <div className="items-center justify-center absolute top-20 left-0 hidden lg:flex">
              <div className='w-80 h-1 border-t border-dashed border-gray-900  '>
              </div>
              <img src="/app-icons/1.svg" alt="" />
            </div>
            <div className=" items-center justify-center absolute top-60 left-0 hidden lg:flex">
              <div className='w-70 h-1 border-t border-dashed border-gray-900  '>
              </div>
              <img src="/app-icons/2.svg" alt="" />
            </div>
            <div className=" items-center justify-center absolute top-100 left-0 hidden lg:flex">
              <div className='w-70 h-1 border-t border-dashed border-gray-900  '>
              </div>
              <img src="/app-icons/3.svg" alt="" />
            </div>
            <div className=" items-center justify-center absolute top-140 left-0 hidden lg:flex">
              <div className='w-90 h-1 border-t border-dashed border-gray-900  '>
              </div>
              <img src="/app-icons/4.svg" alt="" />
            </div>

            <div className=" items-center justify-center absolute top-20 right-0 hidden lg:flex">
              <img src="/app-icons/3.svg" alt="" />
              <div className='w-80 h-1 border-t border-dashed border-gray-900  '>
              </div>
            </div>
            <div className=" items-center justify-center absolute top-60 right-0 hidden lg:flex">
              <img src="/app-icons/4.svg" alt="" />
              <div className='w-70 h-1 border-t border-dashed border-gray-900  '>
              </div>
            </div>
            <div className=" items-center justify-center absolute top-100 right-0 hidden lg:flex">
              <img src="/app-icons/1.svg" alt="" />
              <div className='w-70 h-1 border-t border-dashed border-gray-900  '>
              </div>
            </div>
            <div className=" items-center justify-center absolute top-140 right-0 hidden lg:flex">
              <img src="/app-icons/2.svg" alt="" />
              <div className='w-90 h-1 border-t border-dashed border-gray-900  '>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <HowItWorks />

          {/* Why Optimize Apps Section */}
          {/* <WhyOptimize /> */}

          {/* Why Picking Right Apps Matters Section */}
          <WhyPickingRight />

          {/* Who Is It For Section */}
          <WhoIsItFor />

          <div className="pb-20">
            <FAQSection type="app-detection" />
          </div>
        </div>
      </div>
    </>
  );
}