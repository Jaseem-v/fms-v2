'use client';

import { useState } from 'react';
import formService, { FormData } from '@/services/formService';
import { normalizeUrl } from '@/utils/settingsUtils';
import AnalyticsService from '@/services/analyticsService';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  websiteUrl: string;
  isSampleReport?: boolean;
  pageType?: string;
}

export default function FormModal({ isOpen, onClose, websiteUrl, isSampleReport = false, pageType = 'homepage' }: FormModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    websiteUrl: normalizeUrl(websiteUrl),
    phoneNumber: '1234567890',
    email: '',
  });

  console.log("websiteUrl", websiteUrl);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Function to get page type display text
  const getPageTypeText = (pageType: string): string => {
    const pageTypeMap: Record<string, string> = {
      homepage: 'Homepage',
      cart: 'Cart Page',
      product: 'Product Page',
      collection: 'Collection Page',
    };
    return pageTypeMap[pageType] || 'Homepage';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;


    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await formService.submitForm({ ...formData, websiteUrl: normalizeUrl(websiteUrl) });

      if (response.success) {
        // Track popup filled
        AnalyticsService.trackPopupFilled(
          normalizeUrl(websiteUrl),
          AnalyticsService.extractWebsiteName(normalizeUrl(websiteUrl)),
          AnalyticsService.detectStoreCategory(normalizeUrl(websiteUrl))
        );
        
        setSuccess(true);
        setTimeout(() => {
          // Refresh the page after successful submission
          window.location.reload();
        }, 2000);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('An error occurred while submitting the form');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || isSampleReport) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        {!success ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Get Now!
              </h2>
              <button
                onClick={() => {
                  // Track popup closed
                  AnalyticsService.trackPopupClosed(
                    normalizeUrl(websiteUrl),
                    AnalyticsService.extractWebsiteName(normalizeUrl(websiteUrl)),
                    AnalyticsService.detectStoreCategory(normalizeUrl(websiteUrl))
                  );
                  onClose();
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="text-gray-600 mb-6">
              {/* <p className="mb-3">Please provide your details to get:</p> */}
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="text-black font-semibold">Your {getPageTypeText(pageType)} Audit (PDF)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="text-black font-semibold">50+ Conversion Checklist Used in Million Dollar Brands</span>
                </li>
              </ul>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
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
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email address"
                />
              </div>

              {/* <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div> */}

              {/* <div>
                <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Website URL *
                </label>
                <input
                  type="url"
                  id="websiteUrl"
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your website URL"
                />
              </div> */}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Form Submitted Successfully!
            </h3>
            <p className="text-gray-600">
              Redirecting to analysis...
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 