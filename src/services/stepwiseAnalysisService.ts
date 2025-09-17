/**
 * Stepwise Analysis Service
 * 
 * This service provides methods to call the new stepwise analysis APIs.
 * Each step can be called independently, allowing for better error handling
 * and progress tracking in the frontend.
 */

interface StepwiseAnalysisResponse {
  success: boolean;
  message: string;
  data: any;
}

interface ValidateShopifyResponse extends StepwiseAnalysisResponse {
  data: {
    step: 'validate_shopify';
    isShopify: boolean;
    storeInfo?: {
      url: string;
      domain: string;
      hasBrowserInstance: boolean;
    };
    error?: string;
  };
}

interface TakeScreenshotResponse extends StepwiseAnalysisResponse {
  data: {
    step: 'take_screenshot';
    screenshotPath: string;
    pageType: string;
    url: string;
    error?: string;
  };
}

interface AnalyzeGeminiResponse extends StepwiseAnalysisResponse {
  data: {
    step: 'analyze_gemini';
    imageAnalysis: string;
    screenshotPath: string;
    error?: string;
  };
}

interface AnalyzeChecklistResponse extends StepwiseAnalysisResponse {
  data: {
    step: 'analyze_checklist';
    checklistAnalysis: Array<{
      checklistItem: string;
      status: string;
      reason: string;
      problemName?: string;
      problem?: string;
      solution?: string;
      image_reference?: string;
      app_reference?: string;
    }>;
    pageType: string;
    itemCount: number;
    error?: string;
  };
}

interface CompleteAnalysisResponse extends StepwiseAnalysisResponse {
  data: {
    screenshotPath: string;
    imageAnalysis: string;
    checklistAnalysis: any[];
    slug: string;
    steps: {
      validate_shopify: { completed: boolean };
      take_screenshot: { completed: boolean; screenshotPath: string };
      analyze_gemini: { completed: boolean };
      analyze_checklist: { completed: boolean; itemCount: number };
    };
  };
}

