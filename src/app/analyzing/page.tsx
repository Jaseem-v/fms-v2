'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ReportLoading from '../../components/report/ReportLoading';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Navbar from '../../components/layout/Navbar';

const PAGE_TITLES: Record<string, string> = {
  homepage: 'Homepage',
  collection: 'Collection Page',
  product: 'Product Page',
  cart: 'Cart Page',
};

function AnalyzingPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const websiteUrl = searchParams.get('url');

  const [showLoading, setShowLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('homepage');
  const [progress, setProgress] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    if (!websiteUrl) {
      router.push('/');
      return;
    }

    // Preload all blurred images
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
        setImagesLoaded(true); // Continue anyway
      }
    };

    preloadImages();

    const timer = setTimeout(() => {
      // Only end loading if both timer and images are ready
      if (imagesLoaded) {
        setShowLoading(false);
      }
    }, 15000);

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return 95;
        return prev + 0.5;
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [websiteUrl, router, imagesLoaded]);

  // Handle case where images load before timer
  useEffect(() => {
    if (imagesLoaded && progress >= 95) {
      const finalTimer = setTimeout(() => {
        setShowLoading(false);
      }, 1000); // Small delay to show completion

      return () => clearTimeout(finalTimer);
    }
  }, [imagesLoaded, progress]);

  const handlePaymentClick = () => {
    router.push(`/payment?url=${encodeURIComponent(websiteUrl || '')}`);
  };

  const handleBackClick = () => {
    router.push('/');
  };

  const blurredImg = activeTab === 'homepage' ? '1' : activeTab === 'collection' ? '2' : activeTab === 'product' ? '3' : '4'

  if (showLoading) {
    return (
      <div className="min-h-screen bg-green-50 relative overflow-hidden">
        {/* <Navbar /> */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;25&quot; height=&quot;25&quot; viewBox=&quot;0 0 25 25&quot; fill=&quot;none&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cpath d=&quot;M1 1h1v1H1V1zm0 23h1v1H1v-1zm23 0h1v1h-1v-1zm0-23h1v1h-1V1z&quot; stroke=&quot;%23e5e7eb&quot; stroke-width=&quot;0.5&quot;/%3E%3C/svg%3E')] opacity-30"></div>

        <div className="relative z-10 px-4 py-12 min-h-screen flex flex-col justify-center">
          <div className='mt-[-100px] analyze-loading'>
            <DotLottieReact
              src="https://lottie.host/a1b1eddc-5bf6-4259-bfe0-17b695d57e6f/X7bQ4xuwAv.lottie"
              loop
              autoplay={true}
            />
          </div>

          <ReportLoading
            message="Analyzing your store for conversion optimization opportunities..."
            showProgress={true}
            progress={progress}
          />
          
          {!imagesLoaded && (
            <div className="text-center mt-4">
              <div className="inline-flex items-center text-sm text-gray-600">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin mr-2"></div>
                Preloading images...
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* <Navbar /> */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <button
            onClick={handleBackClick}
            className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Store Analysis
          </h1>
          <p className="text-gray-600">
            Here's what we found for {websiteUrl}
          </p>
        </div>

        <div className=" rounded-lg overflow-hidden">
          <div className="report__tabs">
            {Object.entries(PAGE_TITLES).map(([key, title]) => (
              <button
                key={key}
                className={`report__tab ${activeTab === key ? 'active' : ''}`}
                onClick={() => setActiveTab(key)}
              >
                {title}
              </button>
            ))}
          </div>

          <div className="mt-6">
            <div className="relative">
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
                      Unlock Full Report - $49
                    </button>
                  </div>
                </div>
              </div>
            </div>


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