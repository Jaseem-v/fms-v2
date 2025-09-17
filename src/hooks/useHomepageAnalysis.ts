import { useState } from 'react';
import pagewiseAnalysisService from '../services/homepageAnalysisService';
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

  const analyzePage = async (url: string, pageType: string = 'homepage', requireAuth: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const analysisResult = await pagewiseAnalysisService.analyzePage(url, pageType, requireAuth);
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
    analyzePage,
    reset
  };
};
