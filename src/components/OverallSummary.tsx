interface AnalysisItem {
  problem: string;
  solution: string;
}

interface Report {
  [key: string]: AnalysisItem[];
}

interface OverallSummaryProps {
  report: Report | null;
  analysisInProgress: {[key: string]: boolean};
}

export default function OverallSummary({ report, analysisInProgress }: OverallSummaryProps) {
  if (!report || Object.keys(report).length === 0) return null;

  // Define the order we want to display pages
  const pageOrder = ['homepage', 'collection', 'product', 'cart'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-4xl mx-auto">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Overall Summary</h2>
        <p className="text-gray-600 mt-1">Complete analysis overview and performance metrics</p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Pages Analyzed */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">📊</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-900">
                  {Object.keys(report).length}/4
                </div>
                <div className="text-sm text-blue-700">Pages Analyzed</div>
              </div>
            </div>
            <div className="space-y-2">
              {pageOrder.map((pageType) => (
                <div key={pageType} className="flex items-center justify-between text-sm">
                  <span className="capitalize text-blue-800">{pageType}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    report[pageType] 
                      ? 'bg-green-100 text-green-800' 
                      : analysisInProgress[pageType]
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {report[pageType] 
                      ? '✓ Complete' 
                      : analysisInProgress[pageType]
                      ? '⏳ Analyzing'
                      : '⏸️ Pending'
                    }
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total Problems Found */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">⚠️</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-red-900">
                  {Object.values(report).reduce((total, pageAnalysis) => {
                    return total + (Array.isArray(pageAnalysis) ? pageAnalysis.length : 0);
                  }, 0)}
                </div>
                <div className="text-sm text-red-700">Problems Found</div>
              </div>
            </div>
            <div className="space-y-2">
              {pageOrder.map((pageType) => {
                const analysis = report[pageType];
                return (
                  <div key={pageType} className="flex items-center justify-between text-sm">
                    <span className="capitalize text-red-800">{pageType}</span>
                    <span className="px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs font-medium">
                      {Array.isArray(analysis) ? analysis.length : 0} issues
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Performance Score */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">🎯</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-900">
                  {(() => {
                    const totalProblems = Object.values(report).reduce((total, pageAnalysis) => {
                      return total + (Array.isArray(pageAnalysis) ? pageAnalysis.length : 0);
                    }, 0);
                    const score = Math.max(0, 100 - (totalProblems * 1.5)); // 5 points per problem
                    return Math.round(score);
                  })()}%
                </div>
                <div className="text-sm text-green-700">Performance Score</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-800">Conversion Rate</span>
                <span className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs font-medium">
                  {(() => {
                    const totalProblems = Object.values(report).reduce((total, pageAnalysis) => {
                      return total + (Array.isArray(pageAnalysis) ? pageAnalysis.length : 0);
                    }, 0);
                    if (totalProblems <= 10) return 'Excellent';
                    if (totalProblems <= 15) return 'Good';
                    if (totalProblems <= 20) return 'Fair';
                    return 'Needs Work';
                  })()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-800">User Experience</span>
                <span className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs font-medium">
                  {(() => {
                    const totalProblems = Object.values(report).reduce((total, pageAnalysis) => {
                      return total + (Array.isArray(pageAnalysis) ? pageAnalysis.length : 0);
                    }, 0);
                    if (totalProblems <= 5) return 'A+';
                    if (totalProblems <= 10) return 'B+';
                    if (totalProblems <= 15) return 'C+';
                    return 'D';
                  })()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Problems Summary */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-red-500">🔍</span>
            Overall Problems Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pageOrder.map((pageType) => {
              const analysis = report[pageType];
              return (
                <div key={pageType} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="font-semibold text-gray-900 capitalize">{pageType} Page</h4>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {Array.isArray(analysis) ? analysis.length : 0} issues
                    </span>
                  </div>
                  {Array.isArray(analysis) && analysis.length > 0 ? (
                    <div className="space-y-2">
                      {analysis.slice(0, 3).map((item, index) => (
                        <div key={index} className="text-sm text-gray-700 bg-gray-50 rounded p-2">
                          <div className="font-medium text-red-600 mb-1">Problem {index + 1}:</div>
                          <div className="text-gray-600">{item.problem.substring(0, 100)}...</div>
                        </div>
                      ))}
                      {analysis.length > 3 && (
                        <div className="text-xs text-gray-500 text-center py-2">
                          +{analysis.length - 3} more problems identified
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 text-center py-4">
                      No problems identified yet
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Items */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-blue-500">🚀</span>
            Recommended Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-red-500">🔥</span>
                <span className="font-semibold text-gray-900">High Priority</span>
              </div>
              <p className="text-sm text-gray-600">
                Focus on fixing the most critical conversion barriers first, especially on product and cart pages.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-500">📈</span>
                <span className="font-semibold text-gray-900">Quick Wins</span>
              </div>
              <p className="text-sm text-gray-600">
                Implement simple fixes like clear CTAs, better product images, and streamlined checkout process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 