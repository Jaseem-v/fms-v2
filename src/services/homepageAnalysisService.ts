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

  async analyzePage(url: string, pageType: string = 'homepage'): Promise<PagewiseAnalysisResult> {
    try {
      const response = await fetch(`${this.baseUrl}/pagewise-analysis/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, pageType }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error analyzing page:', error);
      throw error;
    }
  }
}

export default new PagewiseAnalysisService();
