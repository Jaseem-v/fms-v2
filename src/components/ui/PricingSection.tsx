'use client';

import React from 'react';

const PricingSection: React.FC = () => {
  const handlePurchase = () => {
    window.location.href = '/payment';
  };

  return (
    <section className="py-16 ">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif text-gray-900 mb-4">
            Flexible Pricing Plan
          </h2>
        </div>
        
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
              {/* Header */}
              <div className="bg-green-100 py-4 px-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  First 50 Users Only
                </h3>
              </div>
              
              {/* Content */}
              <div className="p-8">
                {/* Pricing */}
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-3 mb-4">
                    <span className="text-5xl font-bold text-gray-900">$49</span>
                    <span className="text-2xl text-gray-500 line-through">$999</span>
                  </div>
                </div>
                
                {/* Feature Tags */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  <div className="px-3 py-1 bg-green-100 rounded-lg">
                    <span className="text-sm text-gray-900 font-medium">Instant delivery</span>
                  </div>
                  <div className="px-3 py-1 bg-green-100 rounded-lg">
                    <span className="text-sm text-gray-900 font-medium">One time Payment</span>
                  </div>
                  <div className="px-3 py-1 bg-green-100 rounded-lg">
                    <span className="text-sm text-gray-900 font-medium">24/7 support</span>
                  </div>
                  <div className="px-3 py-1 bg-green-100 rounded-lg">
                    <span className="text-sm text-gray-900 font-medium">Refund Option</span>
                  </div>
                </div>
                
                {/* Included Features */}
                <div className="bg-green-50 rounded-2xl p-6 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="text-gray-900 text-lg mt-0.5">✓</span>
                      <span className="text-gray-900">Detailed store audit - Worth $349</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-gray-900 text-lg mt-0.5">✓</span>
                      <span className="text-gray-900">One-On-One consultation - Worth $349</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-gray-900 text-lg mt-0.5">✓</span>
                      <span className="text-gray-900">CRO Resources - Worth $299</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Purchase Button */}
              <div className="px-8 pb-8">
                <button
                  onClick={handlePurchase}
                  className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 transform hover:scale-105"
                >
                  Purchase Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection; 