interface UrlFormProps {
  url: string;
  setUrl: (url: string) => void;
  pageType: string;
  setPageType: (pageType: string) => void;
  loading: boolean;
  validatingShopify?: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function UrlForm({ url, setUrl, pageType, setPageType, loading, validatingShopify = false, onSubmit }: UrlFormProps) {
  return (
    <form onSubmit={onSubmit} className="max-w-4xl mx-auto">
      <div className="flex flex-col gap-4 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex gap-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter Shopify store URL (e.g., https://yourstore.myshopify.com)"
            required
            disabled={loading || validatingShopify}
            className="flex-1 px-4 py-3 text-lg border-0 outline-none focus:ring-0 bg-transparent text-black"
          />
          <button
            type="submit"
            disabled={loading || validatingShopify}
            className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
          >
            {validatingShopify ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Validating Shopify...
              </>
            ) : loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              'Get Analysis'
            )}
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <label htmlFor="pageType" className="text-sm font-medium text-gray-700">
            Page Type:
          </label>
          <select
            id="pageType"
            value={pageType}
            onChange={(e) => setPageType(e.target.value)}
            disabled={loading || validatingShopify}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="homepage">Homepage</option>
            <option value="collection">Collection</option>
            <option value="product">Product</option>
          </select>
        </div>
      </div>
    </form>
  );
} 