interface UserInfo {
  name: string;
  email: string;
  mobile: string;
}

interface DownloadModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  userInfo: UserInfo;
  handleUserInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUserInfoSubmit: (e: React.FormEvent) => void;
  downloadLoading: boolean;
}

export default function DownloadModal({
  showModal,
  setShowModal,
  userInfo,
  handleUserInfoChange,
  handleUserInfoSubmit,
  downloadLoading
}: DownloadModalProps) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 ">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please enter your information</h2>
          <p className="text-gray-600">We'll generate a personalized PDF report for you to download.</p>
        </div>
        <form onSubmit={handleUserInfoSubmit} className="space-y-4">
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            value={userInfo.name}
            onChange={handleUserInfoChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black"
          />
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={userInfo.email}
            onChange={handleUserInfoChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black"
          />
          <input
            type="tel"
            id="mobile"
            name="mobile"
            placeholder="Mobile (optional)"
            value={userInfo.mobile}
            onChange={handleUserInfoChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black"
          />
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={downloadLoading}
              className="flex-1 download-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {downloadLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating PDF...</span>
                </div>
              ) : (
                'Download Report'
              )}
            </button>
            <button
              type="button"
              disabled={downloadLoading}
              className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 