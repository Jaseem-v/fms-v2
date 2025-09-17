import { useState, useCallback } from 'react';
import { stepwiseAnalysisService } from '../services/stepwiseAnalysisService';

interface AnalysisStep {
  name: string;
  completed: boolean;
  error?: string;
  data?: any;
}

interface UseStepwiseAnalysisReturn {
  // State
  isAnalyzing: boolean;
  currentStep: string | null;
  steps: AnalysisStep[];
  result: any | null;
  error: string | null;

  // Actions
  startAnalysis: (url: string, pageType?: string) => Promise<void>;
  startSequentialAnalysis: (url: string, pageType?: string) => Promise<void>;
  reset: () => void;

  // Individual step methods
  validateShopify: (url: string) => Promise<void>;
  takeScreenshot: (url: string, pageType?: string) => Promise<void>;
  analyzeWithGemini: (screenshotPath: string) => Promise<void>;
  analyzeWithChecklist: (imageAnalysis: string, pageType?: string) => Promise<void>;
}

/**
 * Custom hook for stepwise analysis
 * 
 * Provides state management and methods for the stepwise analysis process.
 * Each step can be called individually or all steps can be run sequentially.
 */
export const useStepwiseAnalysis = (): UseStepwiseAnalysisReturn => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [steps, setSteps] = useState<AnalysisStep[]>([
    { name: 'validate_shopify', completed: false },
    { name: 'take_screenshot', completed: false },
    { name: 'analyze_gemini', completed: false },
    { name: 'analyze_checklist', completed: false },
  ]);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Reset all state to initial values
   */
  const reset = useCallback(() => {
    setIsAnalyzing(false);
    setCurrentStep(null);
    setSteps([
      { name: 'validate_shopify', completed: false },
      { name: 'take_screenshot', completed: false },
      { name: 'analyze_gemini', completed: false },
      { name: 'analyze_checklist', completed: false },
    ]);
    setResult(null);
    setError(null);
  }, []);

  /**
   * Update step status
   */
  const updateStep = useCallback((stepName: string, completed: boolean, error?: string, data?: any) => {
    setSteps(prev => prev.map(step => 
      step.name === stepName 
        ? { ...step, completed, error, data }
        : step
    ));
  }, []);

  /**
   * Start complete analysis (all steps in one API call)
   */
  const startAnalysis = useCallback(async (url: string, pageType: string = 'homepage') => {
    try {
      setIsAnalyzing(true);
      setCurrentStep('complete_analysis');
      setError(null);
      setResult(null);

      console.log(`[STEPWISE ANALYSIS HOOK] Starting complete analysis for: ${url} (${pageType})`);

      const result = await stepwiseAnalysisService.completeAnalysis(url, pageType);

      // Update all steps as completed
      setSteps(prev => prev.map(step => ({ ...step, completed: true })));
      setResult(result.data);
      setCurrentStep(null);

      console.log(`[STEPWISE ANALYSIS HOOK] ✅ Complete analysis finished`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setCurrentStep(null);
      console.error('[STEPWISE ANALYSIS HOOK] Error in complete analysis:', err);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  /**
   * Start sequential analysis (step by step)
   */
  const startSequentialAnalysis = useCallback(async (url: string, pageType: string = 'homepage') => {
    try {
      setIsAnalyzing(true);
      setError(null);
      setResult(null);
      reset(); // Reset steps

      console.log(`[STEPWISE ANALYSIS HOOK] Starting sequential analysis for: ${url} (${pageType})`);

      const result = await stepwiseAnalysisService.sequentialAnalysis(
        url, 
        pageType,
        (step, completed, data) => {
          setCurrentStep(step);
          updateStep(step, completed, undefined, data);
        }
      );

      setResult(result.data);
      setCurrentStep(null);

      console.log(`[STEPWISE ANALYSIS HOOK] ✅ Sequential analysis finished`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setCurrentStep(null);
      console.error('[STEPWISE ANALYSIS HOOK] Error in sequential analysis:', err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [updateStep, reset]);

  /**
   * Step 1: Validate Shopify store
   */
  const validateShopify = useCallback(async (url: string) => {
    try {
      setIsAnalyzing(true);
      setCurrentStep('validate_shopify');
      setError(null);

      console.log(`[STEPWISE ANALYSIS HOOK] Step 1: Validating Shopify store: ${url}`);

      const result = await stepwiseAnalysisService.validateShopify(url);
      
      updateStep('validate_shopify', true, undefined, result.data);
      setCurrentStep(null);

      if (!result.data.isShopify) {
        throw new Error(result.data.error || 'Invalid Shopify store');
      }

      console.log(`[STEPWISE ANALYSIS HOOK] Step 1: ✅ Validation completed`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      updateStep('validate_shopify', false, errorMessage);
      setError(errorMessage);
      setCurrentStep(null);
      console.error('[STEPWISE ANALYSIS HOOK] Step 1: Error validating Shopify store:', err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [updateStep]);

  /**
   * Step 2: Take screenshot
   */
  const takeScreenshot = useCallback(async (url: string, pageType: string = 'homepage') => {
    try {
      setIsAnalyzing(true);
      setCurrentStep('take_screenshot');
      setError(null);

      console.log(`[STEPWISE ANALYSIS HOOK] Step 2: Taking screenshot: ${url} (${pageType})`);

      const result = await stepwiseAnalysisService.takeScreenshot(url, pageType);
      
      updateStep('take_screenshot', true, undefined, result.data);
      setCurrentStep(null);

      console.log(`[STEPWISE ANALYSIS HOOK] Step 2: ✅ Screenshot taken: ${result.data.screenshotPath}`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      updateStep('take_screenshot', false, errorMessage);
      setError(errorMessage);
      setCurrentStep(null);
      console.error('[STEPWISE ANALYSIS HOOK] Step 2: Error taking screenshot:', err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [updateStep]);

  /**
   * Step 3: Analyze with Gemini
   */
  const analyzeWithGemini = useCallback(async (screenshotPath: string) => {
    try {
      setIsAnalyzing(true);
      setCurrentStep('analyze_gemini');
      setError(null);

      console.log(`[STEPWISE ANALYSIS HOOK] Step 3: Analyzing with Gemini: ${screenshotPath}`);

      const result = await stepwiseAnalysisService.analyzeWithGemini(screenshotPath);
      
      updateStep('analyze_gemini', true, undefined, result.data);
      setCurrentStep(null);

      console.log(`[STEPWISE ANALYSIS HOOK] Step 3: ✅ Gemini analysis completed`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      updateStep('analyze_gemini', false, errorMessage);
      setError(errorMessage);
      setCurrentStep(null);
      console.error('[STEPWISE ANALYSIS HOOK] Step 3: Error in Gemini analysis:', err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [updateStep]);

  /**
   * Step 4: Analyze with checklist
   */
  const analyzeWithChecklist = useCallback(async (imageAnalysis: string, pageType: string = 'homepage') => {
    try {
      setIsAnalyzing(true);
      setCurrentStep('analyze_checklist');
      setError(null);

      console.log(`[STEPWISE ANALYSIS HOOK] Step 4: Analyzing with checklist for page type: ${pageType}`);

      const result = await stepwiseAnalysisService.analyzeWithChecklist(imageAnalysis, pageType);
      
      updateStep('analyze_checklist', true, undefined, result.data);
      setCurrentStep(null);

      console.log(`[STEPWISE ANALYSIS HOOK] Step 4: ✅ Checklist analysis completed with ${result.data.itemCount} items`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      updateStep('analyze_checklist', false, errorMessage);
      setError(errorMessage);
      setCurrentStep(null);
      console.error('[STEPWISE ANALYSIS HOOK] Step 4: Error in checklist analysis:', err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [updateStep]);

  return {
    // State
    isAnalyzing,
    currentStep,
    steps,
    result,
    error,

    // Actions
    startAnalysis,
    startSequentialAnalysis,
    reset,

    // Individual step methods
    validateShopify,
    takeScreenshot,
    analyzeWithGemini,
    analyzeWithChecklist,
  };
};
