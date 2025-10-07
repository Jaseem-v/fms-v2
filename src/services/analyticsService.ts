import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL_WITHOUT_API || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Analytics service for tracking events and retrieving analytics data
 */
export class AnalyticsService {
  /**
   * Track an analytics event
   * @param eventData - The event data to track
   * @returns Promise<any> - API response
   */
  static async trackEvent(eventData: {
    eventType: 'url_entered' | 'fixmystore_clicked' | 'audit_completed' | 'page_selected' | 'popup_filled' | 'popup_closed' | 'report_viewed' | 'sample_report_viewed';
    sessionId: string;
    userId?: string;
    websiteUrl?: string;
    websiteName?: string;
    pageType?: string;
    reportId?: string;
    metadata?: any;
  }): Promise<any> {
    try {
      const response = await api.post('/api/analytics/track', eventData);
      return response.data;
    } catch (error: any) {
      console.error('Error tracking analytics event:', error);
      // Don't throw error to avoid breaking user experience
    }
  }

  /**
   * Generate a unique session ID
   * @returns string - Unique session ID
   */
  static generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get or create session ID from localStorage
   * @returns string - Session ID
   */
  static getSessionId(): string {
    if (typeof window === 'undefined') return '';
    
    let sessionId = localStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = this.generateSessionId();
      localStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Track URL entry event
   * @param websiteUrl - The website URL entered
   * @param websiteName - The website name (optional)
   */
  static async trackUrlEntry(websiteUrl: string, websiteName?: string): Promise<void> {
    try {
      await this.trackEvent({
        eventType: 'url_entered',
        sessionId: this.getSessionId(),
        websiteUrl,
        websiteName
      });
    } catch (error) {
      console.error('Failed to track URL entry:', error);
    }
  }

  /**
   * Track FixMyStore button click
   * @param websiteUrl - The website URL
   * @param websiteName - The website name (optional)
   */
  static async trackFixMyStoreClick(websiteUrl: string, websiteName?: string): Promise<void> {
    try {
      await this.trackEvent({
        eventType: 'fixmystore_clicked',
        sessionId: this.getSessionId(),
        websiteUrl,
        websiteName
      });
    } catch (error) {
      console.error('Failed to track FixMyStore click:', error);
    }
  }

  /**
   * Track successful audit completion
   * @param reportId - The report ID
   * @param websiteUrl - The website URL
   * @param websiteName - The website name (optional)
   */
  static async trackAuditCompleted(reportId: string, websiteUrl: string, websiteName?: string): Promise<void> {
    try {
      await this.trackEvent({
        eventType: 'audit_completed',
        sessionId: this.getSessionId(),
        reportId,
        websiteUrl,
        websiteName
      });
    } catch (error) {
      console.error('Failed to track audit completion:', error);
    }
  }

  /**
   * Track page selection for auditing
   * @param pageType - The type of page selected
   * @param websiteUrl - The website URL
   * @param websiteName - The website name (optional)
   */
  static async trackPageSelected(pageType: string, websiteUrl: string, websiteName?: string): Promise<void> {
    try {
      await this.trackEvent({
        eventType: 'page_selected',
        sessionId: this.getSessionId(),
        pageType,
        websiteUrl,
        websiteName
      });
    } catch (error) {
      console.error('Failed to track page selection:', error);
    }
  }

  /**
   * Track popup form filled
   * @param websiteUrl - The website URL
   * @param websiteName - The website name (optional)
   */
  static async trackPopupFilled(websiteUrl: string, websiteName?: string): Promise<void> {
    try {
      await this.trackEvent({
        eventType: 'popup_filled',
        sessionId: this.getSessionId(),
        websiteUrl,
        websiteName
      });
    } catch (error) {
      console.error('Failed to track popup fill:', error);
    }
  }

  /**
   * Track popup closed
   * @param websiteUrl - The website URL
   * @param websiteName - The website name (optional)
   */
  static async trackPopupClosed(websiteUrl: string, websiteName?: string): Promise<void> {
    try {
      await this.trackEvent({
        eventType: 'popup_closed',
        sessionId: this.getSessionId(),
        websiteUrl,
        websiteName
      });
    } catch (error) {
      console.error('Failed to track popup close:', error);
    }
  }

  /**
   * Track report view
   * @param reportId - The report ID
   * @param websiteUrl - The website URL
   * @param websiteName - The website name (optional)
   * @param clickCount - Number of clicks on the report page (optional)
   */
  static async trackReportView(reportId: string, websiteUrl: string, websiteName?: string, clickCount?: number): Promise<void> {
    try {
      await this.trackEvent({
        eventType: 'report_viewed',
        sessionId: this.getSessionId(),
        reportId,
        websiteUrl,
        websiteName,
        metadata: {
          clickCount,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Failed to track report view:', error);
    }
  }

  /**
   * Track sample report view
   * @param reportId - The report ID
   * @param websiteUrl - The website URL
   * @param websiteName - The website name (optional)
   * @param clickCount - Number of clicks on the report page (optional)
   */
  static async trackSampleReportView(reportId: string, websiteUrl: string, websiteName?: string, clickCount?: number): Promise<void> {
    try {
      await this.trackEvent({
        eventType: 'sample_report_viewed',
        sessionId: this.getSessionId(),
        reportId,
        websiteUrl,
        websiteName,
        metadata: {
          clickCount,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Failed to track sample report view:', error);
    }
  }

  /**
   * Extract website name from URL
   * @param url - The website URL
   * @returns string - Website name
   */
  static extractWebsiteName(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  }

}

export default AnalyticsService;
