// API Base Configuration
export const API_BASE_URL = 'http://127.0.0.1:5000/api';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string | null;
  data: T;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  admin: {
    id: number;
    email: string;
    name: string;
  };
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  user_type: string;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  preferred_language: string;
  registration_date: string;
  created_at: string;
}

export interface Contributor {
  id: number;
  user_id: number;
  contributor_type: string;
  verification_status: string;
  verified: boolean;
  motivation: string;
  created_at: string;
}

export interface Location {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  type: string;
  created_at: string;
}

export interface Emergency {
  id: number;
  user_id: number;
  latitude: number;
  longitude: number;
  status: string;
  emergency_type: string;
  description: string;
  created_at: string;
}

// Token Management
class TokenManager {
  private static instance: TokenManager;
  
  private constructor() {}
  
  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_access_token');
    }
    return null;
  }

  getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_refresh_token');
    }
    return null;
  }

  setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_access_token', accessToken);
      localStorage.setItem('admin_refresh_token', refreshToken);
    }
  }

  clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_access_token');
      localStorage.removeItem('admin_refresh_token');
    }
  }

  isAuthenticated(): boolean {
    return this.getAccessToken() !== null;
  }
}

// API Client Class
class ApiClient {
  private tokenManager: TokenManager;
  
  constructor() {
    this.tokenManager = TokenManager.getInstance();
  }

  private async makeRequest<T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const fullUrl = `${API_BASE_URL}${url}`;
    
    // Add authorization header if token exists
    const accessToken = this.tokenManager.getAccessToken();
    if (accessToken) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`,
      };
    }

    // Add content type for JSON requests
    if (options.body && typeof options.body === 'string') {
      options.headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };
    }

    try {
      const response = await fetch(fullUrl, options);
      
      // Handle token expiration
      if (response.status === 401 && accessToken) {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry original request with new token
          const newToken = this.tokenManager.getAccessToken();
          if (newToken) {
            options.headers = {
              ...options.headers,
              'Authorization': `Bearer ${newToken}`,
            };
            const retryResponse = await fetch(fullUrl, options);
            return await retryResponse.json();
          }
        } else {
          // Redirect to login
          this.tokenManager.clearTokens();
          if (typeof window !== 'undefined') {
            window.location.href = '/admin/login';
          }
          throw new Error('Authentication failed');
        }
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private async refreshToken(): Promise<boolean> {
    const refreshToken = this.tokenManager.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (response.ok) {
        const data: ApiResponse<{ access_token: string }> = await response.json();
        this.tokenManager.setTokens(data.data.access_token, refreshToken);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }

    return false;
  }

  // Authentication Methods
  async adminLogin(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    const response = await this.makeRequest<LoginResponse>('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.success) {
      this.tokenManager.setTokens(
        response.data.access_token,
        response.data.refresh_token
      );
    }
    
    return response;
  }

  async adminLogout(): Promise<void> {
    const refreshToken = this.tokenManager.getRefreshToken();
    if (refreshToken) {
      try {
        await this.makeRequest('/admin/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
      } catch (error) {
        console.error('Logout request failed:', error);
      }
    }
    this.tokenManager.clearTokens();
  }

  async getAdminProfile(): Promise<ApiResponse<{ admin: any }>> {
    return this.makeRequest('/admin/auth/profile');
  }

  // User Management Methods
  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.makeRequest('/users');
  }

  async getUserById(id: number): Promise<ApiResponse<User>> {
    return this.makeRequest(`/users/${id}`);
  }

  async updateUser(id: number, userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.makeRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: number): Promise<ApiResponse<{ message: string }>> {
    return this.makeRequest(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Contributor Management Methods
  async getContributors(): Promise<ApiResponse<Contributor[]>> {
    return this.makeRequest('/contributors');
  }

  async getContributorById(id: number): Promise<ApiResponse<Contributor>> {
    return this.makeRequest(`/contributors/${id}`);
  }

  async updateContributor(id: number, contributorData: Partial<Contributor>): Promise<ApiResponse<Contributor>> {
    return this.makeRequest(`/contributors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contributorData),
    });
  }

  async deleteContributor(id: number): Promise<ApiResponse<{ message: string }>> {
    return this.makeRequest(`/contributors/${id}`, {
      method: 'DELETE',
    });
  }

  // Location Management Methods (placeholder - endpoints may need to be created in backend)
  async getLocations(): Promise<ApiResponse<Location[]>> {
    return this.makeRequest('/locations');
  }

  // Emergency Management Methods (placeholder - endpoints may need to be created in backend)
  async getEmergencies(): Promise<ApiResponse<Emergency[]>> {
    return this.makeRequest('/emergencies');
  }

  // Helper method to check authentication
  isAuthenticated(): boolean {
    return this.tokenManager.isAuthenticated();
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export { TokenManager };