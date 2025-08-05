import { config } from '@/config/config';

export interface Screenshot {
  filename: string;
  size: number;
  createdAt: string;
  modifiedAt: string;
}

export interface ScreenshotsResponse {
  success: boolean;
  screenshots: Screenshot[];
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}

class ScreenshotService {
  private baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || config.apiUrl;

  async listScreenshots(): Promise<ScreenshotsResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/screenshots/list`);
      if (!response.ok) {
        throw new Error('Failed to fetch screenshots');
      }
      return await response.json();
    } catch (error) {
      console.error('Error listing screenshots:', error);
      throw error;
    }
  }

  async deleteScreenshot(filename: string): Promise<DeleteResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/screenshots/delete/${encodeURIComponent(filename)}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete screenshot');
      }
      return await response.json();
    } catch (error) {
      console.error('Error deleting screenshot:', error);
      throw error;
    }
  }

  async deleteAllScreenshots(): Promise<DeleteResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/screenshots/delete-all`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete all screenshots');
      }
      return await response.json();
    } catch (error) {
      console.error('Error deleting all screenshots:', error);
      throw error;
    }
  }

  getScreenshotUrl(filename: string): string {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL_WITHOUT_API}/screenshots/${encodeURIComponent(filename)}`;
  }
}

export default new ScreenshotService(); 