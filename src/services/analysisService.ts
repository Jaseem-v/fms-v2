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
  private baseUrl: string;

  constructor() {
    // Try to get the backend URL from environment, fallback to localhost
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000/api';
    
    // Log the base URL for debugging
    console.log('AnalysisService initialized with baseUrl:', this.baseUrl);
  }

  // Polling methods
  async startHomepageAnalysis(domain: string): Promise<{ jobId: string }> {
    const response = await fetch(`${this.baseUrl}/analyze/homepage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain })
    });
    return response.json();
  }

  async startCollectionAnalysis(domain: string): Promise<{ jobId: string }> {
    const response = await fetch(`${this.baseUrl}/analyze/collection`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain })
    });
    return response.json();
  }

  async startProductAnalysis(domain: string): Promise<{ jobId: string }> {
    const response = await fetch(`${this.baseUrl}/analyze/product`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain })
    });
    return response.json();
  }

  async startCartAnalysis(domain: string): Promise<{ jobId: string }> {
    const response = await fetch(`${this.baseUrl}/analyze/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain })
    });
    return response.json();
  }

  async getAnalysisStatus(pageType: string, jobId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/analyze/${pageType}/status?jobId=${jobId}`);
    return response.json();
  }

  // Legacy EventSource methods (for backward compatibility)
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