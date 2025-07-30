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
      const response = await fetch(`${this.baseUrl}/api/reports/slug/${slug}`, {
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
}

export default new ReportService();