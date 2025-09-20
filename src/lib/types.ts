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
  data?: T;
  error?: string;
  message?: string;
}
