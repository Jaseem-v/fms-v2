'use client';

import { useState, useEffect } from 'react';

interface DownloadModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  userInfo: {
    name: string;
    email: string;
    mobile: string;
  };
  handleUserInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUserInfoSubmit: (e: React.FormEvent) => void;
  downloadLoading: boolean;
}

export default function DownloadModal({ showModal, setShowModal, userInfo, handleUserInfoChange, handleUserInfoSubmit, downloadLoading }: DownloadModalProps) {
  const [reportUrl, setReportUrl] = useState<string | null>(null);

  useEffect(() => {
    // Get the report URL from localStorage
    const storedReportUrl = localStorage.getItem('reportUrl');
    if (storedReportUrl) {
      setReportUrl(storedReportUrl);
    }
  }, []);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Download Report</h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {reportUrl && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <h3 className="text-sm font-medium text-green-900 mb-2">Shareable Report Link</h3>
            <p className="text-sm text-green-700 mb-3">
              Your report is now available at this permanent link:
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={reportUrl}
                readOnly
                className="flex-1 px-3 py-2 text-sm border border-green-300 rounded-md bg-white text-green-900"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(reportUrl);
                  // You could add a toast notification here
                }}
                className="px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
              >
                Copy
              </button>
            </div>
            <p className="text-xs text-green-600 mt-2">
              Anyone with this link can view your report for 30 days
            </p>
          </div>
        )}

        <form onSubmit={handleUserInfoSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={userInfo.name}
              onChange={handleUserInfoChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={userInfo.email}
              onChange={handleUserInfoChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email address"
            />
          </div>

          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={userInfo.mobile}
              onChange={handleUserInfoChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your mobile number (optional)"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={downloadLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {downloadLoading ? 'Generating...' : 'Download PDF'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 