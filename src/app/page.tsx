'use client';

import HeroArea from '@/components/home/HeroArea';
import FloatingButton from '@/components/ui/FloatingButton';
import { config } from '@/config/config';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AboutSections from '../components/home/AboutSections';
import FAQSection from '../components/home/FAQSection';
import FormModal from '../components/layout/FormModal';
import { useAnalysis } from '../hooks/useAnalysis';
// import { CountdownTimer } from './payment/page';
import { HowItWorks } from '@/components/app-detection/HowItWorks';
import { WhoIsItFor } from '@/components/app-detection/WhoIsItFor';
import ServicesSection from '@/components/home/ServicesSection';
import WhyFixSection from '@/components/home/WhyFixSection';
import { BarChart3, Code, Store, Truck } from 'lucide-react';


interface UserInfo {
  name: string;
  email: string;
  mobile: string;
}

interface StatusMessage {
  description: string;
  step: number;
}

const CRO_QUOTES = [
  "Optimizing your store for maximum conversions...",
  "Every second counts in e-commerce - we're making yours count",
  "Turning browsers into buyers, one optimization at a time",
  "Your store's potential is being unlocked...",
  "Converting visitors into customers with precision",
  "Building trust and removing friction from your customer journey",
  "Every element matters when it comes to conversion",
  "We're analyzing every pixel for conversion opportunities",
  "Your customers' experience is being perfected",
  "Transforming your store into a conversion machine"
];

const STEP_MESSAGES: Record<string, string> = {
  'validate_shopify': 'Preparing your store analysis...',
  'take_screenshot': 'Capturing your store\'s current state...',
  'analyze_gemini': 'AI is examining every detail...',
  'analyze_checklist': 'Generating personalized recommendations...'
};

const HowItWorksSteps  = [
  {
    number: 1,
    title: "Enter Your Store URL",
    description: "Simply paste the store URL to identify what’s blocking sales.",
    icon: <img src="/HowItWorks/1.png" alt="" className='how-it-works__icon' />
  },
  {
    number: 2,
    title: "Get a Smart Report",
    description: "Choose which types of checking to be done. ",
    icon: <img src="/HowItWorks/2.png" alt="" className='how-it-works__icon' />
  },
  {
    number: 3,
    title: "Optimize Your Store",
    description: "Get personalized fixes and action steps.",
    icon: <img src="/HowItWorks/3.png" alt="" className='how-it-works__icon' />
  }
];

const audiences = [
  {
    icon: Store,
    title: "Shopify Store Owners",
    description: "Find opportunities to improve the overall performance and sales of a store."
  },
  {
    icon: Code,
    title: "Agency Owners",
    description: "Help clients increase revenue by fixing what’s blocking sales."
  },
  {
    icon: Truck,
    title: "Dropshippers",
    description: "Optimize the store to turn every click into a sale. Increase ROAS to its best."
  },
  {
    icon: BarChart3,
    title: "Marketers",
    description: "Discover what’s wrong with marketing and fix it."
  }
];

