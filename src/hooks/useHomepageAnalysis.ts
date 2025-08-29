import { useState } from 'react';
import homepageAnalysisService from '../services/homepageAnalysisService';
import { initialHomeReport } from '@/utils/rawData';

export interface HomepageAnalysisResult {
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
}

export const useHomepageAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<HomepageAnalysisResult | null>(null);

  const analyzeHomepage = async (url: string, pageType: string = 'homepage') => {
    try {
      setLoading(true);
      setError(null);
      
      const analysisResult = await homepageAnalysisService.analyzeHomepage(url, pageType);
      setResult(analysisResult);
      
      return analysisResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during analysis';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setResult(null);
  };

  return {
    loading,
    error,
    result,
    analyzeHomepage,
    reset
  };
};
