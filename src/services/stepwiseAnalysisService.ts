/**
 * Stepwise Analysis Service
 * 
 * This service provides methods to call the new stepwise analysis APIs.
 * Each step can be called independently, allowing for better error handling
 * and progress tracking in the frontend.
 */

import AnalyticsService from './analyticsService';

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
    isChunked?: boolean;
    totalChunks?: number;
    error?: string;
  };
}

// Alias for chunked analysis
type ChecklistAnalysisResponse = AnalyzeChecklistResponse;

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
      // Step 1: Validating Shopify store

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

      // Step 1: Validation completed
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
      // Step 2: Taking screenshot

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

      // Step 2: Screenshot taken
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
      // Step 3: Analyzing with Gemini

      const response = await fetch(`${this.baseUrl}/stepwise-analysis/analyze-gemini`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ screenshotPath }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to analyze');
      }

      // Step 3: Gemini analysis completed
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
  async analyzeWithChecklist(imageAnalysis: string, pageType: string = 'homepage', category?: string): Promise<AnalyzeChecklistResponse> {
    try {
      // Step 4: Analyzing with checklist

      const response = await fetch(`${this.baseUrl}/stepwise-analysis/analyze-checklist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageAnalysis, pageType, category }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to analyze');
      }

      // Step 4: Checklist analysis completed
      return data;

    } catch (error) {
      console.error('[STEPWISE ANALYSIS] Step 4: Error in checklist analysis:', error);
      throw error;
    }
  }

  /**
   * Sequential Stepwise Analysis up to Gemini
   * 
   * Performs steps 1-3 (validate, screenshot, gemini) and stops.
   * Used when we need to pause for industry selection.
   * 
   * @param url - The URL to analyze
   * @param pageType - The type of page being analyzed
   * @param onProgress - Optional callback for progress updates
   * @returns Promise<CompleteAnalysisResponse>
   */
  async sequentialAnalysisUpToGemini(
    url: string, 
    pageType: string = 'homepage',
    onProgress?: (step: string, completed: boolean, data?: any) => void
  ): Promise<CompleteAnalysisResponse> {
    try {
      // Starting sequential analysis up to Gemini

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
      
      // console.log('[STEPWISE ANALYSIS] Gemini analysis completed, stopping here for industry selection');

      // Return partial result (up to Gemini)
      return {
        success: true,
        message: 'Analysis completed up to Gemini step',
        data: {
          screenshotPath: screenshotResult.data.screenshotPath,
          imageAnalysis: geminiResult.data.imageAnalysis,
          checklistAnalysis: [], // Empty for now
          slug: '', // Will be generated later
          steps: {
            validate_shopify: { completed: true },
            take_screenshot: { completed: true, screenshotPath: screenshotResult.data.screenshotPath },
            analyze_gemini: { completed: true },
            analyze_checklist: { completed: false, itemCount: 0 }
          }
        }
      };

    } catch (error) {
      console.error('[STEPWISE ANALYSIS] Error in analysis up to Gemini:', error);
      throw error;
    }
  }

  /**
   * Continue Analysis from Checklist Step
   * 
   * Continues analysis from the checklist step with the selected category.
   * Used after industry selection to complete the remaining analysis steps.
   * 
   * @param imageAnalysis - The image analysis from Gemini
   * @param pageType - The type of page being analyzed
   * @param category - The selected industry category
   * @param onProgress - Optional callback for progress updates
   * @param url - The original URL being analyzed
   * @param screenshotPath - The path to the screenshot
   * @returns Promise<CompleteAnalysisResponse>
   */
  async continueAnalysisFromChecklist(
    imageAnalysis: string,
    pageType: string = 'homepage',
    category: string,
    onProgress?: (step: string, completed: boolean, data?: any) => void,
    url?: string,
    screenshotPath?: string
  ): Promise<CompleteAnalysisResponse> {
    try {
      // Step 4: Analyze with Checklist
      onProgress?.('analyze_checklist', false);
      
      let checklistAnalysis: any[] = [];
      let totalItemCount = 0;

      if (pageType === 'product') {
        // Use chunked analysis for product pages
        const chunkedResult = await this.analyzeWithChecklistChunked(imageAnalysis, pageType, onProgress, category);
        checklistAnalysis = chunkedResult.data.checklistAnalysis;
        totalItemCount = chunkedResult.data.itemCount;
      } else {
        // Use regular analysis for other page types
        const checklistResult = await this.analyzeWithChecklist(imageAnalysis, pageType, category);
        checklistAnalysis = checklistResult.data.checklistAnalysis;
        totalItemCount = checklistResult.data.itemCount;
      }
      
      onProgress?.('analyze_checklist', true, { checklistAnalysis, itemCount: totalItemCount });

      // Step 5: Store Analysis and Generate Slug
      onProgress?.('store_analysis', false);
      const storeResult = await this.storeAnalysisAndGenerateSlug({
        url: url || '', // Use provided URL or empty string
        pageType,
        screenshotPath: screenshotPath || '', // Use provided screenshot path or empty string
        imageAnalysis,
        checklistAnalysis
      });
      onProgress?.('store_analysis', true, { slug: storeResult.data.slug });

      // Return complete analysis result
      return {
        success: true,
        message: 'Analysis completed successfully',
        data: {
          screenshotPath: screenshotPath || '', // Use provided screenshot path or empty string
          imageAnalysis,
          checklistAnalysis,
          slug: storeResult.data.slug,
          steps: {
            validate_shopify: { completed: true },
            take_screenshot: { completed: true, screenshotPath: screenshotPath || '' },
            analyze_gemini: { completed: true },
            analyze_checklist: { completed: true, itemCount: totalItemCount }
          }
        }
      };

    } catch (error) {
      console.error('[STEPWISE ANALYSIS] Error in continued analysis:', error);
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
    onProgress?: (step: string, completed: boolean, data?: any) => void,
    category?: string
  ): Promise<CompleteAnalysisResponse> {
    try {
      // Starting sequential analysis

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
      
      let checklistAnalysis: any[] = [];
      let totalItemCount = 0;

      if (pageType === 'product') {
        // Use chunked analysis for product pages
        const chunkedResult = await this.analyzeWithChecklistChunked(geminiResult.data.imageAnalysis, pageType, onProgress, category);
        checklistAnalysis = chunkedResult.data.checklistAnalysis;
        totalItemCount = chunkedResult.data.itemCount;
      } else {
        // Use regular analysis for other page types
        const checklistResult = await this.analyzeWithChecklist(geminiResult.data.imageAnalysis, pageType, category);
        checklistAnalysis = checklistResult.data.checklistAnalysis;
        totalItemCount = checklistResult.data.itemCount;
      }
      
      onProgress?.('analyze_checklist', true, { checklistAnalysis, itemCount: totalItemCount });

      // Step 5: Store analysis and generate slug
      onProgress?.('store_analysis', false);
      const storeResult = await this.storeAnalysisAndGenerateSlug({
        url,
        pageType,
        screenshotPath: screenshotResult.data.screenshotPath,
        imageAnalysis: geminiResult.data.imageAnalysis,
        checklistAnalysis
      });
      onProgress?.('store_analysis', true, storeResult.data);

      // Combine results
      const completeResult: CompleteAnalysisResponse = {
        success: true,
        message: 'Sequential analysis completed successfully',
        data: {
          screenshotPath: screenshotResult.data.screenshotPath,
          imageAnalysis: geminiResult.data.imageAnalysis,
          checklistAnalysis,
          slug: storeResult.data.slug,
          steps: {
            validate_shopify: { completed: true },
            take_screenshot: { completed: true, screenshotPath: screenshotResult.data.screenshotPath },
            analyze_gemini: { completed: true },
            analyze_checklist: { completed: true, itemCount: totalItemCount }
          }
        }
      };

      // Track audit completion
      try {
        AnalyticsService.trackAuditCompleted(
          storeResult.data.slug || 'unknown',
          url,
          AnalyticsService.extractWebsiteName(url),
        );
        // Audit completion tracked
      } catch (trackingError) {
        console.error('[STEPWISE ANALYSIS] Error tracking audit completion:', trackingError);
        // Don't throw error to avoid breaking the analysis flow
      }

      // Sequential analysis completed successfully
      return completeResult;

    } catch (error) {
      console.error('[STEPWISE ANALYSIS] Error in sequential analysis:', error);
      throw error;
    }
  }

  /**
   * Chunked Checklist Analysis for Product Pages
   * 
   * Analyzes product pages using chunked approach, processing each chunk individually
   * and providing progress updates after each chunk completion.
   * 
   * @param imageAnalysis - The image analysis from Gemini
   * @param pageType - The type of page (should be 'product')
   * @param onProgress - Optional callback for progress updates
   * @returns Promise<ChecklistAnalysisResponse>
   */
  async analyzeWithChecklistChunked(
    imageAnalysis: string, 
    pageType: string = 'product',
    onProgress?: (step: string, completed: boolean, data?: any) => void,
    category?: string
  ): Promise<ChecklistAnalysisResponse> {
    try {
      console.log(`[STEPWISE ANALYSIS] Starting chunked checklist analysis for ${pageType} page`);

      const allChunkResults: any[] = [];
      let totalItemCount = 0;

      // Process each chunk (1-4) sequentially
      for (let chunkNumber = 1; chunkNumber <= 4; chunkNumber++) {
        // Processing chunk
        
        try {
          const chunkResult = await this.analyzeChecklistChunk(imageAnalysis, pageType, chunkNumber, category);
          
          if (chunkResult.success && chunkResult.data.checklistAnalysis) {
            allChunkResults.push(...chunkResult.data.checklistAnalysis);
            totalItemCount += chunkResult.data.itemCount;
            
            // Notify progress for this chunk
            onProgress?.(`analyze_checklist_chunk_${chunkNumber}`, true, {
              chunkNumber,
              totalChunks: 4,
              chunkResults: chunkResult.data.checklistAnalysis,
              itemCount: chunkResult.data.itemCount,
              isComplete: chunkNumber === 4
            });
            
            // Chunk completed
          } else {
            // Chunk failed
          }
        } catch (chunkError) {
          console.error(`[STEPWISE ANALYSIS] Error in chunk ${chunkNumber}:`, chunkError);
          // Continue with next chunk instead of failing completely
        }
      }

      // Chunked analysis completed

      return {
        success: true,
        message: 'Chunked checklist analysis completed successfully',
        data: {
          step: 'analyze_checklist',
          checklistAnalysis: allChunkResults,
          pageType,
          itemCount: totalItemCount,
          isChunked: true,
          totalChunks: 4
        }
      };

    } catch (error) {
      console.error('[STEPWISE ANALYSIS] Error in chunked checklist analysis:', error);
      throw error;
    }
  }

  /**
   * Store Analysis and Generate Slug
   * 
   * Stores the analysis results in the database and generates a slug for the report.
   * This is the final step that makes the analysis accessible via the report page.
   * 
   * @param analysisData - The complete analysis data to store
   * @returns Promise<{success: boolean, data: {slug: string}}>
   */
  private async storeAnalysisAndGenerateSlug(analysisData: {
    url: string;
    pageType: string;
    screenshotPath: string;
    imageAnalysis: string;
    checklistAnalysis: any[];
  }): Promise<{success: boolean, data: {slug: string}}> {
    try {
      // Storing analysis and generating slug

      const response = await fetch(`${this.baseUrl}/stepwise-analysis/store-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analysisData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      // Analysis stored with slug
      return result;

    } catch (error) {
      console.error('[STEPWISE ANALYSIS] Error storing analysis:', error);
      throw error;
    }
  }

  /**
   * Analyze a specific chunk of the checklist
   * 
   * @param imageAnalysis - The image analysis from Gemini
   * @param pageType - The type of page
   * @param chunkNumber - The chunk number (1-4)
   * @returns Promise<ChecklistAnalysisResponse>
   */
  private async analyzeChecklistChunk(
    imageAnalysis: string, 
    pageType: string, 
    chunkNumber: number,
    category?: string
  ): Promise<ChecklistAnalysisResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/stepwise-analysis/analyze-checklist-chunked`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageAnalysis,
          pageType,
          chunkNumber,
          category
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;

    } catch (error) {
      console.error(`[STEPWISE ANALYSIS] Error analyzing chunk ${chunkNumber}:`, error);
      throw error;
    }
  }
}

export const stepwiseAnalysisService = new StepwiseAnalysisService();
export default stepwiseAnalysisService;
