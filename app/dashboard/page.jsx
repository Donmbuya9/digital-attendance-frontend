"use client";

import { Button } from '@/components/ui/button';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

function DashboardContent() {
  const { user, logout } = useAuth();

  if (!user) {
    return null; // Should be handled by ProtectedRoute, but good practice
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to the Dashboard!</h1>
        <p className="text-gray-600 mb-2">Hello, {user.firstName} {user.lastName}</p>
        <p className="text-gray-600 mb-2">Email: {user.email}</p>
        <p className="text-gray-600 mb-6">Your role is: <span className="font-semibold">{user.role}</span></p>
        <Button onClick={logout} variant="outline" className="w-full">
          Logout
        </Button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
