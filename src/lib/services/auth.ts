import api from '../axios';

// Types matching the Go backend structures
export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  token: string;
  user: UserResponse;
  expires_at: number;
}

export interface AuthUser {
  id: number;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

// Token storage keys
const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const EXPIRES_KEY = 'auth-expires';

export class AuthService {
  // Login user
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      const { token, user, expires_at } = response.data;
      
      // Store auth data in localStorage
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      localStorage.setItem(EXPIRES_KEY, expires_at.toString());
      
      return response.data;
    } catch (error: unknown) {
      // Handle specific error cases
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 401) {
          throw new Error('Invalid email or password');
        }
        if (axiosError.response?.status === 400) {
          throw new Error('Email and password are required');
        }
      }
      throw new Error('Login failed. Please try again.');
    }
  }

  // Logout user
  static logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(EXPIRES_KEY);
  }

  // Get current user profile from API
  static async getProfile(): Promise<AuthUser> {
    try {
      const response = await api.get<AuthUser>('/auth/me');
      
      // Update stored user data
      localStorage.setItem(USER_KEY, JSON.stringify(response.data));
      
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 401) {
          // Token is invalid, clear auth data
          this.logout();
          throw new Error('Session expired. Please login again.');
        }
      }
      throw new Error('Failed to fetch user profile');
    }
  }

  // Get stored token
  static getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  // Get stored user
  static getUser(): AuthUser | null {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const token = this.getToken();
    const expiresStr = localStorage.getItem(EXPIRES_KEY);
    
    if (!token || !expiresStr) {
      return false;
    }
    
    // Check if token is expired
    const expiresAt = parseInt(expiresStr, 10);
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    
    if (now >= expiresAt) {
      // Token expired, clear auth data
      this.logout();
      return false;
    }
    
    return true;
  }

  // Check if token expires soon (within 5 minutes)
  static isTokenExpiringSoon(): boolean {
    const expiresStr = localStorage.getItem(EXPIRES_KEY);
    if (!expiresStr) return false;
    
    const expiresAt = parseInt(expiresStr, 10);
    const now = Math.floor(Date.now() / 1000);
    const fiveMinutes = 5 * 60; // 5 minutes in seconds
    
    return (expiresAt - now) <= fiveMinutes;
  }

  // Get token expiration date
  static getTokenExpiration(): Date | null {
    const expiresStr = localStorage.getItem(EXPIRES_KEY);
    if (!expiresStr) return null;
    
    const expiresAt = parseInt(expiresStr, 10);
    return new Date(expiresAt * 1000); // Convert from seconds to milliseconds
  }

  // Check user role
  static hasRole(role: string): boolean {
    const user = this.getUser();
    return user?.role === role;
  }

  // Check if user is admin
  static isAdmin(): boolean {
    return this.hasRole('admin');
  }
}

// Convenience exports
export const {
  login,
  logout,
  getProfile,
  getToken,
  getUser,
  isAuthenticated,
  isTokenExpiringSoon,
  getTokenExpiration,
  hasRole,
  isAdmin,
} = AuthService; 