import { config } from '../config/config';

interface PagewiseAnalysisResult {
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
    app_reference?: string;
    appReferenceObject?: any;
  }>;
}

class PagewiseAnalysisService {
  private baseUrl = config.backendUrl;

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Get token from localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async analyzePage(url: string, pageType: string = 'homepage', requireAuth: boolean = false): Promise<PagewiseAnalysisResult> {
    try {
      // Choose endpoint based on authentication requirement
      const endpoint = requireAuth ? '/pagewise-analysis/analyze' : '/pagewise-analysis/analyze-public';
      
      // Create AbortController for timeout management
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minutes timeout
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ url, pageType }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error analyzing page:', error);
      
      // Handle timeout specifically
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Analysis request timed out after 2 minutes. Please try again.');
      }
      
      throw error;
    }
  }
}

export default new PagewiseAnalysisService();
