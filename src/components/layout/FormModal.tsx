'use client';

import { useState } from 'react';
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

export default function FormModal({ isOpen, onClose, websiteUrl, isSampleReport = false, pageType = 'homepage', totalProblems }: FormModalProps) {
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
      id: 2,
      name: "Elizabeth Clay",
      company: "tilleyandme.com US",
      text: "The audit highlighted 20+ key issues blocking sales. After applying the fixes, my sales jumped 10% in just 3 weeks. Best $99 I've ever spent!",
      rating: 5
    },
    {
      id: 3,
      name: "Labin Atheeq Rahman",
      company: "Thrive Media",
      text: "CRO audits used to take hours. With FixMyStore, I just drop a link and get a clear, actionable report, making presentations and pitches effortless.",
      rating: 5
    },
    {
      id: 4,
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
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full overflow-hidden">
        {!success ? (
          <div className="flex h-[600px] lead-form__container relative">
            {/* Left Section - Lead Generation Form */}
            <div className="flex-1 p-4 md:p-8 flex flex-col justify-center">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  <span className="lead-form__subtitle">WAIT!</span><br />
                  <span className="lead-form__title">YOUR STORE IS</span><br />
                  <span className="lead-form__title">LOSING REVENUE!</span>
                </h1>
                <p className="lead-form__description mt-4">
                  We already spotted {totalProblems} problems hurting your sales. Want to uncover even more?
                </p>
                <p className="lead-form__bottom-title mt-4">
                  Get one more page audit for FREE
                </p>
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Submitting...' : 'Get your Audit'}
                </button>

                <p className="text-sm text-gray-600 text-center mt-2">
                  100% privacy, no spam, just insights.
                </p>
              </form>
              <div className="flex justify-center mt-4 md:hidden">
                <div className="hero__details-trust bg-white" style={{ background:"#fff" }}>
                  <div className="hero__details-trust-icon">
                    <img src="/user/1.png" alt="trust" className='w-12 h-12 rounded-full'/>
                    <img src="/user/2.png" alt="trust" className='w-12 h-12 rounded-full'/>
                    <img src="/user/3.png" alt="trust" className='w-12 h-12 rounded-full'/>
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
            <div className="flex-1  pr-10 relative testimonial__container hidden md:block">


              <div className="h-full overflow-y-auto pr-2">
                <div className="space-y-4">
                  {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="bg-white rounded-lg p-4 shadow-md">
                      <div className="flex items-center mb-3">
                        <img src={`/user/${testimonial.id - 1}.png`} className="w-12 h-12 bg-gray-300 rounded-full mr-3 flex-shrink-0"></img>
                        <div>
                          <h4 className="testimonial__name">{testimonial.name}</h4>
                          <p className="testimonial__company">{testimonial.company}</p>
                          <div className="flex text-yellow-400 mt-1">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="testimonial__description">
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