export default function Home() {
  const router = useRouter();
  const [showFormModal, setShowFormModal] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(CRO_QUOTES[0]);

  const {
    url,
    loading,
    status,
    report,
    handleSubmit,
    handleUrlChange,
    statusMessages,
  } = useAnalysis();

 

  // Cycle through CRO quotes during analysis
  useEffect(() => {
    if (loading) {
      const quoteInterval = setInterval(() => {
        setCurrentQuote(prevQuote => {
          const currentIndex = CRO_QUOTES.indexOf(prevQuote);
          const nextIndex = (currentIndex + 1) % CRO_QUOTES.length;
          return CRO_QUOTES[nextIndex];
        });
      }, 3000); // Change quote every 3 seconds

      return () => clearInterval(quoteInterval);
    }
  }, [loading]);


  // Calculate progress percentage based on status
  const calculateProgress = () => {
    if (!status) return 0;

    const currentStatus = statusMessages[status];
    if (!currentStatus) return 0;

    // Handle special status cases
    if (status === 'complete' || status === 'all-steps-complete') {
      return 100;
    }

    if (status === 'error-occurred') {
      return 0;
    }

    // Define step progress mapping for more granular control
    const stepProgressMap: Record<string, number> = {
      // Step 1: Homepage (0-20%)
      'step-1-homepage-start': 5,
      'screenshot-homepage': 10,
      'analyze-homepage': 15,
      'step-1-homepage-complete': 20,

      // Step 2: Collection (20-40%)
      'step-2-collection-start': 25,
      'screenshot-collection': 30,
      'analyze-collection': 35,
      'step-2-collection-complete': 40,

      // Step 3: Product (40-60%)
      'step-3-product-start': 45,
      'search-product-page': 50,
      'screenshot-product': 55,
      'analyze-product': 60,
      'step-3-product-complete': 65,

      // Step 4: Cart (60-80%)
      'step-4-cart-start': 70,
      'add-cart': 75,
      'screenshot-cart': 80,
      'analyze-cart': 85,
      'step-4-cart-complete': 90,

      // Final steps (90-95%)
      'cleanup': 95,
      'wait-between-steps': 0,
      'wait-for-previous-analyses': 0,
      'fallback-to-puppeteer': 0,
      'starting': 0,
    };

    // Check if we have a specific progress mapping for this status
    if (stepProgressMap[status] !== undefined) {
      return stepProgressMap[status];
    }

    // Fallback to step-based calculation
    const totalSteps = 5;
    const currentStep = currentStatus.step;

    // If step is 0, it's a waiting or error state, return 0
    if (currentStep === 0) return 0;

    // Calculate percentage: (currentStep / totalSteps) * 100
    let progress = Math.round((currentStep / totalSteps) * 100);

    // Add extra progress for specific status types
    if (status.includes('-complete')) {
      // If a step is complete, add 10% more to show progress within the step
      progress += 10;
    } else if (status.includes('-start')) {
      // If a step just started, add 5% to show initial progress
      progress += 5;
    }

    // Cap at 95% until analysis is complete
    return Math.min(progress, 95);
  };

  // Report data loaded

  // Wrapper function to handle form submission with authentication check
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Check server settings for flow configuration
      const response = await fetch(`${config.backendUrl}/settings`);
      if (response.ok) {
        const settingsData = await response.json();
        const serverFlow = settingsData.data?.flow || 'payment';

        if (serverFlow === 'homepage-analysis') {
          // Redirect to analyzing page for homepage analysis
          const analysisUrl = `/analyzing?url=${encodeURIComponent(url)}`;
          router.push(analysisUrl);
          return;
        }
      }
    } catch (error) {
      console.error('Error checking server settings:', error);
    }

    // Check localStorage for admin settings
    const adminSettingsStr = localStorage.getItem('adminSettings');
    if (adminSettingsStr) {
      try {
        const adminSettings = JSON.parse(adminSettingsStr);
        if (adminSettings.paymentEnabled === false) {
          // Payment is disabled, start analysis directly
          handleSubmit(e);
          return;
        }
      } catch (error) {
        console.error('Error parsing admin settings:', error);
      }
    }

    // Default: Redirect to payment page with URL as query parameter
    const paymentUrl = `/payment?url=${encodeURIComponent(url)}`;
    router.push(paymentUrl);
  };


  return (
    <div className="min-h-screen relative overflow-hidden">


      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Shopify CRO Audit",
            "description": "Fix My Store offers a Shopify CRO Audit that doesn't just list issues — we show exactly how to fix them with examples and actionable insights to boost conversions.",
            "brand": {
              "@type": "Organization",
              "name": "Fix My Store"
            },
            "sku": "FMS-CRO-001",
            "url": "https://fixmystore.com/",
            "offers": {
              "@type": "Offer",
              "url": "https://fixmystore.com/",
              "priceCurrency": config.currency,
              "price": `${config.pricing.mainPrice}.00`,
              "availability": "https://schema.org/InStock",
              "itemCondition": "https://schema.org/NewCondition",
              "seller": {
                "@type": "Organization",
                "name": "Conversion AB"
              }
            },
            "review": {
              "@type": "Review",
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": "5",
                "bestRating": "5"
              },
              "author": {
                "@type": "Person",
                "name": "Verified Shopify Merchant"
              }
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "37"
            },
            "sameAs": [
              "https://x.com/fixyourstore?s=21",
              "https://www.instagram.com/fixmystore_com",
              "https://www.youtube.com/@FixMyStore"
            ]
          })
        }}
      />

      {/* <div className="announcment-bar">
        <p>
          Limited time - ${config.pricing.mainPrice} Only - Offer ends in
          <CountdownTimer />
        </p>
      </div> */}

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;25&quot; height=&quot;25&quot; viewBox=&quot;0 0 25 25&quot; fill=&quot;none&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cpath d=&quot;M1 1h1v1H1V1zm0 23h1v1H1v-1zm23 0h1v1h-1v-1zm0-23h1v1h-1V1z&quot; stroke=&quot;%23e5e7eb&quot; stroke-width=&quot;0.5&quot;/%3E%3C/svg%3E')] opacity-30"></div>



      <div className="relative z-10  min-h-screen  main-contaier main-contaier-homepage">


        {
          !loading && <HeroArea
            url={url}
            setUrl={handleUrlChange}
            loading={loading}
            onSubmit={handleFormSubmit}
            servicesChooseModal={true}
          />
        }


        {!loading && !report && (
          <>
            <HowItWorks steps={HowItWorksSteps} />
            <ServicesSection />
            <WhoIsItFor audiences={audiences} />
            <WhyFixSection/>
            {/* <WhatYouGetSection /> */}
            {/* <BeforeAfter /> */}
            <AboutSections />
            {/* <PricingSection /> */}
            {/* <div className='mt-15'>
              <div className="text-center mb-12 flex flex-col gap-8">
                <h2 className="section-header__title">
                  The CRO Team Behind Million-Dollar Shopify Plus Stores

                </h2>
                <p className='section-header__description'>
                  We’ve helped some of the biggest brands turn more clicks into customers. When you work with us, you’re getting proven expertise, not guesswork. Book your call today.

                </p>
              </div>
              <Calandly />
            </div> */}

            {/* <Testimonial /> */}
            <FAQSection />


          </>
        )}

      </div>

      <FormModal
        totalProblems={0}
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        websiteUrl={url}
        isSampleReport={false}
        pageType="homepage"
      />

      <FloatingButton />

    </div>
  );
} 