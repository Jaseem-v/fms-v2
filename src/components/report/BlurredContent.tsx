'use client';

import React from 'react';
import { config } from '@/config/config';

interface BlurredContentProps {
  activeTab: string;
  pageType?: string;
  analysisResult?: any;
  onPaymentClick?: () => void;
  className?: string;
}

const PAGE_TITLES: Record<string, string> = {
  homepage: 'Homepage',
  collection: 'Collection Page',
  product: 'Product Page',
  cart: 'Cart Page',
};

const BLURRED_IMAGES: Record<string, string> = {
  homepage: '/blured/1.png',
  collection: '/blured/2.png',
  product: '/blured/3.png',
  cart: '/blured/4.png',
};

export default function BlurredContent({ 
  activeTab, 
  pageType, 
  analysisResult, 
  onPaymentClick,
  className = ''
}: BlurredContentProps) {
  const handlePaymentClick = () => {
    if (onPaymentClick) {
      onPaymentClick();
    } else {
      // Default behavior - redirect to payment page
      window.location.href = '/payment';
    }
  };

  const getBlurredImage = () => {
    return BLURRED_IMAGES[activeTab] || '/blured/1.png';
  };

  const getMessage = () => {
    if (analysisResult && pageType) {
      return `You've unlocked ${PAGE_TITLES[pageType]} analysis. Upgrade to unlock ${PAGE_TITLES[activeTab]} analysis too!`;
    }
    return 'Unlock detailed insights and actionable recommendations';
  };

  return (
    <div className={`relative mt-4 ${className}`}>
      <div className="w-full rounded-lg overflow-hidden">
        <img
          className="w-full md:h-full h-[400px] object-cover"
          src={getBlurredImage()}
          alt={`${PAGE_TITLES[activeTab]} blurred preview`}
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">
              {PAGE_TITLES[activeTab]} Analysis
            </h3>
            <p className="text-sm opacity-90 mb-6 max-w-md">
              {getMessage()}
            </p>
            <button
              onClick={handlePaymentClick}
              className="download-button"
            >
              Unlock Full Report - ${config.pricing.mainPrice}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
