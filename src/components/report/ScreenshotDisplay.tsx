interface ScreenshotDisplayProps {
  screenshotUrls: {[key: string]: string};
  setSelectedScreenshot: (screenshot: {pageType: string, url: string} | null) => void;
}

export default function ScreenshotDisplay({ screenshotUrls, setSelectedScreenshot }: ScreenshotDisplayProps) {
  if (Object.keys(screenshotUrls).length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Screenshots</h2>
        <p className="text-gray-600 mt-1">Real-time screenshots as they're captured</p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(screenshotUrls).map(([pageType, url]) => (
            <div key={pageType} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 capitalize">
                  {pageType}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${pageType}-screenshot.png`;
                    link.click();
                  }}
                  className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  Download
                </button>
              </div>
              <div 
                className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
                onClick={() => setSelectedScreenshot({pageType, url})}
              >
                <img 
                  src={url} 
                  alt={`${pageType} screenshot`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = '<div class="flex items-center justify-center h-full"><p class="text-gray-500 text-center text-sm">Screenshot not available</p></div>';
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 