'use client';

import React, { useState } from 'react';
import AnalysisDisplay from '../../components/AnalysisDisplay';

// Sample analysis data matching your format
const sampleAnalysisData = [
  {
    category: 'high_impact',
    area: 'trust',
    problem: 'Lack of visible trust signals such as security badges or customer reviews on the homepage.',
    impact_reason: 'Absence of trust signals can increase user anxiety, reducing the likelihood of conversion.',
    solution: 'Add security badges near the CTA and include a section for customer testimonials or reviews.',
    implementation_complexity: 'medium',
    estimated_lift: '10-15%',
    testing_approach: 'A/B test the inclusion of trust signals to measure their impact on conversion rates.',
    rationale: 'Trust and credibility signals are crucial for reducing anxiety and increasing user confidence.',
    relevantChunks: [
      {
        id: 'chunk_1752566277349',
        imageUrl: '/uploads/chunk_1752566277349.png',
        useCases: 'Customer testimonials and reviews section. Useful for showing social proof, building trust, and demonstrating customer satisfaction.',
        uploadDate: '2025-07-15T07:58:01.747Z',
        fileName: 'chunk_1752566277349.png'
      },
      {
        id: 'chunk_1752573591640',
        imageUrl: '/uploads/chunk_1752573591640.png',
        useCases: 'Trust badges and product quality indicators. Demonstrates how to build customer trust through quality assurances and authenticity claims.',
        uploadDate: '2025-07-15T09:59:55.624Z',
        fileName: 'chunk_1752573591640.png'
      }
    ]
  },
  {
    category: 'medium_impact',
    area: 'conversion',
    problem: 'Unclear pricing structure and missing call-to-action buttons on product pages.',
    impact_reason: 'Confusing pricing and hidden CTAs can lead to cart abandonment and reduced sales.',
    solution: 'Implement clear pricing display with discount indicators and prominent, well-positioned CTA buttons.',
    implementation_complexity: 'low',
    estimated_lift: '8-12%',
    testing_approach: 'Test different CTA button placements and pricing display formats to optimize conversion.',
    rationale: 'Clear pricing and prominent CTAs reduce friction in the purchase decision process.',
    relevantChunks: [
      {
        id: 'chunk_1752567465936',
        imageUrl: '/uploads/chunk_1752567465936.png',
        useCases: 'Product display with pricing and call-to-action. Shows how to present product information with clear pricing, ratings, and purchase buttons.',
        uploadDate: '2025-07-15T08:17:49.509Z',
        fileName: 'chunk_1752567465936.png'
      }
    ]
  },
  {
    category: 'high_impact',
    area: 'navigation',
    problem: 'Poor homepage navigation with unclear category organization and missing promotional highlights.',
    impact_reason: 'Confusing navigation can frustrate users and prevent them from finding desired products quickly.',
    solution: 'Reorganize homepage navigation with clear category icons and prominent deals section.',
    implementation_complexity: 'medium',
    estimated_lift: '12-18%',
    testing_approach: 'A/B test different navigation layouts and category organization to improve user flow.',
    rationale: 'Intuitive navigation reduces cognitive load and helps users find products faster.',
    relevantChunks: [
      {
        id: 'chunk_1752573860970',
        imageUrl: '/uploads/chunk_1752573860970.png',
        useCases: 'Homepage navigation with category icons and deals section. Shows effective homepage organization with clear category navigation and promotional highlights.',
        uploadDate: '2025-07-15T10:04:23.974Z',
        fileName: 'chunk_1752573860970.png'
      }
    ]
  },
  {
    category: 'low_impact',
    area: 'social_proof',
    problem: 'Missing customer reviews and ratings on product pages.',
    impact_reason: 'Lack of social proof can reduce customer confidence in product quality and purchase decisions.',
    solution: 'Add customer reviews section with ratings and testimonials to product pages.',
    implementation_complexity: 'low',
    estimated_lift: '5-8%',
    testing_approach: 'Test different review display formats and placement to maximize impact.',
    rationale: 'Social proof helps customers make informed decisions and builds confidence in the product.',
    relevantChunks: [
      {
        id: 'chunk_1752568320800',
        imageUrl: '/uploads/chunk_1752568320800.png',
        useCases: 'Product page with reviews, pricing, and add-to-cart functionality. Demonstrates effective product presentation with social proof (reviews), pricing strategy (discounts), and clear purchase actions.',
        uploadDate: '2025-07-15T08:32:05.867Z',
        fileName: 'chunk_1752568320800.png'
      }
    ]
  }
];

export default function AnalysisDisplayPage() {
  const [analysisData, setAnalysisData] = useState(sampleAnalysisData);
  const [showRawData, setShowRawData] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analysis Display Demo</h1>
              <p className="text-gray-600 mt-2">
                Showcasing the neat UI for displaying CRO analysis data
              </p>
            </div>
            <button
              onClick={() => setShowRawData(!showRawData)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {showRawData ? 'Hide' : 'Show'} Raw Data
            </button>
          </div>
        </div>
      </div>

      {showRawData && (
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Raw Analysis Data</h3>
            <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(analysisData, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <AnalysisDisplay 
        analysisData={analysisData} 
        title="CRO Optimization Analysis"
      />
    </div>
  );
} 