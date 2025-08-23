'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Metadata } from 'next';
import reportService from '../../../services/reportService';
import AnalysisReport from '../../../components/report/AnalysisReport';
import OverallSummary from '../../../components/report/OverallSummary';
import ReportLoading from '../../../components/report/ReportLoading';
import DownloadModal from '@/components/report/DownloadModal';
import FloatingButton from '@/components/ui/FloatingButton';
import { useAnalysis } from '@/hooks/useAnalysis';
import { initialReport } from '@/utils/initialReport';

export const metadata: Metadata = {
  title: 'CRO Analysis Report - FixMyStore',
  description: 'Your personalized store analysis report',
  robots: {
    index: true,
    follow: true,
  },
};

const PAGE_TITLES: Record<string, string> = {
  homepage: 'Homepage',
  collection: 'Collection Page',
  product: 'Product Page',
  cart: 'Cart Page',
};

export default function ReportPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [report, setReport] = useState<any>(initialReport);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('homepage');
  const [reportData, setReportData] = useState<any>(null);
  const [isInProgress, setIsInProgress] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    mobile: '',
  });
  const [downloadLoading, setDownloadLoading] = useState(false);

  // Sticky input field states
  const [newUrl, setNewUrl] = useState<string>('');
  const [urlError, setUrlError] = useState<string>('');
  const [isSticky, setIsSticky] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    showModal,
    setShowModal,
    reportUrl,
    setUrl
  } = useAnalysis();

  // Hide main layout's FloatingButton when on report page
  useEffect(() => {
    const mainFloatingButton = document.querySelector('.fixed.bottom-6.right-6.z-50') as HTMLElement;
    if (mainFloatingButton) {
      mainFloatingButton.style.display = 'none';
    }

    return () => {
      if (mainFloatingButton) {
        mainFloatingButton.style.display = 'block';
      }
    };
  }, []);

  // Sticky input field scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (!inputWrapperRef.current || !inputContainerRef.current) return;

      const wrapperRect = inputWrapperRef.current.getBoundingClientRect();
      const isMobile = window.innerWidth <= 768;

      if (isMobile && wrapperRect.top <= 0) {
        setIsSticky(true);
        document.body.style.paddingBottom = '60px';
      } else {
        setIsSticky(false);
        document.body.style.paddingBottom = '0px';
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.style.paddingBottom = '0px';
    };
  }, []);

  // Auto-switch tabs based on scroll position
  useEffect(() => {
    const handleScrollForTabs = () => {
      const pageSections = Object.keys(PAGE_TITLES);
      let currentSection = '';

      // Find which section is currently most visible in the viewport
      for (const section of pageSections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top;
          const elementBottom = rect.bottom;
          const viewportHeight = window.innerHeight;

          // Check if the section is significantly visible in the viewport
          if (elementTop <= viewportHeight * 0.3 && elementBottom >= viewportHeight * 0.3) {
            currentSection = section;
            break;
          }
        }
      }

      // Update activeTab if we found a new section and it's different from current
      if (currentSection && currentSection !== activeTab) {
        setActiveTab(currentSection);
      }
    };

    // Add scroll listener for tab switching
    window.addEventListener('scroll', handleScrollForTabs);
    
    return () => {
      window.removeEventListener('scroll', handleScrollForTabs);
    };
  }, [activeTab]);

  // URL validation helper
  const validateUrl = (url: string): boolean => {
    if (!url || url.trim() === '') return false;

    try {
      const normalizedUrl = url.match(/^https?:\/\//) ? url : `https://${url}`;
      const urlObj = new URL(normalizedUrl);
      const hasValidHostname = Boolean(urlObj.hostname) && urlObj.hostname.includes('.');
      const hasValidProtocol = urlObj.protocol === 'http:' || urlObj.protocol === 'https:';

      return hasValidHostname && hasValidProtocol;
    } catch (error) {
      return false;
    }
  };

  // Handle new analysis submission
  const handleNewAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();

    setUrlError('');

    // if (!validateUrl(newUrl)) {
    //   setUrlError('Please enter a valid website URL (e.g., example.com or https://shopify.com)');
    //   return;
    // }

    try {
      setIsAnalyzing(true);
      const normalizedUrl = newUrl.match(/^https?:\/\//) ? newUrl : `https://${newUrl}`;

      // Redirect to analyze page with new URL
      window.location.href = `/payment?url=${encodeURIComponent(normalizedUrl)}`;
    } catch (error) {
      console.error('Error starting new analysis:', error);
      setUrlError('Failed to start analysis. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNewUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrlValue = e.target.value;
    setNewUrl(newUrlValue);

    if (urlError) {
      setUrlError('');
    }
  };

  // Custom download handler for report page
  const handleUserInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setDownloadLoading(true);

      // Use the local report state instead of the hook's report state
      if (!report || typeof report !== 'object' || Object.keys(report).length === 0) {
        throw new Error('No report data available for download');
      }

      if (!reportData?.websiteUrl) {
        throw new Error('No URL provided for report generation');
      }

      const analysisService = (await import('../../../services/analysisService')).default;
      const pdfBlob = await analysisService.downloadReport(report, reportData.websiteUrl, userInfo);

      // Create a download link
      const downloadUrl = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;

      // Create filename with website URL and "audit report"
      try {
        const domain = new URL(reportData.websiteUrl).hostname;
        const cleanDomain = domain.replace(/[^a-zA-Z0-9.-]/g, '-');
        const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        link.download = `${cleanDomain}-audit-report-${timestamp}.pdf`;
      } catch (urlError) {
        // Fallback if URL parsing fails
        const timestamp = new Date().toISOString().split('T')[0];
        link.download = `audit-report-${timestamp}.pdf`;
      }

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL
      window.URL.revokeObjectURL(downloadUrl);

      // Close modal
      setShowModal(false);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download report. Please try again.');
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // useEffect(() => {
  //   if (slug) {
  //     loadReport();
  //   }
  // }, [slug]);

  const loadReport = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await reportService.getReportBySlug(slug);

      if (result.success && result.report) {
        setReportData(result.report);

        // Check if report is still in progress
        if (result.report.status === 'pending') {
          setIsInProgress(true);
          // If in progress, show progress indicator
          if (result.report.progress) {
            setReport(result.report.analysisData || {});

          } else {
            setReport({});
          }
        } else {
          setIsInProgress(false);
          setReport(result.report.analysisData);
        }

        console.log("result.report.websiteUrl", result.report.websiteUrl);


        setUrl(result.report.websiteUrl);


        // Set the first page type as active tab
        const pageTypes = Object.keys(result.report.analysisData || {});
        if (pageTypes.length > 0) {
          setActiveTab(pageTypes[0]);
        }
      } else {
        setError(result.message || 'Report not found');
      }
    } catch (error) {
      console.error('Error loading report:', error);
      setError('Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  // Poll for updates if report is in progress
  useEffect(() => {
    if (!isInProgress || !reportData) return;

    const pollInterval = setInterval(async () => {
      try {
        const result = await reportService.getReportBySlug(slug);

        if (result.success && result.report) {
          setReportData(result.report);

          if (result.report.status === 'completed') {
            setIsInProgress(false);
            setReport(result.report.analysisData);
          } else if (result.report.analysisData) {
            setReport(result.report.analysisData);
          }
        }
      } catch (error) {
        console.error('Error polling report:', error);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
  }, [isInProgress, reportData, slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="w-16 h-16 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Report...</h2>
            <p className="text-gray-600">Please wait while we load your analysis report.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Report Not Found</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Return to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50">

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Report Data</h2>
            <p className="text-gray-600">This report doesn't contain any analysis data.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          {/* <h1 className="text-3xl font-bold text-gray-900 mb-2">
            CRO Analysis Report
          </h1>
          <p className="text-gray-600">
            {isInProgress ? 'Analysis in progress...' : 'Comprehensive analysis of your Shopify store'}
          </p> */}
          {/* {reportData && (
            <div className="mt-4 text-sm text-gray-500"> */}
          {/* <p>Website: {reportData.websiteUrl}</p> */}
          {/* <p>Created: {new Date(reportData.createdAt).toLocaleString()}</p>
              {reportData.status === 'pending' && reportData.progress && (
                <p>Progress: Step {reportData.progress.currentStep} of {reportData.progress.totalSteps}</p>
              )} */}
          {/* </div>
          )} */}
        </div>

        {/* Sticky Input Field for New Analysis */}
        <div className="mb-8">
          <div className="hero__input-wrapper" ref={inputWrapperRef}>
            <form
              className={`hero__input-container desktop-hidden  hero__input-container--sticky`}
              onSubmit={handleNewAnalysis}
              ref={inputContainerRef}
            >
              <input
                ref={inputRef}
                type="text"
                placeholder='Analyze another store URL'
                className={`hero__input-field ${urlError ? 'hero__input-field--error' : ''}`}
                value={newUrl}
                onChange={handleNewUrlChange}

              />

              <button className='hero__input-button' type='submit' disabled={isAnalyzing}>
                {isAnalyzing ? 'Starting...' : 'Fix My Store'}

                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M13 17L18 12L13 7M6 17L11 12L6 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </form>

            {urlError && (
              <div className="hero__input-error">
                {urlError}
              </div>
            )}
          </div>
        </div>

        {isInProgress && (
          <div className="mb-8">
            <ReportLoading
              message="Analysis in progress... This page will update automatically as new data becomes available."
              showProgress={true}
              progress={reportData?.progress ? (reportData.progress.currentStep / reportData.progress.totalSteps) * 100 : 0}
              report={report}
            />
          </div>
        )}

        <div className="space-y-4">
          {Object.keys(report).length > 0 && (
            <>
              <OverallSummary
                report={report}
                analysisInProgress={{}}
                setShowModal={setShowModal}
                noViewReport={true}
                reportUrl={reportUrl}
                performanceScore={59}
                isSampleReport={true}

              />

              <div className="rounded-lg overflow-hidden sticky top-0 z-10">
                <div className="report__tabs">
                  {Object.entries(PAGE_TITLES).map(([key, title]) => (
                    <button
                      key={key}
                      className={`report__tab ${activeTab === key ? 'active' : ''}`}
                      onClick={() => {
                        setActiveTab(key);
                        // Scroll to the corresponding page section
                        const element = document.getElementById(key);
                        if (element) {
                          element.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                          });
                        }
                      }}
                    >
                      {title.replace('Page', '')}
                    </button>
                  ))}
                </div>
              </div>

              <AnalysisReport
                report={report}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setShowModal={setShowModal}
              />
            </>
          )}

          <DownloadModal
            showModal={showModal}
            setShowModal={setShowModal}
            userInfo={userInfo}
            handleUserInfoChange={handleUserInfoChange}
            handleUserInfoSubmit={handleUserInfoSubmit}
            downloadLoading={downloadLoading}
            reportUrl={reportUrl}
          />
        </div>
      </div>

      {/* Report page specific FloatingButton that navigates to /payment */}
      <FloatingButton path="/payment" />
    </div>
  );
}