import { config } from '@/config/config';

export interface Industry {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

class IndustryService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.backendUrl;
  }

  async getAllIndustries(): Promise<Industry[]> {
    try {
      const url = `${this.baseUrl}/industries`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('[INDUSTRY SERVICE] Error fetching industries:', error);
      throw error;
    }
  }

  async getIndustryById(id: string): Promise<Industry | null> {
    try {
      const response = await fetch(`${this.baseUrl}/industries/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || null;
    } catch (error) {
      console.error('[INDUSTRY SERVICE] Error fetching industry by ID:', error);
      throw error;
    }
  }
}

export default new IndustryService();