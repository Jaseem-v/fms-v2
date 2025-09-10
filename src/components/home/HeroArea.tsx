import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { config } from '@/config/config';
import { normalizeUrl } from '@/utils/settingsUtils';

interface HeroAreaProps {
    url: string;
    setUrl: (url: string) => void;
    loading: boolean;
    validatingShopify: boolean;
    onSubmit: (e: React.FormEvent) => void;
    // setShowModal: (show: boolean) => void;
    isSplitPages?: boolean;
    type?: 'homepage' | 'collection' | 'product' | 'cart';
    placeholder?: string;
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

export default function HeroArea({ url, setUrl, loading, validatingShopify, onSubmit, isSplitPages, type, placeholder }: HeroAreaProps) {

    const [activePage, setActivePage] = useState<number | null>(null);
    const [urlError, setUrlError] = useState<string>('');
    const [isSticky, setIsSticky] = useState<boolean>(false);
    const [typingText, setTypingText] = useState<string>('');
    const [currentSiteIndex, setCurrentSiteIndex] = useState<number>(0);
    const [isTyping, setIsTyping] = useState<boolean>(true);
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

        // Clear previous error
        setUrlError('');

        // Validate URL
        // if (!validateUrl(url)) {
        //     setUrlError('Please enter a valid website URL (e.g., example.com or https://shopify.com)');
        //     return;
        // }

        // Normalize the URL before submitting
        const normalizedUrl = normalizeUrl(url);

        // Update the URL state with the normalized version
        setUrl(normalizedUrl);

        // Call the original onSubmit with the original event
        onSubmit(e);
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
                    Your store is leaking, <br />
                    Let's fix it
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
                        Stop Losing Sales on <br />
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
                        Your store is leaking, <br />
                        Let's fix it
                    </>
                );
        }
    };

    const getMobileTitleContent = () => {
        if (!isSplitPages) {
            return 'Your store is leaking, Let\'s fix it!';
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
                return 'Your store is leaking, Let\'s fix it!';
        }
    };

    const getDescriptionContent = () => {
        if (!isSplitPages) {
            return 'Discover what\'s blocking your store sales. Fix your store now!';
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
                return 'Discover what\'s blocking your store sales. Fix your store now!';
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
        <div className='hero__content' id='payment'>
            <div className="hero__details">
                <div className="hero__details-trust">
                    <div className="hero__details-trust-icon">
                        <img src="/icons/1.svg" alt="trust" />
                        <img src="/icons/2.svg" alt="trust" />
                        <img src="/icons/3.svg" alt="trust" />
                    </div>
                    <div className="hero__details-trust-text">
                        25+ Shopify stores optimized this month
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



                <div className='hero__input-guarantee'>
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
                </div>

                <div className="text-center flex items-center justify-center gap-2 w-max mx-auto">
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

                </div>



            </div>






            <div className="hero__gradient-bg">

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
    )
}