class StepwiseAnalysisService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://server.fixmystore.com/api';
  }

  /**
   * Step 1: Validate Shopify Store
   * 
   * Validates if the provided URL is a valid Shopify store.
   * 
   * @param url - The URL to validate
   * @returns Promise<ValidateShopifyResponse>
   */
  async validateShopify(url: string): Promise<ValidateShopifyResponse> {
    try {
      console.log(`[STEPWISE ANALYSIS] Step 1: Validating Shopify store: ${url}`);

      const response = await fetch(`${this.baseUrl}/stepwise-analysis/validate-shopify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to validate Shopify store');
      }

      console.log(`[STEPWISE ANALYSIS] Step 1: ✅ Validation completed`);
      return data;

    } catch (error) {
      console.error('[STEPWISE ANALYSIS] Step 1: Error validating Shopify store:', error);
      throw error;
    }
  }

  /**
   * Step 2: Take Screenshot
   * 
   * Takes a screenshot of the provided URL.
   * 
   * @param url - The URL to screenshot
   * @param pageType - The type of page (homepage, product, cart, etc.)
   * @returns Promise<TakeScreenshotResponse>
   */
  async takeScreenshot(url: string, pageType: string = 'homepage'): Promise<TakeScreenshotResponse> {
    try {
      console.log(`[STEPWISE ANALYSIS] Step 2: Taking screenshot: ${url} (${pageType})`);

      const response = await fetch(`${this.baseUrl}/stepwise-analysis/take-screenshot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, pageType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to take screenshot');
      }

      console.log(`[STEPWISE ANALYSIS] Step 2: ✅ Screenshot taken: ${data.data.screenshotPath}`);
      return data;

    } catch (error) {
      console.error('[STEPWISE ANALYSIS] Step 2: Error taking screenshot:', error);
      throw error;
    }
  }

  /**
   * Step 3: Analyze with Gemini
   * 
   * Analyzes the provided screenshot using Gemini AI.
   * 
   * @param screenshotPath - The path to the screenshot file
   * @returns Promise<AnalyzeGeminiResponse>
   */
  async analyzeWithGemini(screenshotPath: string): Promise<AnalyzeGeminiResponse> {
    try {
      console.log(`[STEPWISE ANALYSIS] Step 3: Analyzing with Gemini: ${screenshotPath}`);

      const response = await fetch(`${this.baseUrl}/stepwise-analysis/analyze-gemini`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ screenshotPath }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to analyze with Gemini');
      }

      console.log(`[STEPWISE ANALYSIS] Step 3: ✅ Gemini analysis completed`);
      return data;

    } catch (error) {
      console.error('[STEPWISE ANALYSIS] Step 3: Error in Gemini analysis:', error);
      throw error;
    }
  }

  /**
   * Step 4: Analyze with Checklist
   * 
   * Analyzes the Gemini analysis results against the CRO checklist.
   * 
   * @param imageAnalysis - The image analysis from Gemini
   * @param pageType - The type of page being analyzed
   * @returns Promise<AnalyzeChecklistResponse>
   */
  async analyzeWithChecklist(imageAnalysis: string, pageType: string = 'homepage'): Promise<AnalyzeChecklistResponse> {
    try {
      console.log(`[STEPWISE ANALYSIS] Step 4: Analyzing with checklist for page type: ${pageType}`);

      const response = await fetch(`${this.baseUrl}/stepwise-analysis/analyze-checklist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageAnalysis, pageType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to analyze with checklist');
      }

      console.log(`[STEPWISE ANALYSIS] Step 4: ✅ Checklist analysis completed with ${data.data.itemCount} items`);
      return data;

    } catch (error) {
      console.error('[STEPWISE ANALYSIS] Step 4: Error in checklist analysis:', error);
      throw error;
    }
  }

  /**
   * Complete Analysis (All Steps Combined)
   * 
   * Performs all 4 steps in sequence and returns the complete analysis result.
   * This is equivalent to the original analyzePage endpoint but uses the stepwise approach.
   * 
   * @param url - The URL to analyze
   * @param pageType - The type of page being analyzed
   * @returns Promise<CompleteAnalysisResponse>
   */
  async completeAnalysis(url: string, pageType: string = 'homepage'): Promise<CompleteAnalysisResponse> {
    try {
      console.log(`[STEPWISE ANALYSIS] Complete analysis for: ${url} (${pageType})`);

      const response = await fetch(`${this.baseUrl}/stepwise-analysis/complete-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, pageType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to complete analysis');
      }

      console.log(`[STEPWISE ANALYSIS] ✅ Complete analysis finished successfully`);
      return data;

    } catch (error) {
      console.error('[STEPWISE ANALYSIS] Error in complete analysis:', error);
      throw error;
    }
  }

  /**
   * Sequential Stepwise Analysis
   * 
   * Performs all 4 steps sequentially with individual error handling and progress tracking.
   * This allows for better user experience with progress indicators and step-by-step error handling.
   * 
   * @param url - The URL to analyze
   * @param pageType - The type of page being analyzed
   * @param onProgress - Optional callback for progress updates
   * @returns Promise<CompleteAnalysisResponse>
   */
  async sequentialAnalysis(
    url: string, 
    pageType: string = 'homepage',
    onProgress?: (step: string, completed: boolean, data?: any) => void
  ): Promise<CompleteAnalysisResponse> {
    try {
      console.log(`[STEPWISE ANALYSIS] Starting sequential analysis for: ${url} (${pageType})`);

      // Step 1: Validate Shopify
      onProgress?.('validate_shopify', false);
      const validateResult = await this.validateShopify(url);
      onProgress?.('validate_shopify', true, validateResult.data);

      if (!validateResult.data.isShopify) {
        throw new Error(validateResult.data.error || 'Invalid Shopify store');
      }

      // Step 2: Take Screenshot
      onProgress?.('take_screenshot', false);
      const screenshotResult = await this.takeScreenshot(url, pageType);
      onProgress?.('take_screenshot', true, screenshotResult.data);

      // Step 3: Analyze with Gemini
      onProgress?.('analyze_gemini', false);
      const geminiResult = await this.analyzeWithGemini(screenshotResult.data.screenshotPath);
      onProgress?.('analyze_gemini', true, geminiResult.data);

      // Step 4: Analyze with Checklist
      onProgress?.('analyze_checklist', false);
      const checklistResult = await this.analyzeWithChecklist(geminiResult.data.imageAnalysis, pageType);
      onProgress?.('analyze_checklist', true, checklistResult.data);

      // Combine results
      const completeResult: CompleteAnalysisResponse = {
        success: true,
        message: 'Sequential analysis completed successfully',
        data: {
          screenshotPath: screenshotResult.data.screenshotPath,
          imageAnalysis: geminiResult.data.imageAnalysis,
          checklistAnalysis: checklistResult.data.checklistAnalysis,
          slug: '', // This would need to be generated by the backend
          steps: {
            validate_shopify: { completed: true },
            take_screenshot: { completed: true, screenshotPath: screenshotResult.data.screenshotPath },
            analyze_gemini: { completed: true },
            analyze_checklist: { completed: true, itemCount: checklistResult.data.itemCount }
          }
        }
      };

      console.log(`[STEPWISE ANALYSIS] ✅ Sequential analysis completed successfully`);
      return completeResult;

    } catch (error) {
      console.error('[STEPWISE ANALYSIS] Error in sequential analysis:', error);
      throw error;
    }
  }
}

export const stepwiseAnalysisService = new StepwiseAnalysisService();
export default stepwiseAnalysisService;
