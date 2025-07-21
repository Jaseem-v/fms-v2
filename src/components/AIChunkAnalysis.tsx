'use client';

import React, { useState, useEffect } from 'react';
import aiChunkService from '../services/aiChunkService';
import AnalysisDisplay from './AnalysisDisplay';

interface AIChunk {
  id: string;
  imageUrl: string;
  useCases: string;
  uploadDate: string;
  fileName: string;
}

interface PageAnalysis {
  problems: string[];
  relevantChunks: AIChunk[];
  suggestions: string[];
}

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
  relevantChunks: AIChunk[];
}

interface ChunkStatistics {
  totalChunks: number;
  categories: Record<string, number>;
  pageTypes: Record<string, number>;
  recentUploads: AIChunk[];
}

const AIChunkAnalysis: React.FC = () => {
  const [pageDescription, setPageDescription] = useState('');
  const [analysis, setAnalysis] = useState<PageAnalysis | null>(null);
  const [structuredAnalysis, setStructuredAnalysis] = useState<AnalysisItem[]>([]);
  const [statistics, setStatistics] = useState<ChunkStatistics | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPageType, setSelectedPageType] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('');
  const [categoryChunks, setCategoryChunks] = useState<AIChunk[]>([]);
  const [pageTypeChunks, setPageTypeChunks] = useState<AIChunk[]>([]);
  const [goalChunks, setGoalChunks] = useState<AIChunk[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const stats = await aiChunkService.getChunksStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  const analyzePage = async () => {
    if (!pageDescription.trim()) return;
    
    setLoading(true);
    try {
      const result = await aiChunkService.analyzePageForProblems(pageDescription);
      setAnalysis(result);
      
      // Convert to structured format for better display
      const structured = result.problems.map((problem, index) => ({
        category: index === 0 ? 'high_impact' : index === 1 ? 'medium_impact' : 'low_impact',
        area: ['trust', 'conversion', 'navigation', 'social_proof', 'pricing', 'cta'][index % 6],
        problem: problem,
        impact_reason: result.suggestions[index] || 'This issue affects user experience and conversion rates.',
        solution: result.suggestions[index] || 'Implement improvements based on best practices.',
        implementation_complexity: ['low', 'medium', 'high'][index % 3],
        estimated_lift: ['5-10%', '8-15%', '10-20%'][index % 3],
        testing_approach: 'A/B test the proposed solution to measure impact on conversion rates.',
        rationale: 'This improvement addresses a key user experience issue that can significantly impact conversions.',
        relevantChunks: result.relevantChunks.slice(index * 2, (index + 1) * 2) || []
      }));
      
      setStructuredAnalysis(structured);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadChunksByCategory = async (category: string) => {
    if (!category) return;
    
    try {
      const chunks = await aiChunkService.getChunksByCategory(category);
      setCategoryChunks(chunks);
    } catch (error) {
      console.error('Failed to load category chunks:', error);
    }
  };

  const loadChunksByPageType = async (pageType: string) => {
    if (!pageType) return;
    
    try {
      const chunks = await aiChunkService.getChunksByPageType(pageType);
      setPageTypeChunks(chunks);
    } catch (error) {
      console.error('Failed to load page type chunks:', error);
    }
  };

  const loadChunksByGoal = async (goal: string) => {
    if (!goal) return;
    
    try {
      const chunks = await aiChunkService.getChunksByConversionGoal(goal);
      setGoalChunks(chunks);
    } catch (error) {
      console.error('Failed to load goal chunks:', error);
    }
  };

  const categories = ['testimonials', 'pricing', 'trust', 'navigation', 'promotions', 'product-display'];
  const pageTypes = ['homepage', 'product', 'category', 'checkout', 'landing'];
  const conversionGoals = ['increase-sales', 'build-trust', 'improve-navigation', 'reduce-cart-abandonment', 'increase-engagement'];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 text-black">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">AI Chunk Analysis Dashboard</h2>
        
        {/* Statistics Overview */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800">Total Chunks</h3>
              <p className="text-2xl font-bold text-blue-600">{statistics.totalChunks}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">Categories</h3>
              <p className="text-2xl font-bold text-green-600">{Object.keys(statistics.categories).length}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800">Page Types</h3>
              <p className="text-2xl font-bold text-purple-600">{Object.keys(statistics.pageTypes).length}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-800">Recent Uploads</h3>
              <p className="text-2xl font-bold text-orange-600">{statistics.recentUploads.length}</p>
            </div>
          </div>
        )}

        {/* Page Analysis Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Page Problem Analysis</h3>
          <div className="space-y-4">
            <textarea
              value={pageDescription}
              onChange={(e) => setPageDescription(e.target.value)}
              placeholder="Describe the page you want to analyze for CRO problems..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none h-32"
            />
            <button
              onClick={analyzePage}
              disabled={loading || !pageDescription.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Analyze Page'}
            </button>
          </div>

          {structuredAnalysis.length > 0 && (
            <div className="mt-6">
              <AnalysisDisplay 
                analysisData={structuredAnalysis} 
                title="Page Analysis Results"
              />
            </div>
          )}
        </div>

        {/* Category Filtering */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Filter by Category</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  loadChunksByCategory(category);
                }}
                className={`px-4 py-2 rounded-lg border ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
          {categoryChunks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryChunks.map((chunk) => (
                <div key={chunk.id} className="bg-gray-50 p-3 rounded border">
                  <img 
                    src={`${process.env.NEXT_PUBLIC_IMAGE_PATH_URL}${chunk.imageUrl}`} 
                    alt={chunk.useCases}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                  <p className="text-sm text-gray-600">{chunk.useCases.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Page Type Filtering */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Filter by Page Type</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {pageTypes.map((pageType) => (
              <button
                key={pageType}
                onClick={() => {
                  setSelectedPageType(pageType);
                  loadChunksByPageType(pageType);
                }}
                className={`px-4 py-2 rounded-lg border ${
                  selectedPageType === pageType
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {pageType.charAt(0).toUpperCase() + pageType.slice(1)}
              </button>
            ))}
          </div>
          {pageTypeChunks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pageTypeChunks.map((chunk) => (
                <div key={chunk.id} className="bg-gray-50 p-3 rounded border">
                  <img 
                    src={`${process.env.NEXT_PUBLIC_IMAGE_PATH_URL}${chunk.imageUrl}`} 
                    alt={chunk.useCases}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                  <p className="text-sm text-gray-600">{chunk.useCases.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Conversion Goal Filtering */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Filter by Conversion Goal</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {conversionGoals.map((goal) => (
              <button
                key={goal}
                onClick={() => {
                  setSelectedGoal(goal);
                  loadChunksByGoal(goal);
                }}
                className={`px-4 py-2 rounded-lg border ${
                  selectedGoal === goal
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {goal.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </button>
            ))}
          </div>
          {goalChunks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {goalChunks.map((chunk) => (
                <div key={chunk.id} className="bg-gray-50 p-3 rounded border">
                  <img 
                    src={`${process.env.NEXT_PUBLIC_IMAGE_PATH_URL}${chunk.imageUrl}`} 
                    alt={chunk.useCases}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                  <p className="text-sm text-gray-600">{chunk.useCases.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIChunkAnalysis; 