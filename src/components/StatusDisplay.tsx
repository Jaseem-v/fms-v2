interface StatusDisplayProps {
  status: string | null;
  loading: boolean;
  elapsedTime: number;
  timerActive: boolean;
  analysisComplete: boolean;
  report: any;
  analysisInProgress: {[key: string]: boolean};
  statusMessages: Record<string, {description: string; step: number}>;
  formatTime: (seconds: number) => string;
}

export default function StatusDisplay({
  status,
  loading,
  elapsedTime,
  timerActive,
  analysisComplete,
  report,
  analysisInProgress,
  statusMessages,
  formatTime
}: StatusDisplayProps) {
  if (!status && !loading) return null;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          {status === 'cleanup' || status?.includes('Analysis complete') ? (
            <span className="text-white text-xl">✓</span>
          ) : (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {status === 'cleanup' || status?.includes('Analysis complete') ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✅ Complete
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                ⏳ Processing
              </span>
            )}
          </div>
          <div className="text-gray-700 font-medium">
            {status ? statusMessages[status]?.description || status : 'Initializing analysis...'}
          </div>
          <div className="text-sm text-gray-500">
            {status === 'cleanup' || status?.includes('Analysis complete') ? (
              'Finalizing results...'
            ) : (
              `Step ${status ? statusMessages[status]?.step || 0 : 0} of ${Object.keys(statusMessages).length}`
            )}
          </div>
          
          {/* Page Progress Indicator */}
          {!analysisComplete && (
            <div className="mt-3">
              <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                <span>Page Progress:</span>
                <span className="font-medium">
                  {Object.keys(report || {}).length}/4 analyzed
                </span>
              </div>
              <div className="flex gap-1">
                {['homepage', 'collection', 'product', 'cart'].map((pageType) => (
                  <div
                    key={pageType}
                    className={`flex-1 h-2 rounded-full ${
                      report?.[pageType] 
                        ? 'bg-green-500' 
                        : analysisInProgress[pageType]
                        ? 'bg-purple-500 animate-pulse'
                        : 'bg-gray-200'
                    }`}
                    title={`${pageType}: ${
                      report?.[pageType] 
                        ? 'Complete' 
                        : analysisInProgress[pageType]
                        ? 'Analyzing...'
                        : 'Pending'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Timer Display */}
        <div className="flex-shrink-0">
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-gray-900">
              {formatTime(elapsedTime)}
            </div>
            <div className="text-xs text-gray-500">
              {timerActive ? 'Elapsed' : 'Total Time'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 