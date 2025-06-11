'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = '/auth/login',
  fallback,
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isLoading, isAuthenticated, router, redirectTo]);

  // Show loading state
  if (isLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      )
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  // Check role if required
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Required role: {requiredRole} | Your role: {user?.role}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 