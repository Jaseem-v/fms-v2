'use client';

import PricingSection from "@/components/ui/PricingSection";

export default function PricingPage() {
  const plans = [
    {
      name: 'Basic',
      price: '$99',
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
      price: '$199',
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
      price: '$399',
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