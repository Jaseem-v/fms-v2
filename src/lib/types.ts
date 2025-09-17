/**
 * Type definitions for the Shopify App Detector
 */

export interface DetectedApp {
  name: string;
  confidence: number;
  appStoreLink?: string;
  description?: string;
  evidence: string[];
  category?: string;
}

export interface ShopifyTheme {
  name: string;
  version: string;
  id: number;
}

export interface DetectionResult {
  storeUrl: string;
  isShopifyStore: boolean;
  detectedApps: DetectedApp[];
  theme?: ShopifyTheme;
  scanDate: string;
  error?: string;
  htmlContent?: string;
}

export interface ShopifyStoreInfo {
  url: string;
  isShopify: boolean;
  theme?: ShopifyTheme;
  error?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
