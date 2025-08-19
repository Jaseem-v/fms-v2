'use client';

import Link from 'next/link';
import React from 'react';
import { config } from '@/config/config';

const WhatYouGetSection: React.FC = () => {
  const handleSeeSample = () => {
    // Add sample report functionality
    console.log('See sample report clicked');
  };

  return (
    <section className=" bg-green-50 pb-0 py-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-4">
          <h2 className="section-header__title">
            What You Get
          </h2>
          <p className="section-header__description">
            Everything you need to transform your Shopify store and boost conversions
          </p>
        </div>

        {/* Store Audit Section */}
        <div className="mb-12">
          <h3 className="section-header__sub-title">
            Store Audit (Worth ${config.pricing.storeAudit})
          </h3>

          <div className="grid md:grid-cols-3 gap-6 mb-8 mt-4">
            {/* Card 1: Complete Store Analysis */}
            <div className="what-get__item what-get__audit-item">
              <div className="what-get__audit-item-details">
                <h4 className="section-header__teritiary-title ">
                  Complete Store Analysis
                </h4>
                <p className="section-header__description mb-4">
                FixMyStore will analyze your store’s images, copy, and layout across the home, collection, product, and cart pages.

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
                Audit includes screenshots from Shopify Plus brands, showing how to improve your store based on proven examples.
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
                FixMyStore will recommend the best Shopify apps to resolve the issues identified in the audit report.

                </p>
              </div>
              <div className="what-get__img">
                <img src="/screenshots/3.png" alt="screenshot" />
              </div>
            </div>
          </div>

          {/* Call to Action Button */}
          <div className="text-center">
            <Link
              href="/report/sitteer-com-1754311226618-955541-yhb6og"
              // onClick={handleSeeSample}
              className="download-button"
            >
              See Sample Audit
            </Link>
          </div>
        </div>

        {/* One-on-One Consultation Section */}
        <div className="mb-12">
          <div className="what-get__item">
            <div className="what-get__details">
              <h3 className="section-header__sub-title">
                One-on-One Consultation (Worth ${config.pricing.oneOnOneConsultation})
              </h3>

              <p className="section-header__description">
              Get a free 20-minute consultation call from our CRO experts on how to boost your Shopify sales! 
                <span> (Only 7 spots left! )</span>
              </p>
            </div>
            <div className="what-get__img mt-10" style={{marginTop:"16px",borderRadius:"10px"}}>
              <img src="/screenshots/cro-call.gif" alt="screenshot" />
            </div>

            {/* <div className="bg-white rounded-lg h-64 flex items-center justify-center w-full">
              <span className="text-gray-500 font-medium">GIF</span>
            </div> */}
            {/* pdf-cro.gif */}
          </div>
        </div>

        {/* CRO Resources Section */}
        <div>
          <div className="what-get__item">
            <div className="what-get__details">
              <h3 className="section-header__sub-title">
                CRO Resources (Worth ${config.pricing.croResource})
              </h3>

              <p className="section-header__description">
              Discover the 100-point CRO checklist that powers Allbirds, Nike, Adidas & more to make millions.

              </p>
            </div>

            <div className="what-get__img mt-10" style={{marginTop:"16px",borderRadius:"10px"}}>
              <img src="/screenshots/cro-resource.gif" alt="screenshot" />
            </div>

            {/* <div className="bg-white rounded-lg h-64 flex items-center justify-center w-full">
              <span className="text-gray-500 font-medium">GIF</span>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatYouGetSection; 