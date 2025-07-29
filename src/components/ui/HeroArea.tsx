import React, { useState } from 'react'
import Link from 'next/link'

interface HeroAreaProps {
    url: string;
    setUrl: (url: string) => void;
    loading: boolean;
    validatingShopify: boolean;
    onSubmit: (e: React.FormEvent) => void;
    // setShowModal: (show: boolean) => void;
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

// Helper function to normalize URL by adding https:// if no protocol is present
const normalizeUrl = (url: string): string => {
    if (!url) return url;

    // Check if URL already has a protocol (http://, https://, etc.)
    if (url.match(/^https?:\/\//)) {
        return url;
    }

    // Add https:// if no protocol is present
    return `https://${url}`;
};

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

export default function HeroArea({ url, setUrl, loading, validatingShopify, onSubmit }: HeroAreaProps) {

    const [activePage, setActivePage] = useState(2);
    const [urlError, setUrlError] = useState<string>('');

    const handleMouseEnter = (index: number) => {
        setActivePage(index);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Clear previous error
        setUrlError('');

        // Validate URL
        if (!validateUrl(url)) {
            setUrlError('Please enter a valid website URL (e.g., example.com or https://example.com)');
            return;
        }

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

    return (
        <div className='hero__content'>
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
                <h1 className='hero__details-title'>
                    Fix My Store
                </h1>
                <p className='hero__details-description'>
                    Simple fixes to turn visitors into buyers!
                    No guesswork, just real results!
                </p>
            </div>


            <div className="hero__input-wrapper">
                <form className="hero__input-container" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder='Enter your store URL'
                        className={`hero__input-field ${urlError ? 'hero__input-field--error' : ''}`}
                        value={url}
                        onChange={handleUrlChange}
                    />

                    <button className='hero__input-button' type='submit' disabled={loading}>
                        {loading ? 'Generating...' : 'Generate report'}

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
            </div>


            {/* <div className="hero__payment-section">
                <div className="hero__payment-info">
                    <span className="hero__payment-price">$99.99</span>
                    <span className="hero__payment-text">for comprehensive analysis</span>
                </div>
                <Link 
                    href={`/payment?url=${encodeURIComponent(url)}`}
                    className="hero__payment-button"
                >
                    Pay & Get Analysis
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </Link>
            </div> */}

            <div className="hero__gradient-bg">

            </div>

            <ul className="hero__pages-list">

                {pages.map((page, index) => (
                    <li className={`hero__pages-item ${activePage === index ? 'active' : ''}`} key={index} onMouseEnter={() => handleMouseEnter(index)}>
                        <h2 className='hero__pages-item-icon'>
                            {page.icon}
                        </h2>
                        <h4 className="hero__pages-item-text">
                            Analyzing <br />
                            {page.text}
                        </h4>
                    </li>
                ))}

            </ul>

        </div>
    )
}
