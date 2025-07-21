'use client';

import React from 'react';

interface AnalysisItem {
  category: string;
  area: string;
  problem: string;
  impact_reason: string;
  solution: string;
  implementation_complexity: string;
  estimated_lift: string;
  testing_approach: string;
  rationale: string;
  relevantChunks: any[];
}

interface AnalysisDisplayProps {
  analysisData: AnalysisItem[];
  title?: string;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysisData, title = "CRO Analysis Results" }) => {
  const getComplexityColor = (complexity: string) => {
    switch (complexity.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'high_impact': return 'bg-red-50 border-red-200';
      case 'medium_impact': return 'bg-yellow-50 border-yellow-200';
      case 'low_impact': return 'bg-green-50 border-green-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  const getAreaIcon = (area: string) => {
    switch (area.toLowerCase()) {
      case 'trust': return '🛡️';
      case 'conversion': return '💰';
      case 'navigation': return '🧭';
      case 'pricing': return '🏷️';
      case 'social_proof': return '👥';
      case 'cta': return '🎯';
      default: return '📊';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600">Analysis of {analysisData.length} optimization opportunities</p>
      </div>

      <div className="space-y-6">
        {analysisData.map((item, index) => (
          <div
            key={index}
            className={`border rounded-lg p-6 ${getCategoryColor(item.category)} shadow-sm hover:shadow-md transition-shadow`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getAreaIcon(item.area)}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 capitalize">
                    {item.area.replace('_', ' ')} Optimization
                  </h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {item.category.replace('_', ' ')} Impact
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getComplexityColor(item.implementation_complexity)}`}>
                  {item.implementation_complexity} Complexity
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {item.estimated_lift} Lift
                </span>
              </div>
            </div>

            {/* Problem and Impact */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                  <span className="mr-2">⚠️</span>
                  Problem
                </h4>
                <p className="text-red-700 text-sm">{item.problem}</p>
                <div className="mt-3 pt-3 border-t border-red-200">
                  <h5 className="font-medium text-red-800 text-xs mb-1">Impact Reason:</h5>
                  <p className="text-red-600 text-xs">{item.impact_reason}</p>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                  <span className="mr-2">💡</span>
                  Solution
                </h4>
                <p className="text-green-700 text-sm">{item.solution}</p>
                <div className="mt-3 pt-3 border-t border-green-200">
                  <h5 className="font-medium text-green-800 text-xs mb-1">Rationale:</h5>
                  <p className="text-green-600 text-xs">{item.rationale}</p>
                </div>
              </div>
            </div>

            {/* Testing Approach */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                <span className="mr-2">🧪</span>
                Testing Approach
              </h4>
              <p className="text-blue-700 text-sm">{item.testing_approach}</p>
            </div>

            {/* Relevant Chunks */}
            {item.relevantChunks && item.relevantChunks.length > 0 && (
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                  <span className="mr-2">🖼️</span>
                  Relevant Examples ({item.relevantChunks.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {item.relevantChunks.map((chunk, chunkIndex) => (
                    <div key={chunkIndex} className="bg-white p-3 rounded border">
                      {chunk.imageUrl && (
                        <img 
                          src={chunk.imageUrl.startsWith('http') ? chunk.imageUrl : `${process.env.NEXT_PUBLIC_IMAGE_PATH_URL}${chunk.imageUrl}`}
                          alt={chunk.useCases || 'Example'}
                          className="w-full h-24 object-cover rounded mb-2"
                        />
                      )}
                      {chunk.useCases && (
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {chunk.useCases.substring(0, 80)}...
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-200">
              <button className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                📋 Copy Details
              </button>
              <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                🚀 Implement Solution
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{analysisData.length}</div>
            <div className="text-sm text-gray-600">Total Issues</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {analysisData.filter(item => item.category === 'high_impact').length}
            </div>
            <div className="text-sm text-gray-600">High Impact</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {analysisData.filter(item => item.implementation_complexity === 'low').length}
            </div>
            <div className="text-sm text-gray-600">Low Complexity</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {analysisData.filter(item => item.relevantChunks && item.relevantChunks.length > 0).length}
            </div>
            <div className="text-sm text-gray-600">With Examples</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDisplay; 