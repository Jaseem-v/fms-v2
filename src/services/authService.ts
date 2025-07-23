const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    _id: string;
    email: string;
    name: string;
    role: string;
    isActive: boolean;
    lastLogin?: string;
    createdAt: string;
    updatedAt: string;
  };
  message: string;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

class AuthService {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken');
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse = await response.json();

      if (data.success && data.token) {
        this.token = data.token;
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error occurred'
      };
    }
  }

  async logout(): Promise<void> {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }

  async verifyToken(): Promise<{ valid: boolean; user?: User }> {
    if (!this.token) {
      return { valid: false };
    }

    try {
      const response = await fetch(`${BACKEND_URL}/auth/verify-token`, {
        method: 'POST',
        headers: this.getHeaders(),
      });

      const data = await response.json();

      if (data.success && data.user) {
        return { valid: true, user: data.user };
      }

      return { valid: false };
    } catch (error) {
      console.error('Token verification error:', error);
      return { valid: false };
    }
  }

  async refreshToken(): Promise<{ success: boolean; token?: string }> {
    if (!this.token) {
      return { success: false };
    }

    try {
      const response = await fetch(`${BACKEND_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ token: this.token }),
      });

      const data = await response.json();

      if (data.success && data.token) {
        this.token = data.token;
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', data.token);
        }
        return { success: true, token: data.token };
      }

      return { success: false };
    } catch (error) {
      console.error('Token refresh error:', error);
      return { success: false };
    }
  }

  async getProfile(): Promise<{ success: boolean; user?: User }> {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/profile`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json();

      if (data.success && data.user) {
        return { success: true, user: data.user };
      }

      return { success: false };
    } catch (error) {
      console.error('Get profile error:', error);
      return { success: false };
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/change-password`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();
      return { success: data.success, message: data.message };
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, message: 'Network error occurred' };
    }
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch (error) {
          console.error('Error parsing user from localStorage:', error);
        }
      }
    }
    return null;
  }
}

export default new AuthService(); 