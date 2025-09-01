'use client';

import AboutSections from '@/components/home/AboutSections';
import BeforeAfter from '@/components/home/BeforeAfter';
import Calandly from '@/components/home/Calandly';
import FAQSection from '@/components/home/FAQSection';
import HeroArea from '@/components/home/HeroArea';
import PageSpecificFeatures from '@/components/home/PageSpecificFeatures';
import PricingSection from '@/components/home/PricingSection';
import WhatYouGetSection from '@/components/home/WhatYouGetSection';
import CountdownTimer from '@/components/ui/CountdownTimer';
import FloatingButton from '@/components/ui/FloatingButton';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
    const router = useRouter();
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [validatingShopify, setValidatingShopify] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url.trim()) return;

        setLoading(true);
        try {
            // Redirect to analyzing page with URL and page type
            const analysisUrl = `/analyzing?url=${encodeURIComponent(url)}&pageType=cart`;
            router.push(analysisUrl);
        } catch (error) {
            console.error('Error submitting form:', error);
            setLoading(false);
        }
    };

    const handleUrlChange = (newUrl: string) => {
        setUrl(newUrl);
    };

    return (
        <div className="min-h-screen bg-green-50 relative overflow-hidden">

            <div className="announcment-bar">
                <p>
                    Limited time - $149 Only - Offer ends in
                    <CountdownTimer />
                </p>
            </div>

            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;25&quot; height=&quot;25&quot; viewBox=&quot;0 0 25 25&quot; fill=&quot;none&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cpath d=&quot;M1 1h1v1H1V1zm0 23h1v1H1v-1zm23 0h1v1h-1v-1zm0-23h1v1h-1V1z&quot; stroke=&quot;%23e5e7eb&quot; stroke-width=&quot;0.5&quot;/%3E%3C/svg%3E')] opacity-30"></div>

            <div className="relative z-10  px-4 py-12 min-h-screen flex flex-col justify-center  main-contaier">

                <HeroArea
                    url={url}
                    setUrl={handleUrlChange}
                    loading={loading}
                    validatingShopify={validatingShopify}
                    onSubmit={handleSubmit}
                    isSplitPages={true}
                    type="cart"
                />

                <PageSpecificFeatures type="cart" />

                <>
                    <WhatYouGetSection isSplitPage={true} />
                    <AboutSections />
                    <PricingSection
                        isSplitPage={true}
                        type="cart"
                    />
                    <div className='mt-15'>
                        <div className="text-center mb-12 flex flex-col gap-8">
                            <h2 className="section-header__title">
                                The CRO Team Behind Million-Dollar Shopify Plus Stores
                            </h2>
                            <p className='section-header__description'>
                                We've helped some of the biggest brands turn more clicks into customers. When you work with us, you're getting proven expertise, not guesswork. Book your call today.
                            </p>
                        </div>
                        <Calandly />
                    </div>
                    <FAQSection
                        isSplitPage={true}
                        type="cart"
                    />
                </>

            </div>

            <FloatingButton />

        </div>
    );
}
