import { config } from '@/config/config';

export interface Industry {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIndustryRequest {
  name: string;
  description?: string;
}

export interface UpdateIndustryRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface IndustryResponse {
  success: boolean;
  data: Industry | Industry[];
  count?: number;
  message?: string;
  error?: string;
}

class IndustryService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000/api';
  }


  async getAllIndustries(includeInactive: boolean = false): Promise<Industry[]> {
    const url = new URL(`${this.baseUrl}/industries`);
    if (includeInactive) {
      url.searchParams.append('includeInactive', 'true');
    }

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch industries');
    }

    const data: IndustryResponse = await response.json();
    return data.data as Industry[];
  }

  async getIndustryById(id: string): Promise<Industry> {
    const response = await fetch(`${this.baseUrl}/industries/${id}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch industry');
    }

    const data: IndustryResponse = await response.json();
    return data.data as Industry;
  }

  async createIndustry(industryData: CreateIndustryRequest): Promise<Industry> {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${this.baseUrl}/industries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(industryData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create industry');
    }

    const data: IndustryResponse = await response.json();
    return data.data as Industry;
  }

  async updateIndustry(id: string, industryData: UpdateIndustryRequest): Promise<Industry> {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${this.baseUrl}/industries/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(industryData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update industry');
    }

    const data: IndustryResponse = await response.json();
    return data.data as Industry;
  }

  async deleteIndustry(id: string): Promise<void> {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${this.baseUrl}/industries/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete industry');
    }
  }

  async searchIndustries(query: string): Promise<Industry[]> {
    const url = new URL(`${this.baseUrl}/industries/search`);
    url.searchParams.append('q', query);

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to search industries');
    }

    const data: IndustryResponse = await response.json();
    return data.data as Industry[];
  }

  async getIndustryCount(): Promise<number> {
    const response = await fetch(`${this.baseUrl}/industries/count`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get industry count');
    }

    const data: IndustryResponse = await response.json();
    return data.count || 0;
  }
}

export default new IndustryService();