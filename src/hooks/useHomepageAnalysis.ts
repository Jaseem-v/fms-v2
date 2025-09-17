import { useState } from 'react';
import pagewiseAnalysisService from '../services/homepageAnalysisService';
import { stepwiseAnalysisService } from '../services/stepwiseAnalysisService';
import { initialHomeReport } from '@/utils/rawData';

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
  ]);

  const analyzePage = async (url: string, pageType: string = 'homepage', requireAuth: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      setCurrentStep(null);
      setSteps([
        { name: 'validate_shopify', completed: false },
        { name: 'take_screenshot', completed: false },
        { name: 'analyze_gemini', completed: false },
        { name: 'analyze_checklist', completed: false },
      ]);
      
      console.log(`[HOMEPAGE ANALYSIS] Starting stepwise analysis for: ${url} (${pageType})`);
      
      // Use the new stepwise analysis service
      const analysisResult = await stepwiseAnalysisService.sequentialAnalysis(
        url, 
        pageType,
        (step, completed, data) => {
          console.log(`[HOMEPAGE ANALYSIS] Step ${step}: ${completed ? 'completed' : 'in progress'}`);
          setCurrentStep(step);
          setSteps(prev => prev.map(s => 
            s.name === step ? { ...s, completed, error: undefined } : s
          ));
        }
      );
      
      setResult(analysisResult.data);
      setCurrentStep(null);
      
      console.log(`[HOMEPAGE ANALYSIS] ✅ Analysis completed successfully`);
      return analysisResult.data;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during analysis';
      setError(errorMessage);
      setCurrentStep(null);
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
    setSteps([
      { name: 'validate_shopify', completed: false },
      { name: 'take_screenshot', completed: false },
      { name: 'analyze_gemini', completed: false },
      { name: 'analyze_checklist', completed: false },
    ]);
  };

  return {
    loading,
    error,
    result,
    currentStep,
    steps,
    analyzePage,
    reset
  };
};
