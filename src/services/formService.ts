const BACKEND_URL = '/api'; // Use Next.js API route instead of direct backend URL

export interface FormData {
  name: string;
  websiteUrl: string;
  phoneNumber: string;
  email: string;
}

export interface FormResponse {
  success: boolean;
  message: string;
}

class FormService {
  async submitForm(formData: FormData): Promise<FormResponse> {
    try {
      const response = await fetch(`${BACKEND_URL}/form/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data: FormResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Form submission error:', error);
      return {
        success: false,
        message: 'Network error occurred'
      };
    }
  }
}

export default new FormService(); 