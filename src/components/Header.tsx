'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { isAuthenticated } = useAuth();
  
  return (
    <header className="mb-12">
      {/* Navigation */}
      <nav className="flex justify-center mb-8">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <a
            href="/"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md shadow-sm hover:bg-gray-50 transition-colors"
          >
            🏠 Analysis
          </a>
          <a
                            href="/image-references"
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              isAuthenticated 
                ? 'text-gray-700 hover:text-gray-900 hover:bg-white rounded-md' 
                : 'text-gray-400 cursor-not-allowed opacity-50'
            }`}
            onClick={!isAuthenticated ? (e) => e.preventDefault() : undefined}
            title={!isAuthenticated ? 'Login required to access Image References' : ''}
          >
            🎯 Image References {!isAuthenticated && '🔒'}
          </a>
        </div>
      </nav>
      
      {/* Main Header Content */}
      <div className="text-center">
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          🚀 Instant Analysis
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          🎯 Actionable Insights
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
          ⏰ Real-Time Results
        </span>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
        <span className="relative inline-block">
          <span className="relative z-10 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Shopify CRO Analysis
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 transform rotate-1 rounded-lg"></div>
        </span>{' '}
        for Your Store
      </h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
        Why aren&apos;t your Shopify visitors buying? Get{' '}
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
          clear answers
        </span>{' '}
        and{' '}
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
          simple fixes
        </span>{' '}
        to turn{' '}
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
          browsers into buyers
        </span>
        .{' '}
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
          Shopify-specific
        </span>{' '}
        analysis with{' '}
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
          actionable solutions
        </span>{' '}
        to boost your store&apos;s conversion rate.
      </p>
      </div>
    </header>
  );
} 