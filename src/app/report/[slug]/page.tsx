'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import reportService from '../../../services/reportService';
import AnalysisReport from '../../../components/AnalysisReport';
import OverallSummary from '../../../components/OverallSummary';
import ReportLoading from '../../../components/ReportLoading';

export default function ReportPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('');
  const [reportData, setReportData] = useState<any>(null);
  const [isInProgress, setIsInProgress] = useState(false);

  useEffect(() => {
    if (slug) {
      loadReport();
    }
  }, [slug]);

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            CRO Analysis Report
          </h1>
          <p className="text-gray-600">
            {isInProgress ? 'Analysis in progress...' : 'Comprehensive analysis of your Shopify store'}
          </p>
          {reportData && (
            <div className="mt-4 text-sm text-gray-500">
              <p>Website: {reportData.websiteUrl}</p>
              <p>Created: {new Date(reportData.createdAt).toLocaleString()}</p>
              {reportData.status === 'pending' && reportData.progress && (
                <p>Progress: Step {reportData.progress.currentStep} of {reportData.progress.totalSteps}</p>
              )}
            </div>
          )}
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

        <div className="space-y-8">
          {Object.keys(report).length > 0 && (
            <>
              <OverallSummary
                report={report}
                analysisInProgress={{}}
                setShowModal={() => {}}
              />

              <AnalysisReport
                report={report}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setShowModal={() => {}}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}