"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // This effect runs whenever the loading or user state changes.
    // We only want to redirect if the initial loading is complete AND there is no user.
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // While the initial check is running (loading is true),
  // or if we have finished loading but there is no user yet,
  // we show a loading screen. This prevents the redirect loop.
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          {/* A simple spinner for loading feedback */}
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If loading is finished and a user object exists,
  // we can safely render the protected page content.
  return children;
};

export default ProtectedRoute;