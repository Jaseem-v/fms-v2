'use client';

import { useState } from 'react';

interface AIChunk {
  id: string;
  imageUrl: string;
  useCases: string;
  uploadDate: string;
  fileName: string;
}

interface AnalysisItem {
  problem: string;
  solution: string;
  relevantChunks?: AIChunk[];
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

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace('/api', '');

const PAGE_TITLES: Record<string, string> = {
  homepage: 'Homepage',
  collection: 'Collection Page',
  product: 'Product Page',
  cart: 'Cart Page',
};

export default function AnalysisReport({ report, activeTab, setActiveTab, setShowModal }: AnalysisReportProps) {
  const [selectedChunk, setSelectedChunk] = useState<AIChunk | null>(null);

  // Get available page types with data
  const availablePages = report ? Object.keys(report).filter((key) => report[key] && report[key].length > 0) : [];

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

  // Use activeTab if it's available, otherwise default to first available
  const currentTab = availablePages.includes(activeTab) ? activeTab : availablePages[0];
  const analysis = report[currentTab] || [];

  return (
    <div className="space-y-6">
      {/* Header with Download Button */}
      <div className="flex justify-between items-center mb-4">
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
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {availablePages.map((page) => (
          <button
            key={page}
            className={`px-4 py-2 rounded-t-lg font-medium border-b-2 transition-colors ${
              currentTab === page
                ? 'border-blue-600 text-blue-700 bg-blue-50'
                : 'border-transparent text-gray-600 bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab(page)}
          >
            {PAGE_TITLES[page] || page}
          </button>
        ))}
      </div>

      {/* Analysis for current tab */}
      {analysis.map((item, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Problem {index + 1}
            </h3>
            <p className="text-gray-700 mb-3">{item.problem}</p>
            <h4 className="text-md font-medium text-gray-900 mb-2">Solution</h4>
            <p className="text-gray-700">{item.solution}</p>
          </div>

          {/* Relevant Chunks */}
          {item.relevantChunks && item.relevantChunks.length > 0 && (
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-900 mb-3">
                Relevant Examples ({item.relevantChunks.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {item.relevantChunks.map((chunk) => (
                  <div
                    key={chunk.id}
                    className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedChunk(chunk)}
                  >
                    <div className="aspect-video bg-gray-100">
                      <img
                        src={`${backendUrl}${chunk.imageUrl}`}
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
                        {chunk.useCases.length > 80 
                          ? `${chunk.useCases.substring(0, 80)}...` 
                          : chunk.useCases
                        }
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Modal for chunk details */}
      {selectedChunk && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Example Details</h3>
                <button
                  onClick={() => setSelectedChunk(null)}
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
                  src={`${backendUrl}${selectedChunk.imageUrl}`}
                  alt="Example"
                  className="w-full rounded-lg"
                />
              </div>

              {/* Use Cases */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Use Cases</h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedChunk.useCases}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 