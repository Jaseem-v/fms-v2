interface AnalysisResult {
  success: boolean;
  pageType: string;
  screenshot: {
    filename: string;
    url: string;
  };
  analysis: any[];
  error?: string;
}

export class AnalysisService {
  private baseUrl = 'http://localhost:4000/api';

  analyzeHomepage(domain: string): EventSource {
    return new EventSource(`${this.baseUrl}/analyze/homepage?domain=${encodeURIComponent(domain)}`);
  }

  analyzeCollection(domain: string): EventSource {
    return new EventSource(`${this.baseUrl}/analyze/collection?domain=${encodeURIComponent(domain)}`);
  }

  analyzeProduct(domain: string): EventSource {
    return new EventSource(`${this.baseUrl}/analyze/product?domain=${encodeURIComponent(domain)}`);
  }

  analyzeCart(domain: string): EventSource {
    return new EventSource(`${this.baseUrl}/analyze/cart?domain=${encodeURIComponent(domain)}`);
  }

  async downloadReport(report: any, url: string, userInfo: any): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/download-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        report,
        url,
        userInfo,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate PDF');
    }

    return response.blob();
  }
}

export default new AnalysisService(); 