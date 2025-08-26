"use client";

import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar } from "lucide-react";

export default function AttendeeLayout({ children }) {
  const { logout } = useAuth();
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <header className="flex h-16 items-center justify-between border-b px-6 bg-white">
          <Link className="flex items-center gap-2 font-semibold" href="/my-events">
            <Calendar className="h-6 w-6" />
            <span>Attendance Portal</span>
          </Link>
          <Button onClick={logout} variant="outline">Logout</Button>
        </header>
        <main className="flex-1 p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
