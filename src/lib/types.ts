/**
 * Type definitions for the Shopify App Detector
 */

export interface DetectedApp {
  name: string;
  confidence: number;
}

export interface AppCategory {
  categoryId: string;
  categoryName: string;
  categoryUrl: string;
  rank: number;
  pageNumber: number;
  scrapedAt: string;
}

export interface App {
  _id: string;
  appName: string;
  appUrl: string;
  shopifyUrl: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  reviewChange?: string;
  categories: AppCategory[];
  totalCategories: number;
  scrapedAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DetectedAppWithDetails {
  app: App | null;
  confidence: number;
  detectedAppName: string; // Original detected app name from AI
}

export interface ShopifyTheme {
  name: string;
  version: string;
  id: number;
}

export interface DetectionResult {
  storeUrl: string;
  isShopifyStore: boolean;
  detectedApps: DetectedAppWithDetails[];
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
  success: boolean;
  result?: T;
  message?: string;
  error?: string;
}

export interface ApiListResponse<T> {
  success: boolean;
  results?: T[];
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DetectionStartResponse {
  sessionId: string;
  step: string;
  message: string;
  storeInfo: ShopifyStoreInfo;
  nextStep: string;
}

export interface DetectionExtractAnalyzeResponse {
  sessionId: string;
  step: string;
  message: string;
  detectedApps: DetectedAppWithDetails[];
  appsFound: number;
  nextStep: string;
}

export interface DetectionSearchResponse {
  sessionId: string;
  step: string;
  message: string;
  detectedApps: DetectedAppWithDetails[];
  appsWithDetails: number;
  nextStep: string;
}

export interface DetectionFinalizeResponse {
  sessionId: string;
  step: string;
  message: string;
  detectionResult: DetectionResult;
  appsWithDetails: number;
  isComplete: boolean;
}
