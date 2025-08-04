'use client';

import React from 'react';

const WhatYouGetSection: React.FC = () => {
  const handleSeeSample = () => {
    // Add sample report functionality
    console.log('See sample report clicked');
  };

  return (
    <section className="py-16 bg-green-50 pb-0">
      <div className="container mx-auto max-w-6xl">
        {/* Main Title */}
        <div className="text-center lg:mb-16 mb-8">
          <h2 className="section-header__title">
            What do you get for $49?
          </h2>
        </div>

        {/* Store Audit Section */}
        <div className="mb-16">
          <h3 className="section-header__sub-title">
            Store Audit (Worth $349)
          </h3>

          <div className="grid md:grid-cols-3 gap-6 mb-8 mt-8">
            {/* Card 1: Complete Store Analysis */}
            <div className="what-get__item what-get__audit-item">
              <div className="what-get__audit-item-details">
                <h4 className="section-header__teritiary-title ">
                  Complete Store Analysis
                </h4>
                <p className="section-header__description mb-4">
                  Our tool will analyze the images, copy, and structure of the store across the home, collection, product, and cart pages.
                </p>
              </div>
              <div className="what-get__img">
                <img src="/screenshots/1.png" alt="screenshot" />
              </div>
            </div>

            {/* Card 2: Screenshots for Reference */}
            <div className="what-get__item what-get__audit-item">
              <div className="what-get__audit-item-details">

                <h4 className="section-header__teritiary-title">
                  Screenshots for Reference
                </h4>
                <p className="section-header__description mb-4">
                  Our report also includes screenshots as references from high-converting stores to give you a proper idea of how you can improve your store.
                </p>
              </div>
              <div className="what-get__img">
                <img src="/screenshots/2.png" alt="screenshot" />
              </div>

            </div>

            {/* Card 3: App Recommendations */}
            <div className="what-get__item what-get__audit-item">
              <div className="what-get__audit-item-details">

                <h4 className="section-header__teritiary-title ">
                  App Recommendations
                </h4>
                <p className="section-header__description mb-4">
                  Not just screenshots, FixMyStore also recommends apps to fix these issues and helps to increase sales.
                </p>
              </div>
              <div className="what-get__img">
                <img src="/screenshots/3.png" alt="screenshot" />
              </div>
            </div>
          </div>

          {/* Call to Action Button */}
          <div className="text-center">
            <button
              onClick={handleSeeSample}
              className="link-btn"
            >
              See Sample Report
            </button>
          </div>
        </div>

        {/* One-on-One Consultation Section */}
        <div className="mb-16">
          <div className="what-get__item">
            <div className="what-get__details">
              <h3 className="section-header__sub-title">
                One-on-One Consultation (Worth $349)
              </h3>

              <p className="section-header__description">
                We offer 20 minutes consultation call to first 10 customers where our CRO experts will help you on what to do on how to increase sales.
                <span> (7 left)</span>
              </p>
            </div>
            <div className="what-get__img mt-12">
              <img src="/screenshots/pdf-cro.gif" alt="screenshot" />
            </div>
            {/* pdf-cro.gif */}
          </div>
        </div>

        {/* CRO Resources Section */}
        <div>
          <div className="what-get__item">
            <div className="what-get__details">
              <h3 className="section-header__sub-title">
                CRO Resources (Worth $299)
              </h3>

              <p className="section-header__description">
                Proven 100 CRO checklist that can be used to turn more visitors into customers and store breakdown of 10 famous brands like All birds, Nike, Adidas and more
              </p>
            </div>
            <div className="bg-white rounded-lg h-64 flex items-center justify-center w-full">
              <span className="text-gray-500 font-medium">GIF</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatYouGetSection; 