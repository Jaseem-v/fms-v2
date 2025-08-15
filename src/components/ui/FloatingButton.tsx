'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface FloatingButtonProps {
  path?: string;
}

const FloatingButton = ({ path = "#payment" }: FloatingButtonProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkVisibility = () => {
      // Find the input field wrapper element
      const inputWrapper = document.querySelector('.hero__input-wrapper');
      
      if (inputWrapper) {
        const rect = inputWrapper.getBoundingClientRect();
        // Show button when input field is scrolled out of view (top of input is above viewport)
        const shouldShow = rect.bottom < 0 && window.innerWidth >= 768;
        setIsVisible(shouldShow);
      }
    };

    // Check on scroll
    const handleScroll = () => {
      checkVisibility();
    };

    // Check on resize
    const handleResize = () => {
      checkVisibility();
    };

    // Initial check
    checkVisibility();

    // Add event listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 hidden md:block">
      <Link href={path}
        className="group relative  hero__input-button animate-jerk"
        aria-label="Visit MyFixMyStore"
        style={{
          animation: 'jerk 2s ease-in-out infinite'
        }}
      >

        Fix My Store


        {/* Animated background elements */}
        {/* <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-800 to-black opacity-75 animate-ping"></div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-700 to-black opacity-50"></div> */}

        {/* Hover effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-600 to-black opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
      </Link>

      <style jsx>{`
        @keyframes jerk {
          0%, 100% {
            transform: translateX(0) translateY(0);
          }
          10% {
            transform: translateX(-1px) translateY(-8px);
          }
          20% {
            transform: translateX(1px) translateY(8px);
          }
          30% {
            transform: translateX(-2px) translateY(-6px);
          }
          40% {
            transform: translateX(2px) translateY(6px);
          }
          50% {
            transform: translateX(-1px) translateY(-4px);
          }
          60% {
            transform: translateX(1px) translateY(4px);
          }
          70% {
            transform: translateX(-2px) translateY(-2px);
          }
          80% {
            transform: translateX(2px) translateY(2px);
          }
          90% {
            transform: translateX(-1px) translateY(-1px);
          }
        }
      `}</style>
    </div>
  );
};

export default FloatingButton;
