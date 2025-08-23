'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import { triggerGA4Purchase } from '../../utils/conversionTracking';

export const metadata: Metadata = {
  title: 'Test Purchase - FixMyStore',
  description: 'Test page for purchase tracking events',
  robots: {
    index: false,
    follow: false,
  },
};

export default function TestPurchasePage() {
  const [email, setEmail] = useState('test@example.com');
  const [phoneNumber, setPhoneNumber] = useState('+15554441234');
  const [transactionValue, setTransactionValue] = useState(100);
  const [itemCount, setItemCount] = useState(2);

  const handleTestPurchase = () => {
    triggerGA4Purchase({
      conversionId: "test_purchase_123",
      email: email,
      phoneNumber: phoneNumber,
      itemCount: itemCount,
      currency: "USD",
      transactionValue: transactionValue,
      productRows: [{
        id: "pdt_ZW8nVDJ5EKSnWLsTJKVpg",
        category: "Digital Service",
        name: "CRO Analysis Report"
      }]
    });

    // Also push the test_id to dataLayer for testing
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: "Purchase",
        test_id: "2_10vvm5jyup",
        conversionId: "test_purchase_123",
        advancedMatchingParams: [
          { name: "email", value: email },
          { name: "phoneNumber", value: phoneNumber },
        ],
        itemCount: itemCount,
        currency: "USD",
        transactionValue: transactionValue,
        productRows: [{
          id: "pdt_ZW8nVDJ5EKSnWLsTJKVpg",
          category: "Digital Service",
          name: "CRO Analysis Report"
        }]
      });

      console.log('Test purchase event triggered with test_id:', "2_10vvm5jyup");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Test Purchase Tracking
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Test GA4 purchase event with test_id: 2_10vvm5jyup
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction Value ($)
            </label>
            <input
              type="number"
              value={transactionValue}
              onChange={(e) => setTransactionValue(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Item Count
            </label>
            <input
              type="number"
              value={itemCount}
              onChange={(e) => setItemCount(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Test Configuration:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• test_id: 2_10vvm5jyup</li>
              <li>• Product ID: pdt_ZW8nVDJ5EKSnWLsTJKVpg</li>
              <li>• Category: Digital Service</li>
              <li>• Name: CRO Analysis Report</li>
            </ul>
          </div>

          <button
            onClick={handleTestPurchase}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Trigger Test Purchase Event
          </button>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Check browser console for tracking details
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 