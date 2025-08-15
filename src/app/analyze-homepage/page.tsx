'use client';

import { useState, useEffect } from 'react';
import UrlForm from '../../components/home/UrlForm';
import authService from '../../services/authService';
import { useHomepageAnalysis } from '../../hooks/useHomepageAnalysis';
import { config } from '@/config/config';

export default function AnalyzeHomepage() {
  const [url, setUrl] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const {
    loading,
    error,
    result,
    analyzeHomepage,
    reset
  } = useHomepageAnalysis();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await authService.verifyToken();
        setIsAuthenticated(result.valid);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    try {
      await analyzeHomepage(url);
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-gray-600">Please log in to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          {/* <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Homepage Analysis
          </h1> */}
          {/* <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get a comprehensive analysis of your homepage with actionable insights to improve conversion rates
          </p> */}
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <UrlForm
            url={url}
            setUrl={setUrl}
            loading={loading}
            validatingShopify={false}
            onSubmit={handleSubmit}
          />
        </div>

        {loading && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Analyzing Homepage</h3>
              <p className="text-gray-600">Capturing screenshot and analyzing with AI...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600 text-lg">{error}</p>
              <button
                onClick={reset}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {result && (
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Analysis Results</h2>

              {/* Screenshot */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Homepage Screenshot</h3>
                <div className="border rounded-lg overflow-hidden">
                  <img
                    src={`${config.backendUrl.replace('/api', '')}/screenshots/${result.screenshotPath.split('/').pop()}`}
                    alt="Homepage Screenshot"
                    className="w-full h-auto"
                  />
                </div>
              </div>

              {/* Image Analysis */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Layout Analysis</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                    {result.imageAnalysis}
                  </pre>
                </div>
              </div>

              {/* Checklist Analysis */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Checklist Analysis Results</h3>
                <div className="space-y-4">
                  {result.checklistAnalysis.map((item, index) => (
                    <div key={index} className={`border rounded-lg p-4 ${item.status === 'PASS' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                      }`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-1 ${item.status === 'PASS'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-600'
                          }`}>
                          {item.status === 'PASS' ? '✓' : '✗'}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-2">{
                            item.status === 'FAIL' ? item.problem : item.checklistItem}</h4>
                          {/* <div className={`text-sm font-medium mb-2 ${item.status === 'PASS' ? 'text-green-600' : 'text-red-600'
                            }`}>
                            Status: {item.status}
                          </div> */}

                          {/* Reason for both PASS and FAIL items */}
                          <div className="mb-3">
                            <p className="text-gray-700 text-sm">
                              <span className="font-semibold"></span> {item.reason}
                            </p>
                          </div>

                          {item.status === 'FAIL' && item.problem && item.solution && (
                            <>
                              {/* <p className="text-gray-600 mb-3">{item.problem}</p> */}
                              <div className="bg-blue-50 border-l-4 border-blue-400 p-3">
                                <p className="text-blue-800 text-sm">
                                  <span className="font-semibold">Solution:</span> {item.solution}
                                </p>
                              </div>
                            </>
                          )}

                          {item.status === 'PASS' && (
                            <p className="text-green-700 text-sm">✓ This checklist item is properly implemented</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* <button
                onClick={reset}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Analyze Another Homepage
              </button> */}
            </div>
          </div>
        )}

        {/* <div className="mt-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to optimize your homepage?</h2>
            <p className="text-lg text-gray-600">Get started with our comprehensive homepage analysis tool above.</p>
          </div>
        </div> */}
      </div>
    </div>
  );
}
