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

    useEffect(() => {
        if (!websiteUrl) {
            router.push('/');
            return;
        }

        const timer = setTimeout(() => {
            setShowLoading(false);
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
    }, [websiteUrl, router]);

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

                        {/* <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">What you'll get:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Detailed conversion analysis</li>
                  <li>• Actionable recommendations</li>
                  <li>• Screenshot comparisons</li>
                  <li>• App suggestions</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Analysis includes:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Homepage optimization</li>
                  <li>• Product page improvements</li>
                  <li>• Cart abandonment fixes</li>
                  <li>• Collection page enhancements</li>
                </ul>
              </div>
            </div> */}

                        {/* <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Ready to boost your conversions?
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      Get instant access to your comprehensive CRO analysis with actionable insights to increase your store's revenue.
                    </p>
                  </div>
                </div>
              </div>
            </div> */}
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