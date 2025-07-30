'use client';

import React from 'react';

const WhatYouGetSection: React.FC = () => {
  const handleSeeSample = () => {
    // Add sample report functionality
    console.log('See sample report clicked');
  };

  return (
    <section className="py-16 bg-green-50">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Main Title */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-serif text-gray-900">
            What do you get for $49?
          </h2>
        </div>

        {/* Store Audit Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Store Audit (Worth $349)
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Card 1: Complete Store Analysis */}
            <div className="bg-green-100 border border-green-200 rounded-xl p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4">
                Complete Store Analysis
              </h4>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Our tool will analyze the images, copy, and structure of the store across the home, collection, product, and cart pages.
              </p>
              <div className="bg-white rounded-lg h-32 flex items-center justify-center">
                <span className="text-gray-500 font-medium">GIF</span>
              </div>
            </div>

            {/* Card 2: Screenshots for Reference */}
            <div className="bg-green-100 border border-green-200 rounded-xl p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4">
                Screenshots for Reference
              </h4>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Our report also includes screenshots as references from high-converting stores to give you a proper idea of how you can improve your store.
              </p>
              <div className="bg-white rounded-lg h-32 flex items-center justify-center">
                <span className="text-gray-500 font-medium">GIF</span>
              </div>
            </div>

            {/* Card 3: App Recommendations */}
            <div className="bg-green-100 border border-green-200 rounded-xl p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4">
                App Recommendations
              </h4>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Not just screenshots, FixMyStore also recommends apps to fix these issues and helps to increase sales.
              </p>
              <div className="bg-white rounded-lg h-32 flex items-center justify-center">
                <span className="text-gray-500 font-medium">GIF</span>
              </div>
            </div>
          </div>

          {/* Call to Action Button */}
          <div className="text-center">
            <button
              onClick={handleSeeSample}
              className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-4 px-8 rounded-xl transition-colors duration-200 transform hover:scale-105"
            >
              See Sample Report
            </button>
          </div>
        </div>

        {/* One-on-One Consultation Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            One-on-One Consultation (Worth $349)
          </h3>
          
          <div className="bg-green-100 border border-green-200 rounded-xl p-8">
            <p className="text-gray-700 mb-8 leading-relaxed text-center max-w-3xl mx-auto">
              We offer 20 minutes consultation call to first 10 customers where our CRO experts will help you on what to do on how to increase sales. 
              <span className="font-bold text-orange-600"> (7 left)</span>
            </p>
            <div className="bg-white rounded-lg h-64 flex items-center justify-center">
              <span className="text-gray-500 font-medium">GIF</span>
            </div>
          </div>
        </div>

        {/* CRO Resources Section */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            CRO Resources (Worth $299)
          </h3>
          
          <div className="bg-green-100 border border-green-200 rounded-xl p-8">
            <p className="text-gray-700 mb-8 leading-relaxed text-center max-w-3xl mx-auto">
              Proven 100 CRO checklist that can be used to turn more visitors into customers and store breakdown of 10 famous brands like All birds, Nike, Adidas and more
            </p>
            <div className="bg-white rounded-lg h-64 flex items-center justify-center">
              <span className="text-gray-500 font-medium">GIF</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatYouGetSection; 