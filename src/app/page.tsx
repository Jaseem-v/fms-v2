'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import UrlForm from '../components/UrlForm';
import StatusDisplay from '../components/StatusDisplay';
import ScreenshotDisplay from '../components/ScreenshotDisplay';
import AnalysisReport from '../components/AnalysisReport';
import OverallSummary from '../components/OverallSummary';
import DownloadModal from '../components/DownloadModal';
import ScreenshotModal from '../components/ScreenshotModal';
import { useAnalysis } from '../hooks/useAnalysis';

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
}

interface Report {
  [key: string]: AnalysisItem[];
}

export default function Home() {
  const [selectedScreenshot, setSelectedScreenshot] = useState<{ pageType: string, url: string } | null>(null);

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
    handleSubmit,
    handleUserInfoSubmit,
    handleUserInfoChange,
    handleUrlChange,
    formatTime,
    statusMessages,
  } = useAnalysis();

  // Debug log for report
  console.log('Report data:', report);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;25&quot; height=&quot;25&quot; viewBox=&quot;0 0 25 25&quot; fill=&quot;none&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cpath d=&quot;M1 1h1v1H1V1zm0 23h1v1H1v-1zm23 0h1v1h-1v-1zm0-23h1v1h-1V1z&quot; stroke=&quot;%23e5e7eb&quot; stroke-width=&quot;0.5&quot;/%3E%3C/svg%3E')] opacity-30"></div>

      {/* Gradient Blob */}
      <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-80 w-[1000px] h-[500px] bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full blur-[200px] opacity-20"></div>

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-6xl min-h-screen flex flex-col justify-center">
        <Header />

        <main className="space-y-8">
          <UrlForm
            url={url}
            setUrl={handleUrlChange}
            loading={loading}
            validatingShopify={validatingShopify}
            onSubmit={handleSubmit}
          />

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

          {analysisComplete && !loading && report && (
            <div className="max-w-4xl mx-auto bg-green-50 border border-green-200 rounded-lg p-4" role="alert">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-green-800">
                  <span className="text-green-500">🎉</span>
                  Analysis completed successfully! Your CRO report is ready below.
                </div>
                <div className="text-center">
                  <div className="text-lg font-mono font-bold text-green-800">
                    {formatTime(elapsedTime)}
                  </div>
                  <div className="text-xs text-green-600">Total Time</div>
                </div>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="max-w-4xl mx-auto bg-green-50 border border-green-200 rounded-lg p-4" role="alert">
              <div className="flex items-center gap-2 text-green-800">
                <span className="text-green-500">✓</span>
                {successMessage}
              </div>
            </div>
          )}

          {!shopifyValidationError && (
            <ScreenshotDisplay
              screenshotUrls={screenshotUrls}
              setSelectedScreenshot={setSelectedScreenshot}
            />
          )}

          {!shopifyValidationError && !analysisComplete && !report && (
            <StatusDisplay
              status={status}
              loading={loading}
              elapsedTime={elapsedTime}
              timerActive={timerActive}
              analysisComplete={analysisComplete}
              report={report}
              analysisInProgress={analysisInProgress}
              statusMessages={statusMessages}
              formatTime={formatTime}
            />
          )}

          {!shopifyValidationError && report && Object.keys(report).length > 0 && (
            <OverallSummary
              report={report}
              analysisInProgress={analysisInProgress}
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
        </main>
      </div>

      <DownloadModal
        showModal={showModal}
        setShowModal={setShowModal}
        userInfo={userInfo}
        handleUserInfoChange={handleUserInfoChange}
        handleUserInfoSubmit={handleUserInfoSubmit}
      />

      <ScreenshotModal
        selectedScreenshot={selectedScreenshot}
        setSelectedScreenshot={setSelectedScreenshot}
      />
    </div>
  );
}
