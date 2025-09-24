/**
 * API service for communicating with the Shopify App Detector backend
 */

import axios from 'axios';
import { DetectionResult, ShopifyStoreInfo, ApiResponse, DetectionStartResponse, DetectionExtractAnalyzeResponse, DetectionSearchResponse, DetectionFinalizeResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // Increased to 2 minutes for batch processing
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * API service class for Shopify App Detector
 */
export class ApiService {
  /**
   * Validate if a URL is a Shopify store
   * @param url - The URL to validate
   * @returns Promise<ShopifyStoreInfo> - Validation result
   */
  static async validateShopifyStore(url: string): Promise<ShopifyStoreInfo> {
    try {
      const response = await api.post<ShopifyStoreInfo>('/api/validate-shopify', { url });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response?.data?.message || 'Failed to validate Shopify store');
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * Detect apps in a Shopify store using step-by-step process
   * @param url - The Shopify store URL
   * @param onProgress - Callback for progress updates
   * @returns Promise<DetectionResult> - Detection results
   */
  static async detectAppsStepByStep(url: string, onProgress?: (progress: any) => void): Promise<DetectionResult> {
    try {
      // Step 1: Start detection and validate store
      console.log('Step 1: Starting detection and validating store...');
      if (onProgress) {
        onProgress({ type: 'progress', step: 'validating', message: 'Analyzing your store...' });
      }
      
      const startResponse = await api.post<ApiResponse<DetectionStartResponse>>('/api/detection/start', { url });
      if (!startResponse.data.success) {
        throw new Error(startResponse.data.message || 'Failed to start detection');
      }
      
      const { sessionId, storeInfo } = startResponse.data.result!;
      console.log('Step 1 completed:', startResponse.data.result);

      // Step 2: Extract and analyze content
      console.log('Step 2: Extracting and analyzing content...');
      if (onProgress) {
        onProgress({ type: 'progress', step: 'extracting', message: 'Scanning for apps...' });
      }
      
      const extractAnalyzeResponse = await api.post<ApiResponse<DetectionExtractAnalyzeResponse>>('/api/detection/extract-analyze', { 
        sessionId, 
        storeUrl: storeInfo.url,
        theme: storeInfo.theme
      });
      if (!extractAnalyzeResponse.data.success) {
        throw new Error(extractAnalyzeResponse.data.message || 'Failed to extract and analyze content');
      }
      
      const { detectedApps, appsFound } = extractAnalyzeResponse.data.result!;
      console.log('Step 2 completed:', extractAnalyzeResponse.data.result);
      
      if (onProgress) {
        onProgress({ 
          type: 'progress', 
          step: 'extracting', 
          message: `Found ${appsFound} app${appsFound !== 1 ? 's' : ''}`,
          appsFound 
        });
      }

      // Step 3: Search for app details
      console.log('Step 3: Searching for app details...');
      if (onProgress) {
        onProgress({ type: 'progress', step: 'searching', message: 'Getting app details...' });
      }
      
      const searchResponse = await api.post<ApiResponse<DetectionSearchResponse>>('/api/detection/search', {
        sessionId,
        detectedApps
      });
      if (!searchResponse.data.success) {
        throw new Error(searchResponse.data.message || 'Failed to search app details');
      }
      
      const { detectedApps: enrichedApps, appsWithDetails: appsWithDetailsCount } = searchResponse.data.result!;
      console.log('Step 3 completed:', searchResponse.data.result);

      // Step 4: Finalize detection
      console.log('Step 4: Finalizing detection...');
      if (onProgress) {
        onProgress({ 
          type: 'progress', 
          step: 'finalizing', 
          message: `Found ${appsWithDetailsCount} app${appsWithDetailsCount !== 1 ? 's' : ''}!`,
          appsFound: appsWithDetailsCount 
        });
      }
      
      const finalizeResponse = await api.post<ApiResponse<DetectionFinalizeResponse>>('/api/detection/finalize', {
        sessionId,
        storeUrl: storeInfo.url,
        detectedApps: enrichedApps,
        theme: storeInfo.theme
      });
      if (!finalizeResponse.data.success) {
        throw new Error(finalizeResponse.data.message || 'Failed to finalize detection');
      }
      
      const { detectionResult } = finalizeResponse.data.result!;
      console.log('Step 4 completed:', finalizeResponse.data.result);
      
      if (onProgress) {
        onProgress({ type: 'complete', result: detectionResult });
      }
      
      return detectionResult;
      
    } catch (error: any) {
      console.error('Step-by-step detection error:', error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response?.data?.message || 'Failed to detect apps';
        
        if (status === 503) {
          throw new Error('AI service is unavailable. Please check the API key configuration.');
        }
        
        if (status >= 500) {
          throw new Error(`Server error (${status}): ${message}`);
        }
        
        if (status >= 400) {
          throw new Error(`Client error (${status}): ${message}`);
        }
        
        throw new Error(message);
      }
      
      throw new Error(`Network error: ${error.message}`);
    }
  }

  /**
   * Detect apps in a Shopify store using Gemini AI
   * @param url - The Shopify store URL
   * @returns Promise<DetectionResult> - Detection results
   */
  static async detectApps(url: string): Promise<DetectionResult> {
    try {
      console.log(`Making API request to detect apps for: ${url}`);
      const response = await api.post<DetectionResult>('/api/detect-apps', { url });
      console.log('API response received:', response.status);
      return response.data;
    } catch (error: any) {
      console.error('API Error Details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          timeout: error.config?.timeout
        }
      });
      
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Backend server is not running. Please start the backend service.');
      }
      
      if (error.code === 'ETIMEDOUT') {
        throw new Error('Request timed out. The detection is taking longer than expected. Please try again.');
      }
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response?.data?.message || 'Failed to detect apps';
        
        if (status === 503) {
          throw new Error('Gemini AI service is unavailable. Please check the API key configuration.');
        }
        
        if (status >= 500) {
          throw new Error(`Server error (${status}): ${message}`);
        }
        
        if (status >= 400) {
          throw new Error(`Client error (${status}): ${message}`);
        }
        
        throw new Error(message);
      }
      
      throw new Error(`Network error: ${error.message}`);
    }
  }

  /**
   * Check if the backend service is healthy
   * @returns Promise<boolean> - Health status
   */
  static async checkHealth(): Promise<boolean> {
    try {
      const response = await api.get('/health');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  /**
   * Test backend connection
   * @returns Promise<{message: string, timestamp: string, geminiAvailable: boolean}> - Test result
   */
  static async testConnection(): Promise<{message: string, timestamp: string, geminiAvailable: boolean}> {
    try {
      const response = await api.get('/api/test');
      return response.data as {message: string, timestamp: string, geminiAvailable: boolean};
    } catch (error: any) {
      throw new Error(`Connection test failed: ${error.message}`);
    }
  }

  /**
   * Validate Gemini API key
   * @returns Promise<{valid: boolean, message: string}> - Validation result
   */
  static async validateGemini(): Promise<{valid: boolean, message: string}> {
    try {
      const response = await api.get<{valid: boolean, message: string}>('/api/validate-gemini');
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return {
          valid: false,
          message: error.response?.data?.message || 'Failed to validate Gemini API'
        };
      }
      return {
        valid: false,
        message: 'Network error occurred'
      };
    }
  }

  /**
   * Get detection history (placeholder)
   * @returns Promise<any[]> - Detection history
   */
  static async getHistory(): Promise<any[]> {
    try {
      const response = await api.get('/api/history');
      return (response.data as any).history || [];
    } catch (error) {
      console.error('Error fetching history:', error);
      return [];
    }
  }
}

export default ApiService;
