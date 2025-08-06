'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import paymentService, { PaymentRequest, DiscountVerification } from '../../services/paymentService';

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

  const originalAmount = 49;
  const finalAmount = discountVerification?.valid ? (originalAmount - (discountVerification.discountAmount || 0)) : originalAmount;

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Complete Your Payment
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Pay ${finalAmount} to get your comprehensive CRO analysis
          </p>
        </div>

        {!paymentUrl ? (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="mb-4">
                <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  id="websiteUrl"
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleInputChange}
                  required
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-100 opacity-60 cursor-not-allowed"
                  placeholder="https://example.com"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="customerEmail"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your email address"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="discountCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Code (Optional)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    id="discountCode"
                    value={discountCode}
                    onChange={handleDiscountCodeChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter discount code"
                  />
                  <button
                    type="button"
                    onClick={verifyDiscountCode}
                    disabled={!discountCode.trim() || verifyingDiscount}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {verifyingDiscount ? 'Verifying...' : 'Apply'}
                  </button>
                </div>
                {discountVerification && (
                  <div className={`mt-2 p-2 rounded-md text-sm ${
                    discountVerification.valid 
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

            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-green-900 mb-2">What you'll get:</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Comprehensive CRO analysis report</li>
                <li>• Screenshots of key pages</li>
                <li>• Actionable recommendations</li>
                <li>• Shareable report link</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Original Price:</span>
                  <span className="text-sm text-gray-500">${originalAmount}</span>
                </div>
                {discountVerification?.valid && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-green-700">Discount:</span>
                    <span className="text-sm text-green-700">-${discountVerification.discountAmount}</span>
                  </div>
                )}
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total Amount:</span>
                    <span className="text-lg font-bold text-gray-900">${finalAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </button>
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