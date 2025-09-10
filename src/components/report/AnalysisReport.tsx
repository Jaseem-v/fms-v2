'use client';

import { PagewiseAnalysisResult } from '@/hooks/useHomepageAnalysis';
import { useState } from 'react';
import BlurredContent from './BlurredContent';
import Link from 'next/link';

interface ImageReference {
  id: string;
  imageUrl: string;
  useCases: string[];
  uploadDate: string;
  fileName: string;
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
  [key: string]: PagewiseAnalysisResult;
}

interface AnalysisReportProps {
  report: Report | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setShowModal: (show: boolean) => void;
  isSampleReport?: boolean;
}

const backendUrl = process.env.NEXT_PUBLIC_IMAGE_PATH_URL || 'http://localhost:4000';

const PAGE_TITLES: Record<string, string> = {
  homepage: 'Homepage',
  collection: 'Collection Page',
  product: 'Product Page',
  cart: 'Cart Page',
};



export default function AnalysisReport({ report, activeTab, setActiveTab, setShowModal, isSampleReport }: AnalysisReportProps) {
  const [selectedImage, setSelectedImage] = useState<ImageReference | null>(null);
  const [selectedAppReference, setSelectedAppReference] = useState<AppReference | null>(null);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

  // Initialize expandedItems with first item of each page expanded by default
  const getDefaultExpandedItems = (): Set<string> => {
    if (!report) return new Set<string>();

    const defaultExpanded = new Set<string>();
    Object.keys(report).forEach(page => {
      if (report[page]?.checklistAnalysis?.length > 0) {
        defaultExpanded.add(`${page}-0`);
      }
    });
    return defaultExpanded;
  };

  const [expandedItems, setExpandedItems] = useState<Set<string>>(getDefaultExpandedItems());

  const toggleItem = (page: string, itemIndex: number) => {
    const itemKey = `${page}-${itemIndex}`;
    const newExpandedItems = new Set(expandedItems);

    if (newExpandedItems.has(itemKey)) {
      newExpandedItems.delete(itemKey);
    } else {
      newExpandedItems.add(itemKey);
    }

    setExpandedItems(newExpandedItems);
  };

  const isItemExpanded = (page: string, itemIndex: number) => {
    const itemKey = `${page}-${itemIndex}`;
    return expandedItems.has(itemKey);
  };

  // Get available page types with data
  const availablePages = report ? Object.keys(report).filter((key) => report[key]?.checklistAnalysis?.length > 0) : [];





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


  // Debug logging for current tab
  console.log('[AnalysisReport] Current tab:', currentTab);

  const imagePath = (url: string) => {
    if (url.includes('report-img')) {
      return url;
    }
    return `${backendUrl}${url}`;
  }

  // Check if current active tab has analysis data
  const hasActiveTabData = report && report[activeTab]?.checklistAnalysis?.length > 0;

  return (
    <div className="space-y-6">
      {/* For sample reports, show all page reports one after another */}
      {isSampleReport ? (
        <div className="report__list">
          {Object.entries(report).map(([page, analysis]) => {
            // Show all pages for sample reports
            if (!analysis?.checklistAnalysis) {
              return null;
            }

            return (
              <div key={page} className="report__item" id={page}>
                <h2 className='report__item-page'>{PAGE_TITLES[page] || page}</h2>
                <div className="report__item-list">
                  {analysis.checklistAnalysis?.map((checklistItem, index) => {
                    const isFirstItem = index === 0 && page === 'homepage';
                    return (
                      <div key={index} className={`report__item-content ${isItemExpanded(page, index) ? 'expanded' : ''}`}>
                        <h3
                          className="report__item-title"
                          onClick={() => toggleItem(page, index)}
                        >
                          {isFirstItem && <div className='report__item-explainer'>
                            <div className='report__item-explainer-line' />
                            <div className='report__item-explainer-title'>
                              Clearly mentioned problem
                            </div>
                          </div>}

                          {checklistItem.problemName}
                          <span className="toggle-indicator">
                            {isItemExpanded(page, index) ? '▼' : '▶'}
                          </span>
                        </h3>

                        {isItemExpanded(page, index) && (
                          <>
                            <div className="report__item-element report__item-element--reason">
                              <div className="report__item-element-content">
                                <p className="report__item-description">
                                  {checklistItem.reason && ` ${checklistItem.reason}`}
                                </p>
                              </div>
                            </div>

                            {checklistItem.solution && (
                              <div className="report__item-element report__item-element--solution">
                                <div className="report__item-element-content">
                                  {isFirstItem && <div className='report__item-explainer report__item-explainer--solution'>
                                    <div className='report__item-explainer-line' />
                                    <div className='report__item-explainer-title'>
                                      Solution
                                    </div>
                                  </div>}
                                  <h3 className="report__item-element-title">
                                    Solution
                                  </h3>
                                  <p className="report__item-description">{checklistItem.solution}</p>
                                </div>
                              </div>
                            )}

                            {/* Image Reference Section */}
                            {checklistItem.imageReferenceObject && (
                              <div className="report__item-element">
                                <div className="report__item-element-icon" />
                                <div className="report__item-element-content">
                                  <h3 className="report__item-element-title">
                                    Example Reference
                                  </h3>
                                  <div className="mt-3 relative">
                                    {isFirstItem && <div className='report__item-explainer report__item-explainer--image'>
                                      <div className='report__item-explainer-title'>
                                        Reference from million-dollar brands
                                      </div>
                                      <div className='report__item-explainer-line' />
                                    </div>}
                                    <img
                                      src={imagePath(checklistItem.imageReferenceObject.imageUrl)}
                                      alt="Example"
                                      className="rounded-lg  cursor-pointer hover:opacity-80 transition-opacity md:w-3/4 w-full"
                                    // onClick={() => setSelectedImage(checklistItem.imageReferenceObject)}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* App Reference Section */}
                            {checklistItem.appReferenceObject && (
                              <div className="report__item-element">
                                <div className="report__item-element-icon" />
                                <div className="report__item-element-content">
                                  <h3 className="report__item-element-title">
                                    Recommended App
                                  </h3>
                                  <div className="flex items-center space-x-3 mt-3 flex-wrap">
                                    {checklistItem.appReferenceObject.iconUrl && (
                                      <img
                                        src={checklistItem.appReferenceObject.iconUrl}
                                        alt={checklistItem.appReferenceObject.name}
                                        className="w-16 h-16 rounded-lg object-cover"
                                      />
                                    )}
                                    <div className="flex-1">
                                      <h4 className="font-medium text-gray-900 mb-1">
                                        {checklistItem.appReferenceObject.name}
                                      </h4>
                                      <Link href={checklistItem.appReferenceObject.shopifyAppUrl} target="_blank"
                                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                      >
                                        {checklistItem.appReferenceObject.shopifyAppUrl}
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        // For non-sample reports, show current tab or blurred content
        hasActiveTabData ? (
          <div className="report__list">
            {Object.entries(report).map(([page, analysis]) => {
              // Only show the active tab
              if (page !== activeTab || !analysis?.checklistAnalysis) {
                return null;
              }

              return (
                <div key={page} className="report__item" id={page}>
                  <h2 className='report__item-page'>{PAGE_TITLES[page] || page}</h2>
                  <div className="report__item-list">
                    {analysis.checklistAnalysis?.map((checklistItem, index) => {
                      return (
                        <div key={index} className={`report__item-content ${isItemExpanded(page, index) ? 'expanded' : ''}`}>
                          <h3
                            className="report__item-title"
                            onClick={() => toggleItem(page, index)}
                          >
                            {checklistItem.problemName}
                            <span className="toggle-indicator">
                              {isItemExpanded(page, index) ? '▼' : '▶'}
                            </span>
                          </h3>

                          {isItemExpanded(page, index) && (
                            <>
                              <div className="report__item-element report__item-element--reason">
                                <div className="report__item-element-content">
                                  <p className="report__item-description">
                                    {checklistItem.problem && ` ${checklistItem.problem}`}
                                  </p>
                                  <p className="report__item-description">
                                    {checklistItem.reason && ` ${checklistItem.reason}`}
                                  </p>
                                </div>
                              </div>

                              {checklistItem.solution && (
                                <div className="report__item-element report__item-element--solution">
                                  <div className="report__item-element-content">
                                    <h3 className="report__item-element-title">
                                      Solution
                                    </h3>
                                    <p className="report__item-description">{checklistItem.solution}</p>
                                  </div>
                                </div>
                              )}

                              {/* Image Reference Section */}
                              {checklistItem.imageReferenceObject && (
                                <div className="report__item-element">
                                  <div className="report__item-element-icon" />
                                  <div className="report__item-element-content">
                                    <h3 className="report__item-element-title">
                                      Example Reference
                                    </h3>
                                    <div className="mt-3 relative">
                                      <img
                                        src={imagePath(checklistItem.imageReferenceObject.imageUrl)}
                                        alt="Example"
                                        className="rounded-lg  cursor-pointer hover:opacity-80 transition-opacity md:w-3/4 w-full"
                                        onClick={() => setSelectedImage(checklistItem.imageReferenceObject)}
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* App Reference Section */}
                              {checklistItem.appReferenceObject && (
                                <div className="report__item-element">
                                  <div className="report__item-element-icon" />
                                  <div className="report__item-element-content">
                                    <h3 className="report__item-element-title">
                                      Recommended App
                                    </h3>
                                    <div className="flex items-center space-x-3 mt-3 flex-wrap">
                                      {checklistItem.appReferenceObject.iconUrl && (
                                        <img
                                          src={checklistItem.appReferenceObject.iconUrl}
                                          alt={checklistItem.appReferenceObject.name}
                                          className="w-16 h-16 rounded-lg object-cover"
                                        />
                                      )}
                                      <div className="flex-1">
                                        <h4 className="font-medium text-gray-900 mb-1">
                                          {checklistItem.appReferenceObject.name}
                                        </h4>
                                        <Link
                                          href={checklistItem.appReferenceObject.shopifyAppUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                          {checklistItem.appReferenceObject.shopifyAppUrl}
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <BlurredContent
            activeTab={activeTab}
            pageType={Object.keys(report || {}).find(page => report?.[page]?.checklistAnalysis?.length > 0)}
            analysisResult={report}
            onPaymentClick={() => window.location.href = '/payment'}
          />
        )
      )}

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