interface AIChunk {
  id: string;
  imageUrl: string;
  useCases: string;
  uploadDate: string;
  fileName: string;
}

export class AIChunkService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api';
  }

  async getAllChunks(): Promise<AIChunk[]> {
    const response = await fetch(`${this.baseUrl}/ai-chunks`);
    const data = await response.json();
    return data.chunks || [];
  }

  async getChunkById(id: string): Promise<AIChunk | null> {
    const response = await fetch(`${this.baseUrl}/ai-chunks/${id}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data.chunk || null;
  }

  async deleteChunk(id: string): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/ai-chunks/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  }

  async uploadImage(
    file: File, 
    useCases: string, 
    onProgress?: (progress: number) => void
  ): Promise<AIChunk> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('useCases', useCases);

    const response = await fetch(`${this.baseUrl}/ai-chunks/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Upload failed');
    }

    const data = await response.json();
    return data.chunk;
  }

  async searchChunks(query: string): Promise<AIChunk[]> {
    const response = await fetch(`${this.baseUrl}/ai-chunks/search?query=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.chunks || [];
  }

  async getRelevantChunks(problem: string, solution: string): Promise<AIChunk[]> {
    const response = await fetch(`${this.baseUrl}/ai-chunks/relevant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        problem,
        solution,
      }),
    });

    const data = await response.json();
    return data.chunks || [];
  }

  async analyzePageForProblems(pageDescription: string): Promise<{
    problems: string[];
    relevantChunks: AIChunk[];
    suggestions: string[];
  }> {
    const response = await fetch(`${this.baseUrl}/ai-chunks/analyze-page`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pageDescription,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Analysis failed');
    }

    return await response.json();
  }

  async getChunksByCategory(category: string): Promise<AIChunk[]> {
    const response = await fetch(`${this.baseUrl}/ai-chunks/category/${encodeURIComponent(category)}`);
    const data = await response.json();
    return data.chunks || [];
  }

  async getChunksByPageType(pageType: string): Promise<AIChunk[]> {
    const response = await fetch(`${this.baseUrl}/ai-chunks/page-type/${encodeURIComponent(pageType)}`);
    const data = await response.json();
    return data.chunks || [];
  }

  async getSimilarChunks(chunkId: string): Promise<AIChunk[]> {
    const response = await fetch(`${this.baseUrl}/ai-chunks/${chunkId}/similar`);
    const data = await response.json();
    return data.chunks || [];
  }

  async getChunksByConversionGoal(goal: string): Promise<AIChunk[]> {
    const response = await fetch(`${this.baseUrl}/ai-chunks/goal/${encodeURIComponent(goal)}`);
    const data = await response.json();
    return data.chunks || [];
  }

  async getChunksStatistics(): Promise<{
    totalChunks: number;
    categories: Record<string, number>;
    pageTypes: Record<string, number>;
    recentUploads: AIChunk[];
  }> {
    const response = await fetch(`${this.baseUrl}/ai-chunks/statistics`);
    if (!response.ok) {
      throw new Error('Failed to fetch statistics');
    }
    return await response.json();
  }
}

export default new AIChunkService(); 