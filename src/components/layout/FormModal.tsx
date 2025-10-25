'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import formService, { FormData } from '@/services/formService';
import { normalizeUrl } from '@/utils/settingsUtils';
import AnalyticsService from '@/services/analyticsService';

interface FormModalProps {
  totalProblems: number;
  isOpen: boolean;
  onClose: () => void;
  websiteUrl: string;
  isSampleReport?: boolean;
  pageType?: string;
}

interface Testimonial {
  id: number;
  name: string;
  company: string;
  text: string;
  rating: number;
}

type PageType = 'collection' | 'product' | 'cart';

export default function FormModal({ isOpen, onClose, websiteUrl, isSampleReport = false, pageType = 'homepage', totalProblems }: FormModalProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPageType, setSelectedPageType] = useState<PageType | null>(null);
  const [pageUrl, setPageUrl] = useState('');
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

  // Testimonials data array
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      company: "Fashion Forward",
      text: "The detailed analysis helped me identify critical issues I never would have noticed. My conversion rate improved by 15% in just two weeks!",
      rating: 5
    },
    {
      id: 5,
      name: "Purifit",
      company: "India",
      text: `Two audits that were very useful for us were the CRO audit and the App audit.
The CRO audit was especially helpful in getting our store conversion-ready for BFCM.
We had been using a lot of apps, and our store had become slow. They analyzed everything and helped remove unnecessary apps, making the store much smoother now.`,
      rating: 5
    },
    {
      id: 6,
      name: "Charlie Suede",
      company: "United States",
      text: `This tool & this team helped our store to be fully ready for BFCM.
They audit across CRO, SEO & Apps was really helpful to find out issues and fix them.`,
      rating: 5
    },
    {
      id: 3,
      name: "Steve",
      company: "Ecom Capital",
      text: "I recommend FixMyStore to all my clients. The clear audit and actionable steps made changes easy—and boosted my store's performance!",
      rating: 5
    }
  ];

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

  const handlePageTypeSelect = (pageType: PageType) => {
    setSelectedPageType(pageType);
    setError(null);
  };

  const handleNextStep = () => {
    if (!selectedPageType) {
      setError('Please select a page type');
      return;
    }
    if (!pageUrl.trim()) {
      setError('Please enter a URL');
      return;
    }
    setError(null);
    setCurrentStep(2);
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
        );

        // Redirect to analyzing page with selected page type and URL
        const analyzingUrl = `/analyzing?pageType=${selectedPageType}&url=${encodeURIComponent(normalizeUrl(pageUrl))}`;
        router.push(analyzingUrl);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('An error occurred while submitting the form');
    } finally {
      setLoading(false);
    }
  };

  const handleBackStep = () => {
    setCurrentStep(1);
    setError(null);
  };

  if (!isOpen || isSampleReport) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4" style={{zIndex:50000}}>
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-xl max-w-4xl w-full overflow-hidden">
        {!success ? (
          <div className="flex h-[600px] lead-form__container relative">
            {/* Left Section - Lead Generation Form */}
            <div className="flex-1 p-4 md:p-8 flex flex-col justify-center">
              {currentStep === 1 ? (
                <>
                  <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                      <span className="lead-form__subtitle">NEED MORE IN DEPTH</span><br />
                      <span className="lead-form__title">ACCURATE AUDIT?</span>

                    </h1>
                    {/* <p className="lead-form__description mt-4">
                      Choose one page for FREE Audit!
                    </p> */}
                  </div>

                  <div className="space-y-4">
                    {/* Page Type Selection */}
                    {/* <div className="space-y-3">
                      {(['collection', 'product', 'cart'] as PageType[]).map((pageType) => (
                        <div
                          key={pageType}
                          className={`border-2 rounded-lg transition-all bg-white shadow-sm ${selectedPageType === pageType
                              ? 'border-gray-900 bg-gray-50 shadow-md'
                              : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                            }`}
                        >
                          <div
                            onClick={() => handlePageTypeSelect(pageType)}
                            className="p-4 cursor-pointer"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900">
                                {getPageTypeText(pageType)}
                              </span>
                              {selectedPageType === pageType && (
                                <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </div>

                          {selectedPageType === pageType && (
                            <div className="px-4 pb-4">
                              <input
                                type="url"
                                value={pageUrl}
                                onChange={(e) => setPageUrl(e.target.value)}
                                placeholder={`Enter your ${getPageTypeText(pageType).toLowerCase()} URL`}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-700 bg-white"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div> */}

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-md p-3">
                        <p className="text-red-600 text-sm">{error}</p>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        window.open('https://apps.shopify.com/fix-my-store-1', '_blank');
                      }}
                      // disabled={!selectedPageType || !pageUrl.trim()}
                      className="download-button w-full mb-10 "
                    >
                      Install Shopify App »
                    </button>

                    <div className="popup-features__list">
                      <div className="popup-features__item">
                        Conversion flow
                      </div>
                      <div className="popup-features__item">
                        SEO performance
                      </div>
                      <div className="popup-features__item">
                        App Audit
                      </div>
                      <div className="popup-features__item">
                        Mobile experience
                      </div>
                      <div className="popup-features__item">
                        Page speed
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                      <span className="lead-form__subtitle">Enter your details</span><br />
                      <span className="lead-form__title">to get FREE Audit</span><br />
                      <span className="lead-form__title">instantly!</span>
                    </h1>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-700 bg-white"
                        placeholder="Name:"
                      />
                    </div>

                    <div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-700 bg-white"
                        placeholder="Email:"
                      />
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-md p-3">
                        <p className="text-red-600 text-sm">{error}</p>
                      </div>
                    )}

                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={handleBackStep}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {loading ? 'Submitting...' : 'Get your Audit »'}
                      </button>
                    </div>

                    <p className="text-sm text-gray-600 text-center mt-2">
                      100% privacy, no spam, just insights.
                    </p>
                  </form>
                </>
              )}
              <div className="flex justify-center mt-4 md:hidden">
                <div className="hero__details-trust bg-white" style={{ background: "#fff" }}>
                  <div className="hero__details-trust-icon">
                    <img src="/user/2.png" alt="trust" className='w-12 h-12 rounded-full' />
                    <img src="/user/4.png" alt="trust" className='w-12 h-12 rounded-full' />
                    <img src="/user/3.png" alt="trust" className='w-12 h-12 rounded-full' />
                  </div>
                  <div className="hero__details-trust-text">
                    Trusted by Shopify Store Owners
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                // Track popup closed
                AnalyticsService.trackPopupClosed(
                  normalizeUrl(websiteUrl),
                  AnalyticsService.extractWebsiteName(normalizeUrl(websiteUrl)),
                );
                onClose();
              }}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Right Section - Testimonials */}
            <div className="flex-1 pr-10 relative testimonial__container hidden md:block">
              <div className="h-full overflow-y-auto pr-2">
                <div className="space-y-4">
                  {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="bg-white rounded-lg p-4 shadow-lg border border-gray-100">
                      <div className="flex items-center mb-3">
                        <img src={`/user/${testimonial.id - 1}.png`} className="w-12 h-12 bg-gray-300 rounded-full mr-3 flex-shrink-0"></img>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">{testimonial.name}</h4>
                          <p className="text-gray-600 text-xs">{testimonial.company}</p>
                          <div className="flex text-yellow-400 mt-1">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        "{testimonial.text}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
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