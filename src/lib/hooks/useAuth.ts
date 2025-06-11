import { useState, useEffect, useCallback } from 'react';
import { AuthService, AuthUser, LoginRequest } from '../services/auth';

interface UseAuthReturn {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  isAdmin: boolean;
  hasRole: (role: string) => boolean;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = () => {
      try {
        if (AuthService.isAuthenticated()) {
          const storedUser = AuthService.getUser();
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        AuthService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await AuthService.login(credentials);
      setUser(response.user);
    } catch (error) {
      setUser(null);
      throw error; // Re-throw to let the component handle the error
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    AuthService.logout();
    setUser(null);
  }, []);

  // Refresh user profile
  const refreshProfile = useCallback(async () => {
    if (!AuthService.isAuthenticated()) {
      setUser(null);
      return;
    }

    try {
      const profile = await AuthService.getProfile();
      setUser(profile);
    } catch (error) {
      console.error('Failed to refresh profile:', error);
      // If refresh fails with auth error, logout
      if (error instanceof Error && error.message.includes('Session expired')) {
        logout();
      }
      throw error;
    }
  }, [logout]);

  // Role checking functions
  const hasRole = useCallback((role: string) => {
    return user?.role === role;
  }, [user]);

  const isAdmin = useCallback(() => {
    return hasRole('admin');
  }, [hasRole]);

  // Check for token expiration periodically
  useEffect(() => {
    if (!user) return;

    const checkTokenExpiration = () => {
      if (!AuthService.isAuthenticated()) {
        logout();
      } else if (AuthService.isTokenExpiringSoon()) {
        // Optionally, you could implement token refresh here
        console.warn('Token expires soon. Consider implementing token refresh.');
      }
    };

    // Check every minute
    const interval = setInterval(checkTokenExpiration, 60000);
    
    return () => clearInterval(interval);
  }, [user, logout]);

  return {
    user,
    isAuthenticated: !!user && AuthService.isAuthenticated(),
    isLoading,
    login,
    logout,
    refreshProfile,
    isAdmin: isAdmin(),
    hasRole,
  };
} 