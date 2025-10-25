'use client';

import { useState, useEffect } from 'react';
import industryService, { Industry } from '@/services/industryService';

interface IndustrySelectionProps {
  onIndustrySelect: (industry: Industry | null) => void;
  selectedIndustry: Industry | null;
  disabled?: boolean;
}

// Category icons mapping
const CATEGORY_ICONS: Record<string, string> = {
  'Fashion & Apparel': '👕',
  'Beauty & Cosmetics': '💄',
  'Electronics & Gadgets': '📱',
  'Food & Beverages': '🍽️',
  'Health & Wellness': '🧘',
  'Home & Lifestyle': '🏠',
  'Others': '📦'
};

export default function IndustrySelection({ 
  onIndustrySelect, 
  selectedIndustry, 
  disabled = false 
}: IndustrySelectionProps) {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await industryService.getAllIndustries();
        setIndustries(data);
      } catch (err) {
        console.error('Error fetching industries:', err);
        setError('Failed to load industries');
      } finally {
        setLoading(false);
      }
    };

    fetchIndustries();
  }, []);

  const handleIndustrySelect = (industry: Industry) => {
    onIndustrySelect(industry);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Which category are you in?</h1>
          <p className="text-lg text-black">Choose the category that best matches your store.</p>
        </div>

        {/* Category selection grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {industries.map((industry) => {
            const isSelected = selectedIndustry?.id === industry.id;
            const icon = CATEGORY_ICONS[industry.name] || '📦';
            
            return (
              <button
                key={industry.id}
                onClick={() => handleIndustrySelect(industry)}
                disabled={disabled}
                className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                  isSelected
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="text-2xl">{icon}</div>
                <span className="text-sm font-medium text-center">{industry.name}</span>
              </button>
            );
          })}
        </div>

        {/* Next button */}
        {selectedIndustry && (
          <div className="text-center">
            <button
              onClick={() => onIndustrySelect(selectedIndustry)}
              className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200"
            >
              Next &gt;&gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
