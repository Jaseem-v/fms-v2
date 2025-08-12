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

  // Sequential analysis methods
  async startSequentialAnalysis(domain: string, orderId?: string): Promise<{ jobId: string }> {
    const response = await fetch(`${this.baseUrl}/analyze/sequential`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain, orderId })
    });
    return response.json();
  }

  async getSequentialAnalysisStatus(jobId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/analyze/sequential/status?jobId=${jobId}`);
    return response.json();
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