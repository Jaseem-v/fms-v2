export interface Prompt {
  id: string;
  name: string;
  description?: string;
  content: string;
  category: string;
  pageType?: string;
  industry?: string;
  country?: string;
  isActive: boolean;
  priority: number;
  variables: string[];
  
  // Enhanced fields
  promptType: string;
  analysisType?: string;
  targetAudience?: string;
  complexity: string;
  sections?: {
    title: string;
    content: string;
    order: number;
  }[];
  instructions?: string[];
  requirements?: string[];
  outputFormat?: string;
  context?: {
    industry?: string;
    pageType?: string;
    userType?: string;
    conversionGoal?: string;
  };
  usageCount: number;
  lastUsed?: string;
  successRate?: number;
  version: number;
  parentPromptId?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface CreatePromptData {
  name: string;
  description?: string;
  content: string;
  category: string;
  pageType?: string;
  industry?: string;
  country?: string;
  priority?: number;
  variables?: string[];
  
  // Enhanced fields
  promptType?: string;
  analysisType?: string;
  targetAudience?: string;
  complexity?: string;
  sections?: {
    title: string;
    content: string;
    order: number;
  }[];
  instructions?: string[];
  requirements?: string[];
  outputFormat?: string;
  context?: {
    industry?: string;
    pageType?: string;
    userType?: string;
    conversionGoal?: string;
  };
  parentPromptId?: string;
}

export interface UpdatePromptData {
  name?: string;
  description?: string;
  content?: string;
  category?: string;
  pageType?: string;
  industry?: string;
  country?: string;
  isActive?: boolean;
  priority?: number;
  variables?: string[];
  
  // Enhanced fields
  promptType?: string;
  analysisType?: string;
  targetAudience?: string;
  complexity?: string;
  sections?: {
    title: string;
    content: string;
    order: number;
  }[];
  instructions?: string[];
  requirements?: string[];
  outputFormat?: string;
  context?: {
    industry?: string;
    pageType?: string;
    userType?: string;
    conversionGoal?: string;
  };
}

export interface PromptFilters {
  category?: string;
  pageType?: string;
  industry?: string;
  country?: string;
  isActive?: boolean;
  search?: string;
  
  // Enhanced filters
  promptType?: string;
  analysisType?: string;
  complexity?: string;
  targetAudience?: string;
}

export interface PromptStatistics {
  total: number;
  active: number;
  inactive: number;
  byCategory: Record<string, number>;
  byPromptType: Record<string, number>;
  byComplexity: Record<string, number>;
  mostUsed: Prompt[];
}

class PromptService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000/api';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${this.baseUrl}/prompts${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data || data;
  }

  async createPrompt(promptData: CreatePromptData): Promise<Prompt> {
    return this.request<Prompt>('', {
      method: 'POST',
      body: JSON.stringify(promptData),
    });
  }

  async getAllPrompts(filters: PromptFilters = {}): Promise<Prompt[]> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const endpoint = params.toString() ? `?${params.toString()}` : '';
    return this.request<Prompt[]>(endpoint);
  }

  async getPromptById(id: string): Promise<Prompt> {
    return this.request<Prompt>(`/${id}`);
  }

  async updatePrompt(id: string, updateData: UpdatePromptData): Promise<Prompt> {
    return this.request<Prompt>(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deletePrompt(id: string): Promise<boolean> {
    return this.request<boolean>(`/${id}`, {
      method: 'DELETE',
    });
  }

  async getPromptsByCategory(category: string, filters: Omit<PromptFilters, 'category'> = {}): Promise<Prompt[]> {
    const params = new URLSearchParams();
    params.append('category', category);
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const endpoint = `?${params.toString()}`;
    return this.request<Prompt[]>(endpoint);
  }

  async searchPrompts(query: string): Promise<Prompt[]> {
    return this.request<Prompt[]>(`/search?q=${encodeURIComponent(query)}`);
  }

  async togglePromptStatus(id: string): Promise<Prompt> {
    return this.request<Prompt>(`/${id}/toggle`, {
      method: 'PUT',
    });
  }

  async getPromptByContext(
    category: string,
    pageType?: string,
    industry?: string,
    country?: string
  ): Promise<Prompt[]> {
    const params = new URLSearchParams();
    params.append('category', category);
    
    if (pageType) params.append('pageType', pageType);
    if (industry) params.append('industry', industry);
    if (country) params.append('country', country);

    const endpoint = `?${params.toString()}`;
    return this.request<Prompt[]>(endpoint);
  }

  async duplicatePrompt(id: string): Promise<Prompt> {
    return this.request<Prompt>(`/${id}/duplicate`, {
      method: 'POST',
    });
  }

  async getPromptStatistics(): Promise<PromptStatistics> {
    return this.request<PromptStatistics>('/statistics');
  }

  // Helper method to get active prompts
  async getActivePrompts(filters: PromptFilters = {}): Promise<Prompt[]> {
    return this.getAllPrompts({ ...filters, isActive: true });
  }

  // Helper method to get prompts for a specific use case
  async getPromptsForAnalysis(pageType?: string, industry?: string, country?: string): Promise<Prompt[]> {
    return this.getPromptByContext('analysis', pageType, industry, country);
  }

  async getPromptsForReport(pageType?: string, industry?: string, country?: string): Promise<Prompt[]> {
    return this.getPromptByContext('report', pageType, industry, country);
  }

  async getPromptsForScreenshot(pageType?: string, industry?: string, country?: string): Promise<Prompt[]> {
    return this.getPromptByContext('screenshot', pageType, industry, country);
  }

  // New enhanced methods
  async getPromptsByType(promptType: string, filters: Omit<PromptFilters, 'promptType'> = {}): Promise<Prompt[]> {
    const params = new URLSearchParams();
    params.append('promptType', promptType);
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const endpoint = `?${params.toString()}`;
    return this.request<Prompt[]>(endpoint);
  }

  async getPromptsByComplexity(complexity: string, filters: Omit<PromptFilters, 'complexity'> = {}): Promise<Prompt[]> {
    const params = new URLSearchParams();
    params.append('complexity', complexity);
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const endpoint = `?${params.toString()}`;
    return this.request<Prompt[]>(endpoint);
  }

  async incrementUsageCount(id: string): Promise<void> {
    return this.request<void>(`/${id}/increment-usage`, {
      method: 'PUT',
    });
  }

  async updateSuccessRate(id: string, successRate: number): Promise<void> {
    return this.request<void>(`/${id}/success-rate`, {
      method: 'PUT',
      body: JSON.stringify({ successRate }),
    });
  }

  async getPromptVersions(parentPromptId: string): Promise<Prompt[]> {
    return this.request<Prompt[]>(`/versions/${parentPromptId}`);
  }

  async createPromptVersion(parentPromptId: string, data: CreatePromptData): Promise<Prompt> {
    return this.request<Prompt>(`/versions/${parentPromptId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getComprehensivePrompts(pageType: string, industry?: string, country?: string): Promise<Prompt[]> {
    const params = new URLSearchParams();
    params.append('promptType', 'analysis');
    params.append('analysisType', 'comprehensive');
    params.append('pageType', pageType);
    
    if (industry) params.append('industry', industry);
    if (country) params.append('country', country);

    const endpoint = `?${params.toString()}`;
    return this.request<Prompt[]>(endpoint);
  }

  async getFocusedPrompts(pageType: string, specificArea: string): Promise<Prompt[]> {
    const params = new URLSearchParams();
    params.append('promptType', 'analysis');
    params.append('analysisType', 'focused');
    params.append('pageType', pageType);
    params.append('search', specificArea);

    const endpoint = `?${params.toString()}`;
    return this.request<Prompt[]>(endpoint);
  }
}

export default new PromptService(); 