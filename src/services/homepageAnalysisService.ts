import { config } from '../config/config';

interface HomepageAnalysisResult {
  screenshotPath: string;
  imageAnalysis: string;
  checklistAnalysis: Array<{
    checklistItem: string;
    status: string;
    reason: string;
    problemName?: string;
    problem?: string;
    solution?: string;
  }>;
}

class HomepageAnalysisService {
  private baseUrl = config.backendUrl;

  async analyzeHomepage(url: string): Promise<HomepageAnalysisResult> {
    try {
      const response = await fetch(`${this.baseUrl}/homepage-analysis/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error analyzing homepage:', error);
      throw error;
    }
  }
}

export default new HomepageAnalysisService();
