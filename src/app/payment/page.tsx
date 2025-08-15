'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import paymentService, { PaymentRequest, DiscountVerification } from '../../services/paymentService';
import { triggerGA4Purchase } from '../../utils/conversionTracking';
import { config } from '@/config/config';
import Link from 'next/link';

export const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 5,
    seconds: 0
  });

  useEffect(() => {
    // Set end time to 5 minutes from when component mounts
    const endTime = Date.now() + (5 * 60 * 1000);

    const updateTimer = () => {
      const now = Date.now();
      const difference = endTime - now;

      if (difference > 0) {
        const minutes = Math.floor(difference / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ hours: 0, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Update immediately
    updateTimer();

    // Update every second
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (num: number) => num.toString().padStart(2, '0');

  return (
    <span>
      {formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
    </span>
  );
};

function PaymentForm() {
  const searchParams = useSearchParams();
  const websiteUrl = searchParams.get('url') || '';

  const [formData, setFormData] = useState<PaymentRequest>({
    websiteUrl,
    customerEmail: '',
    customerName: '',
  });

  const [discountCode, setDiscountCode] = useState('');
  const [discountVerification, setDiscountVerification] = useState<DiscountVerification | null>(null);
  const [verifyingDiscount, setVerifyingDiscount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  // Store the URL in localStorage for payment success page
  useEffect(() => {
    if (websiteUrl) {
      localStorage.setItem('pendingAnalysisUrl', websiteUrl);
    }
  }, [websiteUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDiscountCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiscountCode(e.target.value);
    // Clear previous verification when user types
    setDiscountVerification(null);
  };

  const verifyDiscountCode = async () => {
    if (!discountCode.trim()) return;

    setVerifyingDiscount(true);
    try {
      const result = await paymentService.verifyDiscountCode(discountCode.trim());
      setDiscountVerification(result);
    } catch (error) {
      setDiscountVerification({
        success: false,
        valid: false,
        message: 'Failed to verify discount code'
      });
    } finally {
      setVerifyingDiscount(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const paymentData = {
        ...formData,
        discountCode: discountVerification?.valid ? discountCode : undefined
      };

      const response = await paymentService.createPayment(paymentData);

      if (response.success && response.paymentUrl) {
        // Trigger GA4 purchase event
        triggerGA4Purchase({
          conversionId: response.paymentId || "unknown", // Use paymentId as conversionId
          email: formData.customerEmail,
          itemCount: 1,
          currency: "USD",
          transactionValue: finalAmount,
          productRows: [{
            id: "pdt_ZW8nVDJ5EKSnWLsTJKVpg",
            category: "Digital Service",
            name: "CRO Analysis Report"
          }]
        });

        setPaymentUrl(response.paymentUrl);
      } else {
        setError(response.message || 'Failed to create payment');
      }
    } catch (error) {
      setError('An error occurred while processing payment');
    } finally {
      setLoading(false);
    }
  };

  // Auto-redirect to payment URL when generated
  useEffect(() => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    }
  }, [paymentUrl]);

  const originalAmount = config.pricing.mainPrice;
  const finalAmount = discountVerification?.valid ? (originalAmount - (discountVerification.discountAmount || 0)) : originalAmount;

  return (
    <>
      <div className="bg-black text-white p-4  text-center flex justify-center items-center gap-1 sticky top-0 z-10">
        <div className="text-sm md:text-lg font-semibold">Grab it in 5 mins, 85% Off for </div>
        <div className="text-sm md:text-2xl font-bold font-mono">
          <CountdownTimer />
        </div>
      </div>

      <div className="min-h-screen bg-green-50 flex flex-col">
        <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl w-full mx-auto space-y-8">
            <div>
              <h2 className="mt-6  text-2xl font-extrabold text-gray-900 payment-header">
                Get 20+ Opportunities to increase sale!
              </h2>
            </div>

            {!paymentUrl ? (
              <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="rounded-md -space-y-px">
                  <div className="mb-6">
                    <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 mb-2 payment-label">
                      Website URL
                    </label>
                    <input
                      type="url"
                      id="websiteUrl"
                      name="websiteUrl"
                      value={formData.websiteUrl}
                      onChange={handleInputChange}
                      required
                      // disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-100  payment-input"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2 payment-label">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="customerName"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent payment-input"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-2 payment-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="customerEmail"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent payment-input"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="discountCode" className="block text-sm font-medium text-gray-700 mb-2 payment-label">
                      Discount Code (Optional)
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        id="discountCode"
                        value={discountCode}
                        onChange={handleDiscountCodeChange}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent payment-input"
                        placeholder="Enter discount code"
                      />
                      <button
                        type="button"
                        onClick={verifyDiscountCode}
                        disabled={!discountCode.trim() || verifyingDiscount}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {verifyingDiscount ? 'Verifying...' : 'Apply'}
                      </button>
                    </div>
                    {discountVerification && (
                      <div className={`mt-2 p-2 rounded-md text-sm ${discountVerification.valid
                        ? 'bg-green-50 border border-green-200 text-green-700'
                        : 'bg-red-50 border border-red-200 text-red-700'
                        }`}>
                        {discountVerification.message}
                      </div>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <div className="rounded-md ">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">What You'll Get:</h3>

                  <div className="flex items-baseline space-x-3 p-6"
                    style={
                      {
                        borderRadius: "10px 10px 0 0",
                        borderTop: "1px solid rgba(0, 0, 0, 0.15)",
                        borderRight: "1px solid rgba(0, 0, 0, 0.15)",
                        borderLeft: "1px solid rgba(0, 0, 0, 0.15)",
                        background: "#E4FFED"
                      }
                    }
                  >
                    <span className="text-3xl font-bold text-gray-900">${finalAmount}</span>
                    <span className="text-lg text-gray-500 line-through">${config.pricing.oldPrice}</span>
                  </div>

                  <div className='bg-green-100 border border-green-300 p-6'>
                    <div className=" rounded-lg mb-4 ">
                      <div className="">
                        <div className="flex items-center space-x-2 gap-4 mb-4">
                          <span className="text-green-600">✓</span>
                          <span className="text-gray-700">Detailed store audit <span className="font-semibold">(Worth ${config.pricing.storeAudit})</span></span>
                        </div>
                        <div className="flex items-center space-x-2 gap-4 mb-4">
                          <span className="text-green-600">✓</span>
                          <span className="text-gray-700">One - On - One consultation <span className="font-semibold">(Worth ${config.pricing.oneOnOneConsultation})</span></span>
                        </div>
                        <div className="flex items-center space-x-2 gap-4">
                          <span className="text-green-600">✓</span>
                          <span className="text-gray-700">CRO Resources <span className="font-semibold">(Worth ${config.pricing.croResource})</span></span>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-gray-300 mt-4 pt-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Highlights</h4>
                      <div className="space-y-2 flex gap-2 items-center flex-wrap">
                        <div className="flex items-center space-x-2 mb-0 ">
                          <span className="text-gray-700">★</span>
                          <span className="text-gray-700 whitespace-nowrap">Instant delivery</span>
                        </div>
                        <div className="flex items-center space-x-2 mb-0">
                          <span className="text-gray-700">★</span>
                          <span className="text-gray-700 whitespace-nowrap">One time Payment</span>
                        </div>
                        <div className="flex items-center space-x-2 mb-0">
                          <span className="text-gray-700">★</span>
                          <span className="text-gray-700 whitespace-nowrap">24*7 support</span>
                        </div>
                        <div className="flex items-center space-x-2 mb-0">
                          <span className="text-gray-700">★</span>
                          <span className="text-gray-700 whitespace-nowrap">Refund Option</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center flex items-center justify-center gap-2 border-b border-gray-700 w-max mx-auto">
                  <Link
                    href="/report/sitteer-com-1754311226618-955541-yhb6og"
                    // onClick={handleSeeSample}
                    // target='_blank'
                    className="link-btn"
                  >
                    See Sample Report

                  </Link>
                  {">"}
                </div>

                <div className="bg-white border border-gray-200 rounded-md p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Original Price:</span>
                      <span className="text-gray-500">${config.pricing.oldPrice}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-bold">Discounted Price:</span>
                      <span className="text-gray-700 font-bold">${originalAmount}</span>
                    </div>
                    {discountVerification?.valid && (
                      <div className="flex justify-between items-center">
                        <span className="text-green-700">Coupon Discount:</span>
                        <span className="text-green-700 font-bold">${discountVerification.discountAmount}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-300 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-md font-bold text-gray-900">Total Price:</span>
                        <span className="text-md font-bold text-gray-900">${finalAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Redirecting to Payment...
                </h3>
                <p className="text-gray-600">
                  Please wait while we redirect you to the secure payment page.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Button Section */}
        {!paymentUrl && (
          <div className="sticky bottom-0 bg-green-50 border-t border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full mx-auto">
              <button
                type="submit"
                form="payment-form"
                disabled={loading}
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-md font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-lg"
              >
                {loading ? 'Processing...' : 'Get Your Audit'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="w-16 h-16 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentForm />
    </Suspense>
  );
} 