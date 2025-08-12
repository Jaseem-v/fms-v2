'use client';

import Link from 'next/link';
import React from 'react';

const PricingSection: React.FC = () => {
  

  return (
    <section className="py-16 ">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="section-header__title">
            One time payment
          </h2>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <div className="payment-card__main">
              {/* Header */}

              {/* <h3 className="section-header__teritiary-title text-center w-full mt-5">
                First 50 Users Only
              </h3> */}


              {/* Content */}
              <div className="payment-card__content">
                {/* Pricing */}

                <div className="payment-card__price">
                  <span className="payment-card__price-value">$49</span>
                  <span className="payment-card__price-old">$999</span>
                </div>


                <div className="flex flex-col gap-4 w-full">

                  {/* Feature Tags */}
                  <div className="payment-card__feature-tags">
                    <div className="payment-card__feature-tag">
                      Instant delivery
                    </div>
                    <div className="payment-card__feature-tag">
                      One time Payment
                    </div>
                    <div className="payment-card__feature-tag">
                      24/7 support
                    </div>
                    <div className="payment-card__feature-tag">
                      Refund Option
                    </div>
                  </div>

                  {/* Included Features */}
                  <div className="bg-green-50 rounded-2xl p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
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


                  <Link
                    href="#payment"
                    className="btn"
                  >
                    Fix My Store
                  </Link>


                </div>
              </div>

              {/* Purchase Button */}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection; 