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

  const analyzePage = async (url: string, pageType: string = 'homepage', requireAuth: boolean = false, category?: string) => {
    try {
      setLoading(true);
      setError(null);
      setCurrentStep(null);
      setChunkProgress(null);
      
      // If category is provided and we already have Gemini analysis, continue from checklist
      if (category && result && result.imageAnalysis) {
        // console.log('[HOMEPAGE ANALYSIS] Continuing analysis from checklist with category:', category);
        
        // Keep the existing completed steps and only reset the checklist and store steps
        setSteps(prev => prev.map(s => 
          s.name === 'analyze_checklist' || s.name === 'store_analysis' 
            ? { ...s, completed: false, error: undefined }
            : s
        ));
        
        // Continue analysis from checklist step
        const analysisResult = await stepwiseAnalysisService.continueAnalysisFromChecklist(
          result.imageAnalysis,
          pageType,
          category,
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
          },
          url,
          result.screenshotPath
        );
        
        setResult(analysisResult.data);
        setCurrentStep(null);
        setChunkProgress(null);
        return analysisResult.data;
      } else {
        // Reset all steps for fresh analysis
        setSteps([
          { name: 'validate_shopify', completed: false },
          { name: 'take_screenshot', completed: false },
          { name: 'analyze_gemini', completed: false },
          { name: 'analyze_checklist', completed: false },
          { name: 'store_analysis', completed: false },
        ]);
        
        // Starting stepwise analysis
        
        // If category is provided, run full analysis
        if (category) {
          // console.log('[HOMEPAGE ANALYSIS] Running full analysis with category:', category);
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
            },
            category
          );
          
          setResult(analysisResult.data);
          setCurrentStep(null);
          setChunkProgress(null);
          return analysisResult.data;
        } else {
          // If no category, run only up to Gemini analysis
          // console.log('[HOMEPAGE ANALYSIS] Running analysis up to Gemini (no category provided)');
          const analysisResult = await stepwiseAnalysisService.sequentialAnalysisUpToGemini(
            url, 
            pageType,
            (step, completed, data) => {
              setCurrentStep(step);
              setSteps(prev => prev.map(s => 
                s.name === step ? { ...s, completed, error: undefined } : s
              ));
            }
          );
          
          // console.log('[HOMEPAGE ANALYSIS] Analysis up to Gemini completed:', analysisResult.data);
          setResult(analysisResult.data);
          setCurrentStep(null);
          return analysisResult.data;
        }
      }
      
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
