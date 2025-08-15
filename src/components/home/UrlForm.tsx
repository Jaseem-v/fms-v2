interface UrlFormProps {
  url: string;
  setUrl: (url: string) => void;
  loading: boolean;
  validatingShopify?: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function UrlForm({ url, setUrl, loading, validatingShopify = false, onSubmit }: UrlFormProps) {
  return (
    <form onSubmit={onSubmit} className="max-w-4xl mx-auto">
      <div className="flex gap-3 bg-white rounded-xl shadow-sm border border-gray-200 p-2">
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
    </form>
  );
} 