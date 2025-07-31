export interface CreateReportRequest {
  websiteUrl: string;
  analysisData: any;
  screenshots: {
    [key: string]: {
      filename: string;
      url: string;
    };
  };
  userInfo?: {
    name: string;
    email: string;
    mobile?: string;
  };
  paymentId?: string;
}

export interface UpdateReportRequest {
  analysisData?: any;
  screenshots?: {
    [key: string]: {
      filename: string;
      url: string;
    };
  };
  status?: 'pending' | 'completed' | 'failed';
  progress?: {
    currentStep: number;
    totalSteps: number;
    currentPage?: string;
    completedPages?: string[];
  };
}

export interface ReportResponse {
  success: boolean;
  report?: any;
  reportUrl?: string;
  message?: string;
}

class ReportService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
  }

  async createReport(data: CreateReportRequest): Promise<ReportResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/reports/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          report: result.report,
          reportUrl: result.reportUrl,
        };
      } else {
        return {
          success: false,
          message: result.message || 'Failed to create report',
        };
      }
    } catch (error) {
      console.error('Report creation error:', error);
      return {
        success: false,
        message: 'Network error occurred',
      };
    }
  }

  async getReportBySlug(slug: string): Promise<ReportResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/reports/slug/${slug}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          report: result.report,
        };
      } else {
        return {
          success: false,
          message: result.message || 'Failed to get report',
        };
      }
    } catch (error) {
      console.error('Get report error:', error);
      return {
        success: false,
        message: 'Network error occurred',
      };
    }
  }

  async getReportById(id: string): Promise<ReportResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/reports/id/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          report: result.report,
        };
      } else {
        return {
          success: false,
          message: result.message || 'Failed to get report',
        };
      }
    } catch (error) {
      console.error('Get report by ID error:', error);
      return {
        success: false,
        message: 'Network error occurred',
      };
    }
  }

  async updateReport(reportId: string, data: UpdateReportRequest): Promise<ReportResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/reports/${reportId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          report: result.report,
          reportUrl: result.reportUrl,
        };
      } else {
        return {
          success: false,
          message: result.message || 'Failed to update report',
        };
      }
    } catch (error) {
      console.error('Report update error:', error);
      return {
        success: false,
        message: 'Network error occurred',
      };
    }
  }

  async updateReportProgress(reportId: string, progress: {
    currentStep: number;
    totalSteps: number;
    currentPage?: string;
    completedPages?: string[];
  }): Promise<ReportResponse> {
    return this.updateReport(reportId, { progress });
  }

  async updateReportAnalysisData(reportId: string, analysisData: any): Promise<ReportResponse> {
    return this.updateReport(reportId, { analysisData });
  }

  async updateReportScreenshots(reportId: string, screenshots: {
    [key: string]: {
      filename: string;
      url: string;
    };
  }): Promise<ReportResponse> {
    return this.updateReport(reportId, { screenshots });
  }

  async completeReport(reportId: string): Promise<ReportResponse> {
    const result = await this.updateReport(reportId, { status: 'completed' });
    
    // If successful and we have a report, construct the URL
    if (result.success && result.report) {
      const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
      result.reportUrl = `${frontendUrl}/report/${result.report.slug}`;
    }
    
    return result;
  }

  async failReport(reportId: string): Promise<ReportResponse> {
    return this.updateReport(reportId, { status: 'failed' });
  }
}

export default new ReportService();