'use client';

import { Metadata } from 'next';
import PricingSection from "@/components/home/PricingSection";
import { config } from "@/config/config";

export const metadata: Metadata = {
  title: 'Pricing Plans - FixMyStore CRO Audit Services',
  description: 'Choose from our affordable CRO audit plans. Get professional conversion rate optimization analysis starting at $97. Transform your Shopify store performance.',
  keywords: 'CRO audit pricing, conversion optimization cost, Shopify CRO services, affordable CRO analysis',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PricingPage() {
  const plans = [
    {
      name: 'Basic',
      price: `$${config.pricing.plans.basic}`,
      period: 'one-time',
      features: [
        'Complete CRO audit report',
        'Up to 10 page analysis',
        'Basic recommendations',
        'Email support',
        '30-day access to report'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: `$${config.pricing.plans.professional}`,
      period: 'one-time',
      features: [
        'Complete CRO audit report',
        'Up to 25 page analysis',
        'Advanced recommendations',
        'Priority email support',
        '90-day access to report',
        'Implementation guide',
        'Follow-up consultation'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: `$${config.pricing.plans.enterprise}`,
      period: 'one-time',
      features: [
        'Complete CRO audit report',
        'Unlimited page analysis',
        'Custom recommendations',
        'Phone & email support',
        'Lifetime access to report',
        'Implementation guide',
        'Multiple follow-up consultations',
        'Custom implementation timeline'
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-green-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
       <PricingSection />
      </div>
    </div>
  );
}