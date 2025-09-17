/**
 * API service for communicating with the Shopify App Detector backend
 */

import axios from 'axios';
import { DetectionResult, ShopifyStoreInfo, ApiResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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
