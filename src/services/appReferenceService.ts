interface AppReference {
  id: string;
  name: string;
  iconUrl: string;
  description: string;
  useCases: string[];
  shopifyAppUrl: string;
  category: string;
  scrapedAt: string;
}

interface ScrapedAppData {
  name: string;
  iconUrl: string;
  description: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
}

class AppReferenceService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api';
  }

  async getAllAppReferences(): Promise<AppReference[]> {
    try {
      const response = await fetch(`${this.baseUrl}/app-references`);
      const data: ApiResponse<AppReference[]> = await response.json();

      if (data.success && data.data) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch app references');
      }
    } catch (error) {
      console.error('Error fetching app references:', error);
      throw error;
    }
  }

  async addAppReference(appUrl: string, useCases: string[]): Promise<AppReference> {
    try {
      const response = await fetch(`${this.baseUrl}/app-references`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appUrl,
          useCases
        }),
      });

      const data: ApiResponse<AppReference> = await response.json();

      if (data.success && data.data) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to add app reference');
      }
    } catch (error) {
      console.error('Error adding app reference:', error);
      throw error;
    }
  }

  async deleteAppReference(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/app-references/${id}`, {
        method: 'DELETE',
      });

      const data: ApiResponse<null> = await response.json();

      if (data.success) {
        return true;
      } else {
        throw new Error(data.message || 'Failed to delete app reference');
      }
    } catch (error) {
      console.error('Error deleting app reference:', error);
      throw error;
    }
  }

  async updateAppReference(id: string, updates: Partial<Omit<AppReference, 'id'>>): Promise<AppReference> {
    try {
      const response = await fetch(`${this.baseUrl}/app-references/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const data: ApiResponse<AppReference> = await response.json();

      if (data.success && data.data) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to update app reference');
      }
    } catch (error) {
      console.error('Error updating app reference:', error);
      throw error;
    }
  }

  async scrapeAppData(appUrl: string): Promise<ScrapedAppData> {
    try {
      const response = await fetch(`${this.baseUrl}/app-references/scrape`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ appUrl }),
      });

      const data: ApiResponse<ScrapedAppData> = await response.json();

      if (data.success && data.data) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to scrape app data');
      }
    } catch (error) {
      console.error('Error scraping app data:', error);
      throw error;
    }
  }

  // Helper method to get app suggestions based on analysis keywords
  async getAppSuggestions(keywords: string[]): Promise<AppReference[]> {
    try {
      const allApps = await this.getAllAppReferences();

      // Simple keyword matching - can be enhanced with more sophisticated algorithms
      return allApps.filter(app => {
        const appText = `${app.name} ${app.description} ${app.useCases.join(' ')} ${app.category}`.toLowerCase();
        return keywords.some(keyword => appText.includes(keyword.toLowerCase()));
      });
    } catch (error) {
      console.error('Error getting app suggestions:', error);
      return [];
    }
  }
}

export default new AppReferenceService();
export type { AppReference, ScrapedAppData }; 