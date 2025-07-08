interface ScreenshotModalProps {
  selectedScreenshot: {pageType: string, url: string} | null;
  setSelectedScreenshot: (screenshot: {pageType: string, url: string} | null) => void;
}

export default function ScreenshotModal({ selectedScreenshot, setSelectedScreenshot }: ScreenshotModalProps) {
  if (!selectedScreenshot) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 capitalize">
            {selectedScreenshot.pageType} Screenshot
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = selectedScreenshot.url;
                link.download = `${selectedScreenshot.pageType}-screenshot.png`;
                link.click();
              }}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
            >
              Download
            </button>
            <button
              onClick={() => setSelectedScreenshot(null)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
          <img 
            src={selectedScreenshot.url} 
            alt={`${selectedScreenshot.pageType} screenshot`}
            className="w-full h-auto rounded-lg shadow-sm border border-gray-200"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.innerHTML = '<div class="flex items-center justify-center h-64"><p class="text-gray-500 text-center">Screenshot not available</p></div>';
            }}
          />
        </div>
      </div>
    </div>
  );
} 