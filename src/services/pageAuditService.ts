import { config } from '../config/config';

export interface PageAuditData {
  _id: string;
  url: string;
  pageType: string;
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
    app_reference?: string;
    imageReferenceObject?: any;
    appReferenceObject?: any;
  }>;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface PageAuditResponse {
  success: boolean;
  pageAudit?: PageAuditData;
  message?: string;
}

export interface PageAuditsResponse {
  success: boolean;
  pageAudits: PageAuditData[];
  total: number;
  page: number;
  totalPages: number;
}

class PageAuditService {
  private baseUrl = config.backendUrl;

  /**
   * Get page audit by slug
   */
  async getPageAuditBySlug(slug: string): Promise<PageAuditResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/page-audits/slug/${slug}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error getting page audit by slug:', error);
      throw error;
    }
  }

  /**
   * Get page audit by ID
   */
  async getPageAuditById(id: string): Promise<PageAuditResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/page-audits/id/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error getting page audit by ID:', error);
      throw error;
    }
  }

  /**
   * Get all page audits with pagination and filtering
   */
  async getAllPageAudits(
    page: number = 1,
    limit: number = 20,
    pageType?: string,
    search?: string
  ): Promise<PageAuditsResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(pageType && { pageType }),
        ...(search && { search })
      });

      const response = await fetch(`${this.baseUrl}/page-audits?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Transform the response to match the expected interface
      return {
        success: result.success,
        pageAudits: result.pageAudits || [],
        total: result.pagination?.total || 0,
        page: result.pagination?.page || 1,
        totalPages: result.pagination?.totalPages || 0
      };
    } catch (error) {
      console.error('Error getting all page audits:', error);
      throw error;
    }
  }

  /**
   * Get page audits by URL
   */
  async getPageAuditsByUrl(url: string): Promise<PageAuditsResponse> {
    try {
      const encodedUrl = encodeURIComponent(url);
      const response = await fetch(`${this.baseUrl}/page-audits/url/${encodedUrl}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error getting page audits by URL:', error);
      throw error;
    }
  }

  /**
   * Get page audits by page type
   */
  async getPageAuditsByPageType(pageType: string): Promise<PageAuditsResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/page-audits/page-type/${pageType}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error getting page audits by page type:', error);
      throw error;
    }
  }
}

export default new PageAuditService();
