interface AnalysisItem {
  problem: string;
  solution: string;
}

interface Report {
  [key: string]: AnalysisItem[];
}

interface AnalysisReportProps {
  report: Report | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  analysisComplete: boolean;
  setShowModal: (show: boolean) => void;
  screenshotsInProgress: {[key: string]: boolean};
  screenshotUrls: {[key: string]: string};
  analysisInProgress: {[key: string]: boolean};
}

const renderAnalysisItem = (item: AnalysisItem, index: number) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-4">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
          {index + 1}
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                🤔 Problem
              </span>
            </div>
            <p className="text-gray-700">{item.problem}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                💡 Solution
              </span>
            </div>
            <p className="text-gray-700">{item.solution}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AnalysisReport({
  report,
  activeTab,
  setActiveTab,
  analysisComplete,
  setShowModal,
  screenshotsInProgress,
  screenshotUrls,
  analysisInProgress
}: AnalysisReportProps) {
  if (!report || Object.keys(report).length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-4xl mx-auto">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">
          Analysis Report
          {!analysisComplete && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              (Live updates in progress...)
            </span>
          )}
          {!analysisComplete && report && Object.keys(report).length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              {Object.keys(report).length} of 4 pages analyzed
            </div>
          )}
        </h2>
        {analysisComplete && (
          <button
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
            onClick={() => setShowModal(true)}
          >
            ⬇️ Download Report
          </button>
        )}
      </div>
      
            <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {['homepage', 'collection', 'product', 'cart'].map((pageType) => {
            if (!report[pageType]) return null;
            return (
              <button
                key={pageType}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                  activeTab === pageType
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab(pageType)}
              >
                {pageType.charAt(0).toUpperCase() + pageType.slice(1)} Page
                {screenshotsInProgress[pageType] && (
                  <span className="text-blue-500 animate-spin" title="Taking screenshot...">
                    📸
                  </span>
                )}
                {screenshotUrls[pageType] && !screenshotsInProgress[pageType] && (
                  <span className="text-green-500" title="Screenshot available">
                    ✅
                  </span>
                )}
                {analysisInProgress[pageType] && (
                  <span className="text-purple-500 animate-spin" title="Analyzing...">
                    🔍
                  </span>
                )}
                {report[pageType] && !analysisInProgress[pageType] && (
                  <span className="text-green-500" title="Analysis complete">
                    📊
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {activeTab && (
        <div className="p-6">
          {analysisInProgress[activeTab] ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Analyzing {activeTab} page...</h3>
              <p className="text-gray-600">Our AI is examining the page structure and identifying conversion opportunities.</p>
            </div>
          ) : report[activeTab] ? (
            <div className="space-y-4">
              {Array.isArray(report[activeTab]) ? (
                report[activeTab].map((item, index) => (
                  <div key={index}>
                    {renderAnalysisItem(item, index)}
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No analysis data available for this page type.
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">⏳</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Waiting for {activeTab} analysis...</h3>
              <p className="text-gray-600">This page will be analyzed after the screenshot is captured.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 