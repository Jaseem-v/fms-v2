import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { config } from '@/config/config';
import { normalizeUrl } from '@/utils/settingsUtils';
import AnalyticsService from '@/services/analyticsService';

interface HeroAreaProps {
    url: string;
    setUrl: (url: string) => void;
    loading: boolean;
    onSubmit: (e: React.FormEvent) => void;
    // setShowModal: (show: boolean) => void;
    isSplitPages?: boolean;
    type?: 'homepage' | 'collection' | 'product' | 'cart';
    placeholder?: string;
    servicesChooseModal?: boolean;
}

const pages = [
    {
        icon: '🏠',
        text: 'Home page'
    },
    {
        icon: '📦',
        text: 'Collection page'
    },
    {
        icon: '🛍️',
        text: 'Product page'
    },
    {
        icon: '🛒',
        text: 'Cart page'
    }
]

// Sample site names for typing animation
const sampleSites = [
    'fentybeauty.com',
    'gymshark.com',
    'kyliecosmetics.com',
    'brooklinen.com',
    'huel.com'
];

// Services for the modal
const services = [
    {
        id: 'cro-audit',
        title: 'AI CRO Audit',
        description: 'Turn more visitors into customers',
        isSelected: true,
        isLocked: false
    },
    {
        id: 'app-audit',
        title: 'App Audit',
        description: 'Remove unwanted apps',
        isSelected: false,
        isLocked: true
    },
    {
        id: 'mobile-experience',
        title: 'Mobile Experience',
        description: 'Ensure easy browsing on mobiles',
        isSelected: false,
        isLocked: true
    },
    {
        id: 'seo-audit',
        title: 'AI SEO Audit',
        description: 'Get discovered on ChatGPT',
        isSelected: false,
        isLocked: true
    },
    {
        id: 'page-speed',
        title: 'Page Speed',
        description: 'Load faster, Sell faster',
        isSelected: false,
        isLocked: true
    }
];

// Helper function to normalize URL by adding https:// if no protocol is present


// Helper function to validate URL
const validateUrl = (url: string): boolean => {
    if (!url || url.trim() === '') return false;

    try {
        const normalizedUrl = normalizeUrl(url);
        const urlObj = new URL(normalizedUrl);

        // Check if it's a valid URL with a domain
        const hasValidHostname = Boolean(urlObj.hostname) && urlObj.hostname.includes('.');
        const hasValidProtocol = urlObj.protocol === 'http:' || urlObj.protocol === 'https:';

        return hasValidHostname && hasValidProtocol;
    } catch (error) {
        return false;
    }
};

