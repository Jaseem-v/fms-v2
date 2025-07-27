interface ImageReference {
  id: string;
  imageUrl: string;
  useCases: string[];
  page: string;
  industry: string;
  uploadDate: string;
  fileName: string;
}

export class ImageReferenceService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api';
  }

  async getAllImages(): Promise<ImageReference[]> {
    const response = await fetch(`${this.baseUrl}/image-references`);
    const data = await response.json();
    return data.images || [];
  }

  async getImageById(id: string): Promise<ImageReference | null> {
    const response = await fetch(`${this.baseUrl}/image-references/${id}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data.image || null;
  }

  async deleteImage(id: string): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/image-references/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  }

  async updateImage(id: string, updates: { useCases?: string[]; page?: string; industry?: string }): Promise<ImageReference> {
    const response = await fetch(`${this.baseUrl}/image-references/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Update failed');
    }

    const data = await response.json();
    return data.image;
  }

  async uploadImage(
    file: File, 
    useCases: string[], 
    page: string,
    industry: string,
    onProgress?: (progress: number) => void
  ): Promise<ImageReference> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('useCases', JSON.stringify(useCases));
    formData.append('page', page);
    formData.append('industry', industry);

    const response = await fetch(`${this.baseUrl}/image-references/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Upload failed');
    }

    const data = await response.json();
    return data.imageRef;
  }

  async searchImages(query: string): Promise<ImageReference[]> {
    const response = await fetch(`${this.baseUrl}/image-references/search?query=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.images || [];
  }

  async getRelevantImages(problem: string, solution: string, page?: string): Promise<ImageReference[]> {
    const response = await fetch(`${this.baseUrl}/image-references/relevant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        problem,
        solution,
        page,
      }),
    });

    const data = await response.json();
    return data.images || [];
  }

  async analyzePageForProblems(pageDescription: string): Promise<{
    problems: string[];
    relevantImages: ImageReference[];
    suggestions: string[];
  }> {
    const response = await fetch(`${this.baseUrl}/image-references/analyze-page`, {
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

  async getImagesByCategory(category: string): Promise<ImageReference[]> {
    const response = await fetch(`${this.baseUrl}/image-references/category/${encodeURIComponent(category)}`);
    const data = await response.json();
    return data.images || [];
  }

  async getImagesByPageType(pageType: string): Promise<ImageReference[]> {
    const response = await fetch(`${this.baseUrl}/image-references/page-type/${encodeURIComponent(pageType)}`);
    const data = await response.json();
    return data.images || [];
  }

  async getSimilarImages(imageId: string): Promise<ImageReference[]> {
    const response = await fetch(`${this.baseUrl}/image-references/${imageId}/similar`);
    const data = await response.json();
    return data.images || [];
  }

  async getImagesByConversionGoal(goal: string): Promise<ImageReference[]> {
    const response = await fetch(`${this.baseUrl}/image-references/goal/${encodeURIComponent(goal)}`);
    const data = await response.json();
    return data.images || [];
  }

  async getImagesStatistics(): Promise<{
    totalImages: number;
    categories: Record<string, number>;
    pageTypes: Record<string, number>;
    recentUploads: ImageReference[];
  }> {
    const response = await fetch(`${this.baseUrl}/image-references/statistics`);
    if (!response.ok) {
      throw new Error('Failed to fetch statistics');
    }
    return await response.json();
  }
}

export default new ImageReferenceService(); 