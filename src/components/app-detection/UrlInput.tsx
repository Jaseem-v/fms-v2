/**
 * URL Input Component for Shopify Store Detection
 * Handles URL input validation and submission with HeroArea styling
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';

interface UrlInputProps {
  onDetect: (url: string) => void;
  isLoading: boolean;
  error?: string;
}

export function UrlInput({ onDetect, isLoading, error }: UrlInputProps) {
  const [url, setUrl] = useState('');

  const validateUrl = (inputUrl: string): boolean => {
    try {
      const url = new URL(inputUrl.startsWith('http') ? inputUrl : `https://${inputUrl}`);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) return;

    const normalizedUrl = url.trim();
    if (!validateUrl(normalizedUrl)) {
      return;
    }

    onDetect(normalizedUrl);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const isValid = url.trim() === '' || validateUrl(url);

  return (
    <div className='hero__content'>
      <div className="hero__details">

        {/* <div className="w-full flex justify-center gap-4 items-center mb-12">
          <div className='stats__item'>
            Too many apps
          </div>
          <span>
            =
          </span>
          <div className='flex items-center gap-2'>
            <div className='stats__item'>
              slower site speed
            </div>
            <span>
              +
            </span>
            <div className='stats__item'>
              lower conversions.
            </div>
          </div>
        </div> */}

        <h1 className='app-suggest-hero__title'>
          Discover Apps in a Shopify Store
        </h1>
        {/* <h1 className='app-suggest-hero__title md:hidden'>
        Discover Apps in a Shopify Store
        </h1> */}
        <p className='app-suggest-hero__description mt-5'>
          Find out the apps powering your competitors in a click!
        </p>
      </div>

      <div className="hero__input-wrapper mt-12 app-suggest-hero__input-wrapper">
        <form
          className="hero__input-container "
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name='siteUrl'
            placeholder="https://shopify.com"
            className={`hero__input-field ${!isValid && url.trim() !== '' ? 'hero__input-field--error' : ''}`}
            value={url}
            onChange={handleUrlChange}
            disabled={isLoading}
          />

          <button className='hero__input-button' type='submit' >
            {isLoading ? 'Analyzing...' : 'Get Apps'}

            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M13 17L18 12L13 7M6 17L11 12L6 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>

        {(!isValid && url.trim() !== '') && (
          <div className="hero__input-error">
            Please enter a valid URL (e.g., https://example.myshopify.com)
          </div>
        )}

        {error && (
          <div className="hero__input-error">
            {error}
          </div>
        )}


      </div>



      {/* <div className="hero__gradient-bg"></div> */}

      <div className="flex justify-center">
        <img src="https://cdn-daoob.nitrocdn.com/LCiYkAjyMYQllcWpSRewurPZnOGNoosN/assets/images/optimized/rev-5e03d09/arulmjoseph.com/wp-content/uploads/2024/08/Shopify-Partner.png" alt="" style={{ width: "250px" }} />
      </div>
    </div>
  );
}
