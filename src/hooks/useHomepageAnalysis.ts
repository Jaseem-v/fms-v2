import { useState } from 'react';
import { stepwiseAnalysisService } from '../services/stepwiseAnalysisService';
import { initialHomeReport } from '@/utils/rawData';
import AnalyticsService from '@/services/analyticsService';

export interface PagewiseAnalysisResult {
  screenshotPath: string;
  imageAnalysis: string;
  checklistAnalysis: Array<{
    checklistItem: string;
    status: string;
    reason: string;
    problemName?: string;
    problem?: string;
    solution?: string;
    image_reference?: string;
    imageReferenceObject?: any;
    app_reference?: any;
    appReferenceObject?: any;
  }>;
  slug?: string;
}

export const usePagewiseAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PagewiseAnalysisResult | null>(null);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [steps, setSteps] = useState<Array<{name: string, completed: boolean, error?: string}>>([
    { name: 'validate_shopify', completed: false },
    { name: 'take_screenshot', completed: false },
    { name: 'analyze_gemini', completed: false },
    { name: 'analyze_checklist', completed: false },
    { name: 'store_analysis', completed: false },
  ]);
  const [chunkProgress, setChunkProgress] = useState<{
    currentChunk: number;
    totalChunks: number;
    chunkResults: any[];
    isComplete: boolean;
  } | null>(null);

  const analyzePage = async (url: string, pageType: string = 'homepage', requireAuth: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      setCurrentStep(null);
      setChunkProgress(null);
      setSteps([
        { name: 'validate_shopify', completed: false },
        { name: 'take_screenshot', completed: false },
        { name: 'analyze_gemini', completed: false },
        { name: 'analyze_checklist', completed: false },
        { name: 'store_analysis', completed: false },
      ]);
      
      // Starting stepwise analysis
      
      // Use the new stepwise analysis service
      const analysisResult = await stepwiseAnalysisService.sequentialAnalysis(
        url, 
        pageType,
        (step, completed, data) => {
          // Step progress update
          
          // Handle chunked progress updates for product pages
          if (step.startsWith('analyze_checklist_chunk_') && data) {
            setChunkProgress({
              currentChunk: data.chunkNumber,
              totalChunks: data.totalChunks,
              chunkResults: data.chunkResults || [],
              isComplete: data.isComplete || false
            });
            
            // Update the main checklist step when all chunks are complete
            if (data.isComplete) {
              setSteps(prev => prev.map(s => 
                s.name === 'analyze_checklist' ? { ...s, completed: true, error: undefined } : s
              ));
            }
          } else {
            setCurrentStep(step);
            setSteps(prev => prev.map(s => 
              s.name === step ? { ...s, completed, error: undefined } : s
            ));
          }
        }
      );
      
      // Analysis result data received
      
      setResult(analysisResult.data);
      setCurrentStep(null);
      setChunkProgress(null);
      
      // Note: Audit completion is tracked by the main analysis flow, not here
      // to avoid duplicate tracking when used as part of stepwise analysis
      
      // Analysis completed successfully
      return analysisResult.data;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during analysis';
      setError(errorMessage);
      setCurrentStep(null);
      setChunkProgress(null);
      console.error('[HOMEPAGE ANALYSIS] Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setResult(null);
    setCurrentStep(null);
    setChunkProgress(null);
    setSteps([
      { name: 'validate_shopify', completed: false },
      { name: 'take_screenshot', completed: false },
      { name: 'analyze_gemini', completed: false },
      { name: 'analyze_checklist', completed: false },
      { name: 'store_analysis', completed: false },
    ]);
  };

  return {
    loading,
    error,
    result,
    currentStep,
    steps,
    chunkProgress,
    analyzePage,
    reset
  };
};
