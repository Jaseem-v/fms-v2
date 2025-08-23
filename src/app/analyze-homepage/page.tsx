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
              {/* <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Layout Analysis</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                    {result.imageAnalysis}
                  </pre>
                </div>
              </div> */}

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
                          {/* {item.status === 'FAIL' && item.image_reference && (
                            <div className="text-xs text-gray-500 mb-2">
                              📸 Reference ID: {item.image_reference}
                            </div>
                          )} */}
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

                              {/* Image Reference Example */}
                              {item.image_reference && (
                                <>
                                  {item.imageReferenceObject ? (
                                    <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                                      <h5 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <span className="text-blue-600">📸</span>
                                        Example Reference
                                      </h5>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Example Image */}
                                        <div className="border rounded-lg overflow-hidden">
                                          <img
                                            src={`https://server.fixmystore.com${item.imageReferenceObject.imageUrl}`}
                                            alt={`Example: ${item.imageReferenceObject.id}`}
                                            className="w-full h-auto object-cover"
                                          />
                                        </div>

                                        {/* Example Details */}
                                        <div className="space-y-3">
                                          {/* <div>
                                            <span className="text-sm font-medium text-gray-500">Page Type:</span>
                                            <p className="text-sm text-gray-700 capitalize">{item.imageReferenceObject.page}</p>
                                          </div>
                                          
                                          {item.imageReferenceObject.industry && (
                                            <div>
                                              <span className="text-sm font-medium text-gray-500">Industry:</span>
                                              <p className="text-sm text-gray-700">{item.imageReferenceObject.industry}</p>
                                            </div>
                                          )}
                                          
                                          {item.imageReferenceObject.country && (
                                            <div>
                                              <span className="text-sm font-medium text-gray-500">Country:</span>
                                              <p className="text-sm text-gray-700">{item.imageReferenceObject.country}</p>
                                            </div>
                                          )} */}
                                          
                                          {item.imageReferenceObject.useCases && item.imageReferenceObject.useCases.length > 0 && (
                                            <div>
                                              {/* <span className="text-sm font-medium text-gray-500">Use Cases:</span> */}
                                              <div className="mt-1 space-y-1">
                                                {/* {item.imageReferenceObject.useCases.map((useCase: string, idx: number) => (
                                                  <p key={idx} className="text-xs text-gray-600 bg-white px-2 py-1 rounded border">
                                                    {useCase}
                                                  </p>
                                                ))} */}
                                                {/* {item.imageReferenceObject.useCases.length > 2 && (
                                                  <p className="text-xs text-gray-500">
                                                    +{item.imageReferenceObject.useCases.length - 2} more use cases
                                                  </p>
                                                )} */}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                      <h5 className="font-semibold text-yellow-700 mb-2 flex items-center gap-2">
                                        <span className="text-yellow-600">📸</span>
                                        Example Reference
                                      </h5>
                                      <p className="text-sm text-yellow-600">
                                        Reference ID: {item.image_reference}
                                      </p>
                                      <p className="text-xs text-yellow-500 mt-1">
                                        Image reference object not available
                                      </p>
                                    </div>
                                  )}
                                </>
                              )}

                              {/* App Reference Example */}
                              {item.app_reference && (
                                <>
                                  {item.appReferenceObject ? (
                                    <div className="mt-4 bg-white border border-green-200 rounded-lg p-4">
                                      <h5 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <span className="text-green-600">🔧</span>
                                        Recommended App
                                      </h5>
                                      <div className="flex items-center gap-4">
                                        {/* App Icon */}
                                        <div className=" flex items-center justify-center">
                                          {item.appReferenceObject.iconUrl ? (
                                            <img
                                              src={item.appReferenceObject.iconUrl}
                                              alt={item.appReferenceObject.name}
                                              className="w-16 h-16 object-cover rounded-lg"
                                            />
                                          ) : (
                                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                              <span className="text-gray-400 text-2xl">🔧</span>
                                            </div>
                                          )}
                                        </div>

                                        {/* App Details */}
                                        <div className="space-y-3">
                                          <div>
                                            <span className="text-sm font-medium text-gray-500">App Name:</span>
                                            <p className="text-sm font-semibold text-gray-700">{item.appReferenceObject.name}</p>
                                          </div>
                                          
                                          {/* <div>
                                            <span className="text-sm font-medium text-gray-500">Category:</span>
                                            <p className="text-sm text-gray-700">{item.appReferenceObject.category}</p>
                                          </div>
                                          
                                          <div>
                                            <span className="text-sm font-medium text-gray-500">Description:</span>
                                            <p className="text-sm text-gray-700">{item.appReferenceObject.description}</p>
                                          </div> */}
                                          
                                          {/* {item.appReferenceObject.useCases && item.appReferenceObject.useCases.length > 0 && (
                                            <div>
                                              <span className="text-sm font-medium text-gray-500">Use Cases:</span>
                                              <div className="mt-1 space-y-1">
                                                {item.appReferenceObject.useCases.map((useCase: string, idx: number) => (
                                                  <p key={idx} className="text-xs text-gray-600 bg-white px-2 py-1 rounded border">
                                                    {useCase}
                                                  </p>
                                                ))}
                                              </div>
                                            </div>
                                          )} */}
                                          
                                          {item.appReferenceObject.shopifyAppUrl && (
                                            <div className="">
                                              <a
                                                href={item.appReferenceObject.shopifyAppUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors border-b border-blue-600 hover:border-blue-700"
                                              >
                                                View on Shopify App Store
                                                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                              </a>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                      <h5 className="font-semibold text-yellow-700 mb-2 flex items-center gap-2">
                                        <span className="text-yellow-600">🔧</span>
                                        Recommended App
                                      </h5>
                                      <p className="text-sm text-yellow-600">
                                        App Reference ID: {item.app_reference}
                                      </p>
                                      <p className="text-xs text-yellow-500 mt-1">
                                        App reference object not available
                                      </p>
                                    </div>
                                  )}
                                </>
                              )}
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
