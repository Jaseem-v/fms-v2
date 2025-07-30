'use client';

import { useState } from 'react';

interface ImageReference {
  id: string;
  imageUrl: string;
  useCases: string[];
  uploadDate: string;
  fileName: string;
}

interface AnalysisItem {
  problem: string;
  solution: string;
  relevantImages?: ImageReference[];
  relevantAppReferences?: AppReference[];
  screenshotUrl?: string;
}

interface AppReference {
  _id: string;
  name: string;
  iconUrl: string;
  description: string;
  useCases: string[];
  shopifyAppUrl: string;
  category: string;
  scrapedAt: string;
}

interface Report {
  [key: string]: AnalysisItem[];
}

interface AnalysisReportProps {
  report: Report | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setShowModal: (show: boolean) => void;
}

const backendUrl = process.env.NEXT_PUBLIC_IMAGE_PATH_URL || 'http://localhost:4000';

const PAGE_TITLES: Record<string, string> = {
  homepage: 'Homepage',
  collection: 'Collection Page',
  product: 'Product Page',
  cart: 'Cart Page',
};

export default function AnalysisReport({ report, activeTab, setActiveTab, setShowModal }: AnalysisReportProps) {
  const [selectedImage, setSelectedImage] = useState<ImageReference | null>(null);
  const [selectedAppReference, setSelectedAppReference] = useState<AppReference | null>(null);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

  // Get available page types with data
  const availablePages = report ? Object.keys(report).filter((key) => report[key] && report[key].length > 0) : [];

  // Debug logging
  console.log('[AnalysisReport] Received report:', report);
  console.log('[AnalysisReport] Active tab:', activeTab);
  console.log('[AnalysisReport] Available pages:', availablePages);
  console.log('[AnalysisReport] Backend URL:', backendUrl);

  // If no data at all, show message
  if (!report || availablePages.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No analysis available</h3>
          <p className="text-gray-500">Please upload a screenshot to get started with the analysis.</p>
        </div>
      </div>
    );
  }

  // Use activeTab if it's available and valid, otherwise default to first available
  const currentTab = activeTab && availablePages.includes(activeTab) ? activeTab : availablePages[0];
  const analysis = report[currentTab] || [];

  // Debug logging for current tab
  console.log('[AnalysisReport] Current tab:', currentTab);

  // Show all screenshots above the report
  const screenshotPageOrder = ['homepage', 'collection', 'product', 'cart'];

  const hasScreenshots = availablePages.length > 0 && availablePages.some(page => {
    const pageAnalysis = report[page];
    return pageAnalysis && pageAnalysis.length > 0 && pageAnalysis[0].screenshotUrl;
  });

  return (
    <div className="space-y-6">
      {/* All Page Screenshots Gallery */}
      {/* <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Page Screenshots</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {availablePages.map((page) => {
            const pageAnalysis = report[page];
            const hasScreenshot = pageAnalysis && pageAnalysis.length > 0 && pageAnalysis[0].screenshotUrl;

            return (
              <div key={page} className="group relative">
                <div
                  className="aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  onClick={() => hasScreenshot && pageAnalysis[0].screenshotUrl && setSelectedScreenshot(pageAnalysis[0].screenshotUrl)}
                >
                  {hasScreenshot ? (
                    <>
                      <img
                        src={pageAnalysis[0].screenshotUrl}
                        alt={`${PAGE_TITLES[page] || page} preview`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onLoad={() => console.log(`[AnalysisReport] Gallery thumbnail loaded:`, pageAnalysis[0].screenshotUrl)}
                        onError={(e) => {
                          console.error(`[AnalysisReport] Gallery thumbnail failed:`, pageAnalysis[0].screenshotUrl);
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                  
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-gray-400 text-xs text-center">
                        <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        No Image
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p className="text-sm font-medium text-gray-900">{PAGE_TITLES[page] || page}</p>
                  <p className="text-xs text-gray-500">{pageAnalysis?.length || 0} issues</p>
                </div>
              </div>
            );
          })}
        </div>
      </div> */}

      {/* Header with Download Button */}
      {/* <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Analysis Report</h2>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Report
        </button>
      </div> */}

      {/* Tabs */}
      <div className="report__tabs">
        {availablePages.map((page) => {
          const pageAnalysis = report[page];
          const hasScreenshot = pageAnalysis && pageAnalysis.length > 0 && pageAnalysis[0].screenshotUrl;

          return (
            <button
              key={page}
              className={`report__tab ${currentTab === page
                ? 'active'
                : ''
                }`}
              onClick={() => setActiveTab(page)}
            >
              {/* {hasScreenshot && (
                <div className="w-6 h-6 rounded overflow-hidden flex-shrink-0">
                  <img
                    src={pageAnalysis[0].screenshotUrl}
                    alt={`${PAGE_TITLES[page] || page} preview`}
                    className="w-full h-full object-cover"
                    onLoad={() => console.log(`[AnalysisReport] Tab thumbnail loaded:`, pageAnalysis[0].screenshotUrl)}
                    onError={(e) => {
                      console.error(`[AnalysisReport] Tab thumbnail failed:`, pageAnalysis[0].screenshotUrl);
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )} */}
              {PAGE_TITLES[page] || page}
            </button>
          );
        })}
      </div>

      {/* Analysis for current tab */}

      <div className="report__list">
        {analysis.map((item, index) => {
          console.log(`[AnalysisReport] Item ${index}:`, item);
          console.log(`[AnalysisReport] Item ${index} screenshot URL:`, item.screenshotUrl);
          return (
            <div key={index} className="report__item">

              <h2 className='report__item-number'>{index + 1}</h2>
              <div className="report__item-content">
                <div className="report__item-element">
                  <div className="report__item-title-container">
                    <h3 className="report__item-title">
                      Problem
                    </h3>
                  </div>
                  <p className="report__item-description">{item.problem}</p>
                </div>
                <div className="report__item-element">
                  <div className="report__item-title-container report__item-title-container--solution">
                    <h3 className="report__item-title">
                      Solution
                    </h3>
                  </div>
                  <p className="report__item-description">{item.solution}</p>
                </div>

                {item.relevantImages && item.relevantImages.length > 0 && (
                  <div className="">
                    <div className="report__item-title-container report__item-title-container--referance">
                      <h3 className="report__item-title">
                        Relevant Examples ({item.relevantImages.length})
                      </h3>
                    </div>
                    <div className="report__item-images">
                      {item.relevantImages.map((image) => (
                        <div
                          key={image.id}
                          className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => setSelectedImage(image)}
                        >
                          <div className="aspect-video bg-gray-100">
                            <img
                              src={`${backendUrl}${image.imageUrl}`}
                              alt="Relevant example"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02MCAxMDBDNjAgODguOTU0MyA2OC45NTQzIDgwIDgwIDgwQzkxLjA0NTcgODAgMTAwIDg4Ljk1NDMgMTAwIDEwMEMxMDAgMTExLjA0NiA5MS4wNDU3IDEyMCA4MCAxMjBDNjguOTU0MyAxMjAgNjAgMTExLjA0NiA2MCAxMDBaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik04MCAxNDBDNjguOTU0MyAxNDAgNjAgMTMxLjA0NiA2MCAxMjBMMTAwIDEyMEMxMDAgMTMxLjA0NiA5MS4wNDU3IDE0MCA4MCAxNDBaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo=';
                              }}
                            />
                          </div>
                          <div className="p-3">
                            <p className="text-sm text-gray-700 line-clamp-2">
                              {image.useCases.join(', ').length > 80
                                ? `${image.useCases.join(', ').substring(0, 80)}...`
                                : image.useCases.join(', ')
                              }
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {item.relevantAppReferences && item.relevantAppReferences.length > 0 && (
                  <div className="">
                    <div className="report__item-title-container report__item-title-container--app">
                      <h3 className="report__item-title">
                        Recommended Apps ({item.relevantAppReferences.length})
                      </h3>
                    </div>
                    <div className="report__item-images">
                      {item.relevantAppReferences.map((app) => (
                        <div
                          key={app._id}
                          className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => setSelectedAppReference(app)}
                        >
                          <div className="p-4">
                            <div className="flex items-center space-x-3 mb-3">
                              {app.iconUrl && (
                                <img
                                  src={app.iconUrl}
                                  alt={app.name}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <h5 className="text-sm font-medium text-gray-900 truncate">{app.name}</h5>
                                <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                  {app.category}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-700 line-clamp-2">
                              {app.description.length > 100
                                ? `${app.description.substring(0, 100)}...`
                                : app.description
                              }
                            </p>
                            <div className="mt-3 flex flex-wrap gap-1">
                              {app.useCases.slice(0, 2).map((useCase, index) => (
                                <span
                                  key={index}
                                  className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                                >
                                  {useCase}
                                </span>
                              ))}
                              {app.useCases.length > 2 && (
                                <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                  +{app.useCases.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Relevant Images */}


              {/* Relevant App References */}

            </div>
          );
        })}

      </div>
      {/* Modal for image details */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Example Details</h3>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Image */}
              <div className="mb-4">
                <img
                  src={`${backendUrl}${selectedImage.imageUrl}`}
                  alt="Example"
                  className="w-full rounded-lg"
                />
              </div>

              {/* Use Cases */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Use Cases</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {selectedImage.useCases.map((useCase: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>{useCase}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for app reference details */}
      {selectedAppReference && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">App Details</h3>
                <button
                  onClick={() => setSelectedAppReference(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* App Header */}
              <div className="flex items-start space-x-4 mb-6">
                {selectedAppReference.iconUrl && (
                  <img
                    src={selectedAppReference.iconUrl}
                    alt={selectedAppReference.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">{selectedAppReference.name}</h4>
                  <span className="inline-block px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                    {selectedAppReference.category}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h5 className="text-sm font-medium text-gray-900 mb-2">Description</h5>
                <p className="text-sm text-gray-700 leading-relaxed">{selectedAppReference.description}</p>
              </div>

              {/* Use Cases */}
              <div className="mb-6">
                <h5 className="text-sm font-medium text-gray-900 mb-2">Use Cases</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedAppReference.useCases.map((useCase, index) => (
                    <span
                      key={index}
                      className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                    >
                      {useCase}
                    </span>
                  ))}
                </div>
              </div>

              {/* App Link */}
              <div className="border-t pt-4">
                <a
                  href={selectedAppReference.shopifyAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View on Shopify App Store
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for page screenshot */}
      {selectedScreenshot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {PAGE_TITLES[currentTab] || currentTab} Screenshot
                </h3>
                <button
                  onClick={() => setSelectedScreenshot(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Screenshot */}
              <div className="text-center">
                <img
                  src={selectedScreenshot}
                  alt={`${PAGE_TITLES[currentTab] || currentTab} screenshot`}
                  className="w-full h-auto max-w-full rounded-lg shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02MCAxMDBDNjAgODguOTU0MyA2OC45NTQzIDgwIDgwIDgwQzkxLjA0NTcgODAgMTAwIDg4Ljk1NDMgMTAwIDEwMEMxMDAgMTExLjA0NiA5MS4wNDU3IDEyMCA4MCAxMjBDNjguOTU0MyAxMjAgNjAgMTExLjA0NiA2MCAxMDBaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik04MCAxNDBDNjguOTU0MyAxNDAgNjAgMTMxLjA0NiA2MCAxMjBMMTAwIDEyMEMxMDAgMTMxLjA0NiA5MS4wNDU3IDE0MCA4MCAxNDBaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo=';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 