export default function HeroArea({ url, setUrl, loading, onSubmit, isSplitPages, type, placeholder, servicesChooseModal }: HeroAreaProps) {

    const router = useRouter();
    const [activePage, setActivePage] = useState<number | null>(null);
    const [urlError, setUrlError] = useState<string>('');
    const [isSticky, setIsSticky] = useState<boolean>(false);
    const [typingText, setTypingText] = useState<string>('');
    const [currentSiteIndex, setCurrentSiteIndex] = useState<number>(0);
    const [isTyping, setIsTyping] = useState<boolean>(true);
    const [showServicesModal, setShowServicesModal] = useState<boolean>(false);
    const inputWrapperRef = useRef<HTMLDivElement>(null);
    const inputContainerRef = useRef<HTMLFormElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Auto-focus the input field when component mounts
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    // Typing animation effect
    useEffect(() => {
        if (!isTyping || url.trim() !== '') return;

        let currentText = '';
        let currentCharIndex = 0;
        const targetSite = sampleSites[currentSiteIndex];

        const typeInterval = setInterval(() => {
            if (currentCharIndex < targetSite.length) {
                currentText += targetSite[currentCharIndex];
                setTypingText(currentText);
                currentCharIndex++;
            } else {
                // Wait a bit before starting to delete
                setTimeout(() => {
                    const deleteInterval = setInterval(() => {
                        if (currentText.length > 0) {
                            currentText = currentText.slice(0, -1);
                            setTypingText(currentText);
                        } else {
                            clearInterval(deleteInterval);
                            // Move to next site
                            setCurrentSiteIndex((prev) => (prev + 1) % sampleSites.length);
                        }
                    }, 100);
                }, 1500);
                clearInterval(typeInterval);
            }
        }, 150);

        return () => clearInterval(typeInterval);
    }, [currentSiteIndex, isTyping, url]);

    // Stop typing animation when user starts typing
    useEffect(() => {
        if (url.trim() !== '') {
            setIsTyping(false);
        } else {
            setIsTyping(true);
        }
    }, [url]);

    useEffect(() => {
        const handleScroll = () => {
            if (!inputWrapperRef.current || !inputContainerRef.current) return;

            const wrapperRect = inputWrapperRef.current.getBoundingClientRect();
            const isMobile = window.innerWidth <= 768;

            if (isMobile && wrapperRect.top <= 0) {
                setIsSticky(true);
                document.body.style.paddingBottom = '60px';
            } else {
                setIsSticky(false);
                document.body.style.paddingBottom = '0px';
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.body.style.paddingBottom = '0px';
        };
    }, []);

    const handleMouseEnter = (index: number) => {
        setActivePage(index);
    }
    const handleMouseLeave = () => {
        setActivePage(null);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // If services modal should be shown, show it instead of submitting
        if (servicesChooseModal && !showServicesModal) {
            setShowServicesModal(true);
            return;
        }

        // If modal is open, don't submit
        if (showServicesModal) {
            return;
        }

        // Clear previous error
        setUrlError('');

        // Validate URL
        // if (!validateUrl(url)) {
        //     setUrlError('Please enter a valid website URL (e.g., example.com or https://shopify.com)');
        //     return;
        // }

        // Normalize the URL before submitting
        const normalizedUrl = normalizeUrl(url);

        // Track URL entry and FixMyStore click
        AnalyticsService.trackUrlEntry(normalizedUrl, AnalyticsService.extractWebsiteName(normalizedUrl));
        AnalyticsService.trackFixMyStoreClick(normalizedUrl, AnalyticsService.extractWebsiteName(normalizedUrl));

        // Update the URL state with the normalized version
        setUrl(normalizedUrl);

        // Call the original onSubmit with the original event
        onSubmit(e);
    };

    const handleUnlockService = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        router.push('/pricing');
    };

    const handleContinue = () => {
        setShowServicesModal(false);
        
        // Continue with normal flow - submit the form
        const normalizedUrl = normalizeUrl(url);
        
        // Track URL entry and FixMyStore click
        AnalyticsService.trackUrlEntry(normalizedUrl, AnalyticsService.extractWebsiteName(normalizedUrl));
        AnalyticsService.trackFixMyStoreClick(normalizedUrl, AnalyticsService.extractWebsiteName(normalizedUrl));
        
        // Update the URL state with the normalized version
        setUrl(normalizedUrl);
        
        // Create a synthetic event and call onSubmit
        const syntheticEvent = new Event('submit') as unknown as React.FormEvent;
        onSubmit(syntheticEvent);
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newUrl = e.target.value;
        setUrl(newUrl);

        // Clear error when user starts typing
        if (urlError) {
            setUrlError('');
        }
    };

    // Get placeholder text - show typing animation when empty, show static text when user is typing
    const getPlaceholderText = () => {
        if (placeholder) {
            return placeholder;
        }
        if (url.trim() === '' && isTyping) {
            return typingText;
        }
        return 'https://shopify.com';
    };

    const getTitleContent = () => {
        if (!isSplitPages) {
            return (
                <>
                    Shopify AI Store Audit
                </>
            );
        }

        switch (type) {
            case 'homepage':
                return (
                    <>
                        Fix Revenue Leaks Starting <br />
                        From Your Homepage
                    </>
                );
            case 'collection':
                return (
                    <>
                        Are Shoppers Dropping Off  <br />
                        on Your Collection Page
                    </>
                );
            case 'product':
                return (
                    <>
                        Stop Losing Sales on
                        Your Product Page
                    </>
                );
            case 'cart':
                return (
                    <>
                        High Cart Abandonment? <br />
                        Let's Fix Your Cart Page.
                    </>
                );
            default:
                return (
                    <>
                        Shopify AI Store Audit
                    </>
                );
        }
    };

    const getMobileTitleContent = () => {
        if (!isSplitPages) {
            return 'Shopify AI Store Audit';
        }

        switch (type) {
            case 'homepage':
                return 'Fix Revenue Leaks Starting From Your Homepage';
            case 'collection':
                return 'Are Shoppers Dropping Off on Your Collection Page';
            case 'product':
                return 'Stop Losing Sales on Your Product Page';
            case 'cart':
                return 'High Cart Abandonment? Let\'s Fix Your Cart Page.';
            default:
                return 'Shopify AI Store Audit';
        }
    };

    const getDescriptionContent = () => {
        if (!isSplitPages) {
            return 'Powered by AI. Reviewed by humans. Trusted by store owners';
        }

        switch (type) {
            case 'homepage':
                return `If your homepage isn't optimized, visitors won't explore further. Let us audit and show you what to fix.`;
            case 'collection':
                return `Your collection pages should guide customers to products not confuse them. Let us audit and fix it.`;
            case 'product':
                return `Get a detailed audit of your product pages, with image references and app recommendations to stop revenue leaks.`;
            case 'cart':
                return `Your cart page is the last step before checkout. A small tweak could save thousands in lost revenue.`;
            default:
                return 'DPowered by AI. Reviewed by humans. Trusted by store owners.';
        }
    };

    const getButtonText = () => {
        if (!isSplitPages) {
            return 'Fix My Store';
        }

        switch (type) {
            case 'homepage':
                return 'Fix My Homepage';
            case 'collection':
                return 'Fix My Collection Page';
            case 'product':
                return 'Fix My Product Page';
            case 'cart':
                return 'Fix My Cart Page';
            default:
                return 'Fix My Store';
        }
    };

    return (
        <div className="hero">
            <div className='hero__content' id='payment'>
                <div className="hero__details">
                    <div className="hero__details-trust">
                        <div className="hero__details-trust-icon">
                            <img src="/icons/1.svg" alt="trust" />
                            <img src="/icons/2.svg" alt="trust" />
                            <img src="/icons/3.svg" alt="trust" />
                        </div>
                        <div className="hero__details-trust-text">
                            25+ Shopify stores audited by AI so far.

                        </div>
                    </div>
                    <h1 className='hero__details-title hidden md:block'>
                        {getTitleContent()}
                    </h1>
                    <h1 className='hero__details-title  md:hidden'>
                        {getMobileTitleContent()}
                    </h1>
                    <p className='hero__details-description'>
                        {getDescriptionContent()}
                    </p>
                </div>


                <div className="hero__input-wrapper" ref={inputWrapperRef}>
                    <form
                        className={`hero__input-container ${isSticky ? 'hero__input-container--sticky' : ''}`}
                        onSubmit={handleSubmit}
                        ref={inputContainerRef}
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            name='siteUrl'
                            placeholder={getPlaceholderText()}
                            className={`hero__input-field ${urlError ? 'hero__input-field--error' : ''}`}
                            value={url}
                            onChange={handleUrlChange}
                        />

                        <button className='hero__input-button' type='submit' disabled={loading}>
                            {loading ? 'Analyzing...' : getButtonText()}

                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M13 17L18 12L13 7M6 17L11 12L6 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </button>

                    </form>

                    {urlError && (
                        <div className="hero__input-error">
                            {urlError}
                        </div>
                    )}



                    {/* <div className='hero__input-guarantee'>
                    <span>
                        {isSplitPages ? "FREE Audit" : ("$" + config.pricing.mainPrice + " One Time Payment")}
                    </span>
                    <span className='hidden md:block'>
                        •
                    </span>
                    <span className='md:hidden'>
                        |
                    </span>
                    <span>
                        {isSplitPages ? `${type ? type.charAt(0).toUpperCase() + type.slice(1) : ''} Page Audit` : " Full Store Audit"}

                    </span>
                    <span className='hidden md:block'>
                        •
                    </span>
                    <span className='md:hidden'>
                        |
                    </span>
                    <span>
                        {isSplitPages ? "Increase Sales" : "One-on-One Consultation"}
                    </span>
                </div> */}

                    {/* <div className="text-center flex items-center justify-center gap-2 w-max mx-auto">
                    <Link
                        href="/report/sitteer-com-1754311226618-955541-yhb6og?isSampleReport=true"
                        // onClick={handleSeeSample}
                        className="link-btn"
                    >
                        <div className="link-btn__icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                                <path d="M0.71875 5.39844H9.46875M9.46875 5.39844L5.09375 1.02344M9.46875 5.39844L5.09375 9.77344" stroke="white" stroke-width="1.27312" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                        See Sample Audit

                    </Link>

                </div> */}
                    <div className="hero__gradient-bg">

                    </div>


                </div>








                <div className="hero__services">
                    <div className="hero__services-item hero__services-item--green">
                        <h3 className="hero__services-title">AI CRO Audit                        </h3>
                        <p className="hero__services-description">Turn more visitors into customers</p>
                    </div>

                    <div className="hero__services-item  hero__services-item--blue">
                        <h3 className="hero__services-title">App Audit</h3>
                        <p className="hero__services-description">Remove unwanted apps</p>
                    </div>
                    <div className="hero__services-item hero__services-item--purple">
                        <h3 className="hero__services-title">Mobile Experience</h3>
                        <p className="hero__services-description">Ensure easy browsing on mobiles</p>
                    </div>
                    <div className="hero__services-item ">
                        <h3 className="hero__services-title">AI SEO Audit</h3>
                        <p className="hero__services-description">Get discovered on ChatGPT</p>
                    </div>
                    <div className="hero__services-item hero__services-item--yellow">
                        <h3 className="hero__services-title">Page speed</h3>
                        <p className="hero__services-description">Load faster, Sell faster</p>
                    </div>
                </div>

                {/* <ul className="hero__pages-list">

                {pages.map((page, index) => (
                    <li className={`hero__pages-item ${activePage === index ? 'active' : ''}`} key={index} onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave}>
                        <h2 className='hero__pages-item-icon'>
                            {page.icon}
                        </h2>
                        <h4 className="hero__pages-item-text">
                            Analyzing <br />
                            {page.text}
                        </h4>
                    </li>
                ))}

            </ul> */}

                <div className="flex justify-center">
                    <img src="https://cdn-daoob.nitrocdn.com/LCiYkAjyMYQllcWpSRewurPZnOGNoosN/assets/images/optimized/rev-5e03d09/arulmjoseph.com/wp-content/uploads/2024/08/Shopify-Partner.png" alt="" style={{ width: "250px" }} />
                </div>

            </div>

            {/* Services Selection Modal */}
            {showServicesModal && (
                <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4" style={{ zIndex: 50000 }}>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-xl max-w-3xl w-full overflow-hidden">
                        <div className="flex  lead-form__container relative">
                            <div className="flex-1 p-4 md:p-8 flex flex-col justify-center">
                                {/* Header */}
                                <div className="text-center mb-6 md:mb-8">
                                    <h1 className="text-4xl font-bold text-gray-900 mb-2 flex-col md:flex-row gap-2 text-left">
                                        <span className="lead-form__subtitle">CHOOSE YOUR</span><br />
                                        <span className="lead-form__title">SERVICES</span>
                                    </h1>
                                </div>

                                <button
                                    onClick={() => setShowServicesModal(false)}
                                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors z-10"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                {/* Services List */}
                                <div className="space-y-4 mb-6">
                                    {services.map((service) => (
                                        <div
                                            key={service.id}
                                            className={`border-2 rounded-lg transition-all ${
                                                service.isSelected
                                                    ? 'border-gray-900 bg-gray-50 shadow-md'
                                                    : 'bg-white shadow-sm border-gray-200 opacity-75'
                                            }`}
                                        >
                                            <div className="p-4">
                                                <div className={`flex ${service.isLocked ? 'flex sm:flex-row sm:items-start sm:justify-between items-center justify-center' : 'items-center justify-between'} gap-3`}>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                                service.isSelected ? 'bg-gray-900' : 'bg-gray-400'
                                                            }`}>
                                                                {service.isSelected ? (
                                                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                    </svg>
                                                                ) : (
                                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                            <h3 className="text-lg font-semibold text-gray-900 instrument-sans">{service.title}</h3>
                                                        </div>
                                                        <p className="text-gray-600 ml-9 hidden md:block">{service.description}</p>
                                                    </div>
                                                    {service.isLocked && (
                                                        <button
                                                            onClick={handleUnlockService}
                                                            className="ml-0 sm:ml-4 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium whitespace-nowrap w-auto sm:w-auto"
                                                        >
                                                            Unlock
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Continue Button */}
                                <button
                                    onClick={handleContinue}
                                    className="download-button w-full mt-6"
                                >
                                    Continue with AI CRO Audit »
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
