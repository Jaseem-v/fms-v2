'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import paymentService from '../../../services/paymentService';
import { triggerPurchaseConversion } from '../../../utils/conversionTracking';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('payment_id');
  const orderId = searchParams.get('order_id');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('');

  console.log('orderId', orderId);
  console.log('paymentId', paymentId);

  useEffect(() => {
    if (orderId) {
      verifyPayment();
    } else {
      setStatus('success'); // Assume success if no payment ID
      // Start analysis after successful payment
      startAnalysisAfterPayment();
    }
  }, [orderId]);

  const verifyPayment = async () => {
    try {
      const result = await paymentService.verifyPayment(paymentId!);
      
      if (result.success && result.status === 'completed') {
        setStatus('success');
        setMessage('Payment verified successfully! Your analysis will be processed shortly.');
        
        // Trigger Google Ads conversion tracking
        const transactionId = orderId || paymentId || `payment_${Date.now()}`;
        triggerPurchaseConversion(transactionId, 49.0, 'USD');
        
        // Start analysis after successful payment verification
        startAnalysisAfterPayment();
      } else {
        setStatus('failed');
        setMessage(result.message || 'Payment verification failed.');
      }
    } catch (error) {
      setStatus('failed');
      setMessage('Error verifying payment.');
    }
  };

  const startAnalysisAfterPayment = async () => {
    try {
      // Get the website URL from URL params or localStorage
      const urlParams = new URLSearchParams(window.location.search);
      const websiteUrl = urlParams.get('url') || localStorage.getItem('pendingAnalysisUrl');
      const currentOrderId = urlParams.get('order_id');
      
      if (websiteUrl && currentOrderId) {
        // Trigger conversion tracking if not already triggered
        if (status === 'success' && !paymentId) {
          const transactionId = currentOrderId || `order_${Date.now()}`;
          triggerPurchaseConversion(transactionId, 49.0, 'USD');
        }
        
        // Redirect to generate-report page with order ID and URL
        // window.location.href = `/generate-report?order_id=${currentOrderId}&url=${encodeURIComponent(websiteUrl)}`;
      } else {
        console.error('Missing website URL or order ID');
        // Fallback to homepage
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error starting analysis:', error);
      // Fallback to homepage
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verifying Payment
            </h2>
            <p className="text-gray-600 mb-6">
              Please wait while we verify your payment...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              {message || 'Your payment has been processed successfully. Starting your analysis...'}
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <h3 className="text-sm font-medium text-blue-900 mb-2">What happens next?</h3>
              <ul className="text-sm text-blue-700 space-y-1 text-left">
                <li>• Your analysis will start automatically</li>
                <li>• We'll analyze your store pages</li>
                <li>• You'll get a comprehensive report</li>
                <li>• You'll receive a shareable link</li>
              </ul>
            </div>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Verification Failed
            </h2>
            <p className="text-gray-600 mb-6">
              {message || 'There was an issue verifying your payment.'}
            </p>
            <div className="space-y-3">
              <Link
                href="/payment"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Try Payment Again
              </Link>
              <br />
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Return to Home
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-16 h-16 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  );
} 